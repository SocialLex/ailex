"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ShaderAnimation } from "@/components/ui/shader-animation"
import type { PresentationData } from "@/lib/present/types"

const GARAMOND = { fontFamily: "'EB Garamond', Georgia, serif" }

export default function ProjectionPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<PresentationData | null>(null)
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)
  const [ready, setReady] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(`ailex_present_${id}`)
    if (raw) setData(JSON.parse(raw))
    setReady(true)
  }, [id])

  // Listen for slide changes from controls tab
  useEffect(() => {
    if (!window.BroadcastChannel) return
    const ch = new BroadcastChannel(`ailex_present_${id}`)
    ch.onmessage = (e) => {
      const msg = e.data
      if (msg.type === "SLIDE_CHANGE") {
        setDir(msg.index > current ? 1 : -1)
        setCurrent(msg.index)
      }
    }
    return () => ch.close()
  }, [id, current])

  if (!ready) return null

  if (!data) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 text-sm max-w-xs text-center">
          Présentation introuvable. Lancez-la depuis l&apos;éditeur de newsletter.
        </p>
      </div>
    )
  }

  const slide = data.slides[current]

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -80 }),
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 relative flex flex-col items-center justify-center select-none">
      {/* Shader background at 15% opacity */}
      <div className="absolute inset-0" style={{ opacity: 0.15 }}>
        <ShaderAnimation />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-slate-950/60 pointer-events-none" />

      {/* Slide */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-5xl px-14 py-10"
        >
          {slide.type === "cover" && (
            <div className="text-center space-y-6">
              {/* AiLex wordmark */}
              <p className="text-xs font-semibold tracking-[0.25em] text-cyan-500 uppercase mb-8">AiLex</p>
              <h1
                className="text-6xl md:text-7xl font-bold text-white leading-tight"
                style={GARAMOND}
              >
                {slide.title}
              </h1>
              {slide.keyPoints[0] && (
                <p className="text-lg text-slate-400 mt-4">{slide.keyPoints[0]}</p>
              )}
            </div>
          )}

          {slide.type === "content" && (
            <div className="space-y-8">
              {/* Slide counter */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-cyan-500/20" />
                <span className="text-[11px] font-mono text-cyan-500/60 tracking-widest uppercase">
                  {current} / {data.slides.length - 1}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={GARAMOND}>
                {slide.title}
              </h2>
              {slide.keyPoints.length > 0 ? (
                <ul className="space-y-5">
                  {slide.keyPoints.map((kp, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-4 text-xl md:text-2xl text-slate-200 leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2.5" />
                      {kp}
                    </motion.li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {slide.type === "closing" && (
            <div className="text-center space-y-6">
              <h2 className="text-6xl md:text-7xl font-bold text-white" style={GARAMOND}>
                {slide.title}
              </h2>
              <div className="space-y-2">
                {slide.keyPoints.map((kp, i) => (
                  <p key={i} className="text-xl text-slate-400">{kp}</p>
                ))}
              </div>
              <p className="text-xs tracking-[0.25em] text-cyan-500 uppercase mt-10">AiLex</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {data.slides.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-1.5 bg-cyan-400"
                : "w-1.5 h-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Slide title watermark (top-right) */}
      {slide.type === "content" && (
        <p className="absolute top-6 right-8 text-[11px] text-slate-600 font-medium truncate max-w-xs z-10">
          {data.title}
        </p>
      )}
    </div>
  )
}
