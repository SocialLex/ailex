"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronLeft, ChevronRight, Play, Pause,
  RotateCcw, X, MonitorPlay, Clock, Presentation,
} from "lucide-react"
import Link from "next/link"
import type { PresentationData, PresentSlide } from "@/lib/present/types"

const GARAMOND = { fontFamily: "'EB Garamond', Georgia, serif" }

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  return `${m.toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`
}

/* ── Slide preview (used in center panel + timeline) ─────────────── */
function SlidePreview({
  slide,
  total,
  mini = false,
}: {
  slide: PresentSlide
  total: number
  mini?: boolean
}) {
  return (
    <div className={`w-full h-full flex flex-col ${mini ? "p-2" : "p-8"} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 to-blue-600/5" />
      <div className="relative z-10 flex flex-col h-full">
        {slide.type === "cover" && (
          <div className={`flex flex-col items-center justify-center h-full text-center ${mini ? "gap-1" : "gap-4"}`}>
            {!mini && <p className="text-[10px] tracking-widest text-cyan-500 uppercase font-semibold">AiLex</p>}
            <h2
              style={GARAMOND}
              className={`font-bold text-white leading-tight ${mini ? "text-[8px]" : "text-2xl"}`}
            >
              {slide.title}
            </h2>
            {!mini && slide.keyPoints[0] && (
              <p className="text-xs text-slate-400">{slide.keyPoints[0]}</p>
            )}
          </div>
        )}
        {slide.type === "content" && (
          <div className={`flex flex-col h-full ${mini ? "gap-1" : "gap-4"}`}>
            {!mini && (
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-cyan-500/20" />
                <span className="text-[9px] font-mono text-cyan-500/50 tracking-widest uppercase">
                  {slide.index} / {total - 1}
                </span>
              </div>
            )}
            <h2
              style={GARAMOND}
              className={`font-bold text-white leading-tight ${mini ? "text-[8px]" : "text-xl"}`}
            >
              {slide.title}
            </h2>
            {!mini && (
              <ul className="space-y-2 flex-1">
                {slide.keyPoints.slice(0, 3).map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                    <span className="line-clamp-2">{kp}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {slide.type === "closing" && (
          <div className={`flex flex-col items-center justify-center h-full text-center ${mini ? "gap-1" : "gap-4"}`}>
            <h2
              style={GARAMOND}
              className={`font-bold text-white ${mini ? "text-[8px]" : "text-3xl"}`}
            >
              {slide.title}
            </h2>
            {!mini && <p className="text-[10px] tracking-widest text-cyan-500 uppercase">AiLex</p>}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Main controls page ──────────────────────────────────────────── */
export default function ControlsPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PresentationData | null>(null)
  const [current, setCurrent] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const channelRef = useRef<BroadcastChannel | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Load data
  useEffect(() => {
    const raw = localStorage.getItem(`ailex_present_${id}`)
    if (raw) setData(JSON.parse(raw))
  }, [id])

  // BroadcastChannel — controls only sends
  useEffect(() => {
    if (!window.BroadcastChannel) return
    channelRef.current = new BroadcastChannel(`ailex_present_${id}`)
    return () => { channelRef.current?.close() }
  }, [id])

  // Timer
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  const goToSlide = useCallback(
    (index: number) => {
      if (!data || index < 0 || index >= data.slides.length) return
      setCurrent(index)
      channelRef.current?.postMessage({ type: "SLIDE_CHANGE", index })
      // Scroll thumbnail into view
      const thumb = timelineRef.current?.children[index] as HTMLElement | undefined
      thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    },
    [data]
  )

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goToSlide(current + 1) }
      if (e.key === "ArrowLeft") { e.preventDefault(); goToSlide(current - 1) }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [current, goToSlide])

  const openProjection = () => window.open(`/present/${id}`, `ailex_proj_${id}`)

  if (!data) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Presentation size={32} className="mx-auto text-slate-600" />
          <p className="text-slate-400 text-sm">Présentation introuvable.</p>
          <Link href="/newsletter" className="text-cyan-400 hover:underline text-xs">
            ← Retour aux newsletters
          </Link>
        </div>
      </div>
    )
  }

  const slide = data.slides[current]
  const nextSlide = data.slides[current + 1] ?? null

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-white">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-5 h-14 border-b border-white/8 bg-slate-900/60 flex-shrink-0 backdrop-blur-sm">
        <Presentation size={16} className="text-cyan-400 flex-shrink-0" />
        <h1 className="text-sm font-semibold truncate flex-1 text-slate-100">{data.title}</h1>

        {/* Timer */}
        <div className="flex items-center gap-1.5 bg-slate-800 rounded-lg px-2.5 py-1.5 border border-white/8">
          <Clock size={12} className="text-cyan-400" />
          <span className="font-mono text-sm text-white tabular-nums">{formatTime(elapsed)}</span>
          <button
            onClick={() => setRunning((r) => !r)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            title={running ? "Pause" : "Démarrer"}
          >
            {running ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            onClick={() => { setElapsed(0); setRunning(false) }}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Réinitialiser"
          >
            <RotateCcw size={12} />
          </button>
        </div>

        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {current + 1} / {data.slides.length}
        </span>

        <button
          onClick={openProjection}
          className="flex items-center gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
        >
          <MonitorPlay size={13} />
          Ouvrir la projection
        </button>

        <Link href="/newsletter" className="text-slate-500 hover:text-white transition-colors cursor-pointer flex-shrink-0">
          <X size={16} />
        </Link>
      </header>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Center: slide preview + nav */}
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 overflow-auto">

          {/* Current slide — 16:9 preview */}
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="w-full aspect-video bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
              >
                <SlidePreview slide={slide} total={data.slides.length} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToSlide(current - 1)}
              disabled={current === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-medium"
            >
              <ChevronLeft size={16} /> Précédente
            </button>
            <button
              onClick={() => goToSlide(current + 1)}
              disabled={current === data.slides.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer text-sm font-semibold"
            >
              Suivante <ChevronRight size={16} />
            </button>
          </div>

          {/* Next slide peek */}
          {nextSlide && (
            <div className="w-full max-w-2xl">
              <p className="text-[11px] text-slate-500 mb-2 uppercase tracking-wider font-medium">Slide suivante</p>
              <div className="bg-slate-900/60 border border-white/6 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-300 truncate">{nextSlide.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Prompteur */}
        <aside className="w-72 xl:w-80 border-l border-white/8 bg-slate-900/30 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-white/8">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Prompteur</h3>
            <p className="text-[11px] text-slate-600 mt-0.5">Points clés — slide {current + 1}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {slide.keyPoints.length > 0 ? (
              slide.keyPoints.map((kp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-3 bg-white/3 rounded-xl border border-white/5"
                >
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-200 leading-relaxed">{kp}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 text-center py-10">
                Aucun point clé pour cette slide.
              </p>
            )}
          </div>

          {/* Average time per slide */}
          <div className="p-4 border-t border-white/8 flex-shrink-0">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Moy. par slide</span>
              <span className="text-slate-400 font-mono">
                {current > 0 ? formatTime(Math.round(elapsed / current)) : "—"}
              </span>
            </div>
            <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${((current + 1) / data.slides.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ── Bottom: thumbnail timeline ───────────────────────────── */}
      <div className="flex-shrink-0 border-t border-white/8 bg-slate-900/50 px-4 py-3">
        <div ref={timelineRef} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {data.slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSlide(i)}
              className={`flex-shrink-0 relative rounded-lg border overflow-hidden transition-all cursor-pointer ${
                i === current
                  ? "border-cyan-500 shadow-[0_0_0_1px_rgba(6,182,212,0.3)]"
                  : "border-white/8 hover:border-white/20"
              }`}
              style={{ width: 80, height: 52 }}
            >
              <div className="absolute inset-0 bg-slate-900">
                <SlidePreview slide={s} total={data.slides.length} mini />
              </div>
              <span className="absolute bottom-0.5 right-1 text-[8px] font-mono text-slate-500">
                {i + 1}
              </span>
              {i === current && (
                <div className="absolute inset-0 border-2 border-cyan-500 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
