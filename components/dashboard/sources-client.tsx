"use client"

import { useState } from "react"
import { Plus, Rss, Globe, Trash2, RefreshCw, AlertCircle, CheckCircle, Loader2, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FluidDropdown } from "@/components/ui/fluid-dropdown"
import { formatDate } from "@/lib/utils"
import type { Source } from "@/types"

/* ─── Sources officielles pré-configurées ─────────────────── */
const OFFICIAL_SOURCES = [
  {
    id: "legifrance",
    name: "Légifrance — Journal Officiel",
    url: "https://www.legifrance.gouv.fr/rss/jorf.xml",
    type: "rss" as const,
    description: "Lois, décrets et textes publiés au Journal Officiel de la République Française.",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/25",
    accent: "text-blue-400",
    icon: "🏛️",
  },
  {
    id: "senat",
    name: "Sénat — Rapports & Textes",
    url: "https://www.senat.fr/rss/rapports.rss",
    type: "rss" as const,
    description: "Rapports, propositions de loi et comptes-rendus des travaux du Sénat.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/25",
    accent: "text-cyan-400",
    icon: "🔵",
  },
  {
    id: "assemblee",
    name: "Assemblée Nationale",
    url: "https://www.assemblee-nationale.fr/rss/travaux-en-seance.rss",
    type: "rss" as const,
    description: "Travaux en séance, propositions et projets de loi de l'Assemblée Nationale.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/25",
    accent: "text-violet-400",
    icon: "🟣",
  },
  {
    id: "cassation",
    name: "Cour de Cassation",
    url: "https://www.courdecassation.fr/rss.xml",
    type: "rss" as const,
    description: "Arrêts et décisions rendus par la Cour de Cassation, toutes chambres confondues.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/25",
    accent: "text-emerald-400",
    icon: "⚖️",
  },
]

const sourceTypeOptions = [
  { value: "rss", label: "Flux RSS" },
  { value: "url", label: "URL (scraping)" },
]

interface Props {
  initialSources: Source[]
}

