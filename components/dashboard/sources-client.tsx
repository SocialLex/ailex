"use client"

import { useState } from "react"
import { Plus, Rss, Globe, Trash2, RefreshCw, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FluidDropdown } from "@/components/ui/fluid-dropdown"
import { formatDate } from "@/lib/utils"
import type { Source } from "@/types"

const sourceTypeOptions = [
  { value: "rss", label: "Flux RSS" },
  { value: "url", label: "URL (scraping)" },
]

const defaultSources = [
  { name: "Légifrance", url: "https://www.legifrance.gouv.fr/rss.xml", type: "rss" },
  { name: "EUR-Lex", url: "https://eur-lex.europa.eu/rss/rss.xml", type: "rss" },
  { name: "DALLOZ Actualité", url: "https://www.dalloz-actualite.fr/rss.xml", type: "rss" },
  { name: "Le Monde Droit", url: "https://www.lemonde.fr/droit/rss_full.xml", type: "rss" },
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
  const [fetchingId, setFetchingId] = useState<string | null>(null)
  const [error, setError] = useState("")

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
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleSource = async (id: string, enabled: boolean) => {
    setSources((prev) => prev.map((s) => s.id === id ? { ...s, enabled } : s))
    await fetch(`/api/sources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
  }

  const deleteSource = async (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id))
    await fetch(`/api/sources/${id}`, { method: "DELETE" })
  }

  const fetchNow = async (id: string) => {
    setFetchingId(id)
    try {
      await fetch(`/api/sources/${id}/fetch`, { method: "POST" })
      const res = await fetch("/api/sources")
      const data = await res.json()
      setSources(data.sources)
    } finally {
      setFetchingId(null)
    }
  }

  const addDefaultSource = async (s: typeof defaultSources[0]) => {
    setName(s.name)
    setUrl(s.url)
    setType(s.type as "rss" | "url")
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      <div className="flex items-center gap-3">
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={16} />
          Ajouter une source
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="glass-card p-5 border-cyan-500/20">
          <h3 className="text-white font-semibold mb-4">Nouvelle source</h3>

          {/* Quick add suggestions */}
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2">Suggestions rapides :</p>
            <div className="flex flex-wrap gap-2">
              {defaultSources.map((s) => (
                <button
                  key={s.name}
                  onClick={() => addDefaultSource(s)}
                  className="text-xs px-3 py-1.5 glass rounded-lg text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all cursor-pointer"
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={addSource} className="space-y-3">
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nom</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Légifrance"
                  className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Type</label>
                <FluidDropdown
                  options={sourceTypeOptions}
                  value={type}
                  onChange={(v) => setType(v as "rss" | "url")}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                type="url"
                placeholder="https://exemple.fr/rss.xml"
                className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
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

      {/* Source list */}
      <div className="glass-card border-white/10 divide-y divide-white/5">
        {sources.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Rss size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune source configurée</p>
            <p className="text-xs mt-1">Ajoutez votre premier flux RSS pour commencer</p>
          </div>
        ) : (
          sources.map((source) => (
            <div key={source.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${source.type === "rss" ? "bg-orange-500/15" : "bg-blue-500/15"}`}>
                {source.type === "rss" ? (
                  <Rss size={16} className="text-orange-400" />
                ) : (
                  <Globe size={16} className="text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{source.name}</span>
                  {source.error_count > 0 && (
                    <Badge variant="destructive">{source.error_count} erreur(s)</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{source.url}</p>
                {source.last_fetched_at && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dernière collecte : {formatDate(source.last_fetched_at)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {source.enabled ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={14} className="text-slate-600" />
                )}

                <button
                  onClick={() => fetchNow(source.id)}
                  disabled={fetchingId === source.id}
                  className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Actualiser maintenant"
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
                  <div className="w-8 h-4 bg-slate-700 peer-checked:bg-cyan-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-4" />
                </label>

                <button
                  onClick={() => deleteSource(source.id)}
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