export function SourcesClient({ initialSources }: Props) {
  const [sources, setSources] = useState<Source[]>(initialSources)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [type, setType] = useState<"rss" | "url">("rss")
  const [loading, setLoading] = useState(false)
  const [activatingId, setActivatingId] = useState<string | null>(null)
  const [fetchingId, setFetchingId] = useState<string | null>(null)
  const [fetchResults, setFetchResults] = useState<Record<string, { newArticles: number; total: number }>>({})
  const [error, setError] = useState("")

  /* ─── Helpers ────────────────────────────────────────────── */
  const isOfficialActive = (officialUrl: string) =>
    sources.some((s) => s.url.toLowerCase().trim() === officialUrl.toLowerCase().trim())

  const getOfficialSource = (officialUrl: string) =>
    sources.find((s) => s.url.toLowerCase().trim() === officialUrl.toLowerCase().trim())

  /* ─── Activer une source officielle ─────────────────────── */
  const activateOfficial = async (o: typeof OFFICIAL_SOURCES[0]) => {
    if (isOfficialActive(o.url)) return
    setActivatingId(o.id)
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: o.name, url: o.url, type: o.type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'activation")
      const newSource: Source = data.source
      setSources((prev) => [newSource, ...prev])
      fetchNow(newSource.id)
    } catch {
      // silently fail — source already exists or network error
    } finally {
      setActivatingId(null)
    }
  }

  /* ─── Ajouter une source personnalisée ──────────────────── */
  const addSource = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, type }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de l'ajout")
      setSources((prev) => [data.source, ...prev])
      setName("")
      setUrl("")
      setShowForm(false)
      fetchNow(data.source.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* ─── Toggle / Delete / Fetch ───────────────────────────── */
  const toggleSource = async (id: string, enabled: boolean) => {
    setSources((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)))
    await fetch(`/api/sources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
    if (enabled) fetchNow(id)
  }

  const deleteSource = async (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id))
    await fetch(`/api/sources/${id}`, { method: "DELETE" })
  }

  const fetchNow = async (id: string) => {
    setFetchingId(id)
    setFetchResults((prev) => { const n = { ...prev }; delete n[id]; return n })
    try {
      const res = await fetch(`/api/sources/${id}/fetch`, { method: "POST" })
      const data = await res.json()
      if (res.ok && data.newArticles !== undefined) {
        setFetchResults((prev) => ({ ...prev, [id]: { newArticles: data.newArticles, total: data.total ?? 0 } }))
      }
      const srcRes = await fetch("/api/sources")
      if (srcRes.ok) {
        const srcData = await srcRes.json()
        setSources(srcData.sources ?? srcData)
      }
    } finally {
      setFetchingId(null)
    }
  }

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="space-y-6">

      {/* ══ Widget Sources officielles ══════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BadgeCheck size={16} className="text-cyan-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Sources officielles</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">— intégrées nativement</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OFFICIAL_SOURCES.map((o) => {
            const active = isOfficialActive(o.url)
            const src = getOfficialSource(o.url)
            const isActivating = activatingId === o.id
            const isFetching = src ? fetchingId === src.id : false

            return (
              <div
                key={o.id}
                className={`relative rounded-2xl border bg-gradient-to-br p-4 transition-all ${o.color} ${o.border} ${active ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{o.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{o.name}</p>
                      {active && src?.last_fetched_at && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Collecte : {formatDate(src.last_fetched_at)}
                        </p>
                      )}
                    </div>
                  </div>

                  {active ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {isFetching ? (
                        <Loader2 size={12} className="animate-spin text-cyan-400" />
                      ) : (
                        <button
                          onClick={() => src && fetchNow(src.id)}
                          className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="Actualiser"
                        >
                          <RefreshCw size={12} />
                        </button>
                      )}
                      <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/25 rounded-full px-2 py-0.5">
                        <CheckCircle size={11} className="text-emerald-400" />
                        <span className="text-[10px] font-medium text-emerald-400">Activée</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => activateOfficial(o)}
                      disabled={isActivating}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${o.border} bg-white/10 dark:bg-white/5 ${o.accent} hover:bg-white/20 dark:hover:bg-white/10 disabled:opacity-50`}
                    >
                      {isActivating ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Plus size={11} />
                      )}
                      Activer
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{o.description}</p>

                {/* Fetch result feedback */}
                {src && fetchResults[src.id] && !isFetching && (
                  <p className="text-[10px] text-emerald-400 mt-2">
                    {fetchResults[src.id].newArticles === 0
                      ? `${fetchResults[src.id].total} article(s) à jour`
                      : `+${fetchResults[src.id].newArticles} nouvel(s) article(s)`}
                  </p>
                )}

                {/* Toggle + delete when active */}
                {active && src && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={src.enabled}
                        onChange={(e) => toggleSource(src.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-checked:bg-cyan-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                      <span className="ml-2 text-[10px] text-slate-500">{src.enabled ? "Active" : "Pausée"}</span>
                    </label>
                    <button
                      onClick={() => deleteSource(src.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ══ Widget Sources personnalisées ════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rss size={15} className="text-orange-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Mes sources personnalisées</h2>
            {sources.filter(s => !OFFICIAL_SOURCES.some(o => o.url === s.url)).length > 0 && (
              <span className="text-xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 rounded-full px-2 py-0.5">
                {sources.filter(s => !OFFICIAL_SOURCES.some(o => o.url === s.url)).length}
              </span>
            )}
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-1.5">
            {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
            {showForm ? "Fermer" : "Ajouter un flux RSS"}
          </Button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="glass-card p-5 border-cyan-500/20">
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Nouveau flux RSS</h3>
            <form onSubmit={addSource} className="space-y-3">
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Nom de la source</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ex: Dalloz Actualité"
                    className="w-full h-9 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Type</label>
                  <FluidDropdown
                    options={sourceTypeOptions}
                    value={type}
                    onChange={(v) => setType(v as "rss" | "url")}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">URL du flux</label>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  type="url"
                  placeholder="https://exemple.fr/rss.xml"
                  className="w-full h-9 px-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" size="sm" disabled={loading}>
                  {loading && <Loader2 size={13} className="animate-spin mr-1.5" />}
                  Ajouter
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Custom source list */}
        {(() => {
          const customSources = sources.filter(s => !OFFICIAL_SOURCES.some(o => o.url === s.url))
          if (customSources.length === 0) {
            return (
              <div className="glass-card p-8 text-center text-slate-500">
                <Rss size={28} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Aucune source personnalisée</p>
                <p className="text-xs mt-1 text-slate-500">Ajoutez vos flux RSS favoris : Dalloz, EUR-Lex, presse juridique…</p>
              </div>
            )
          }
          return (
            <div className="glass-card divide-y divide-slate-100 dark:divide-white/5">
              {customSources.map((source) => (
                <div key={source.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${source.type === "rss" ? "bg-orange-500/15" : "bg-blue-500/15"}`}>
                    {source.type === "rss" ? (
                      <Rss size={16} className="text-orange-400" />
                    ) : (
                      <Globe size={16} className="text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{source.name}</span>
                      {source.error_count > 0 && (
                        <Badge variant="destructive">{source.error_count} erreur(s)</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{source.url}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {source.last_fetched_at && (
                        <p className="text-xs text-slate-500">Collecte : {formatDate(source.last_fetched_at)}</p>
                      )}
                      {fetchingId === source.id && (
                        <p className="text-xs text-cyan-500 flex items-center gap-1">
                          <Loader2 size={10} className="animate-spin" />
                          Collecte en cours…
                        </p>
                      )}
                      {fetchResults[source.id] && fetchingId !== source.id && (
                        <p className="text-xs text-emerald-400">
                          {fetchResults[source.id].newArticles === 0
                            ? `${fetchResults[source.id].total} article(s) à jour`
                            : `+${fetchResults[source.id].newArticles} nouvel(s) article(s)`}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {source.enabled ? (
                      <CheckCircle size={14} className="text-emerald-400" />
                    ) : (
                      <AlertCircle size={14} className="text-slate-400" />
                    )}
                    <button
                      onClick={() => fetchNow(source.id)}
                      disabled={fetchingId === source.id}
                      className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
                      title="Actualiser maintenant"
                    >
                      <RefreshCw size={14} className={fetchingId === source.id ? "animate-spin" : ""} />
                    </button>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={source.enabled}
                        onChange={(e) => toggleSource(source.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-300 dark:bg-slate-700 peer-checked:bg-cyan-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                    </label>
                    <button
                      onClick={() => deleteSource(source.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
