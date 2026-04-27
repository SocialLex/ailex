"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Newspaper, ExternalLink, Filter, Wand2, Square, CheckSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

interface ArticleMeta {
  article_type?: "jurisprudence" | "legislation" | "reglementation" | "doctrine" | "presse"
  newsletter_title?: string
  category?: string
}

interface Article {
  id: string
  title: string
  summary: string | null
  url: string
  author: string | null
  published_at: string | null
  status: string
  source_id: string
  metadata: ArticleMeta | null
  sources: Array<{ name: string; type: string }> | { name: string; type: string } | null
}

interface Props { articles: Article[] }

const getSource = (a: Article) =>
  Array.isArray(a.sources) ? a.sources[0] ?? null : a.sources

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  jurisprudence: { label: "Jurisprudence", color: "bg-purple-500/15 text-purple-300 border border-purple-500/20" },
  legislation:   { label: "Législation",   color: "bg-blue-500/15 text-blue-300 border border-blue-500/20" },
  reglementation:{ label: "Réglementation",color: "bg-amber-500/15 text-amber-300 border border-amber-500/20" },
  doctrine:      { label: "Doctrine",      color: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" },
  presse:        { label: "Presse",        color: "bg-slate-500/15 text-slate-300 border border-slate-500/20" },
}

const statusColors: Record<string, string> = {
  processed: "bg-green-500/15 text-green-400",
  pending:   "bg-amber-500/15 text-amber-400",
  failed:    "bg-red-500/15 text-red-400",
}

export function ArticlesClient({ articles }: Props) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterSource, setFilterSource] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [search, setSearch] = useState("")

  const sources = useMemo(() => {
    const s = new Map<string, string>()
    articles.forEach(a => { const src = getSource(a); if (src) s.set(a.source_id, src.name) })
    return Array.from(s.entries())
  }, [articles])

  const filtered = useMemo(() => articles.filter(a => {
    if (filterSource !== "all" && a.source_id !== filterSource) return false
    if (filterStatus !== "all" && a.status !== filterStatus) return false
    if (filterType !== "all" && (a.metadata?.article_type ?? "presse") !== filterType) return false
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [articles, filterSource, filterStatus, filterType, search])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(filtered.map(a => a.id)))
  const clearAll = () => setSelected(new Set())

  const pushToGeneration = () => {
    if (selected.size === 0) return
    localStorage.setItem("ailex_generation_articles", JSON.stringify(
      articles.filter(a => selected.has(a.id)).map(a => ({
        id: a.id,
        title: a.metadata?.newsletter_title || a.title,
        summary: a.summary,
        url: a.url,
        source: getSource(a)?.name ?? "",
        published_at: a.published_at,
        article_type: a.metadata?.article_type ?? "presse",
      }))
    ))
    router.push("/generation")
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Articles & Jurisprudences</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{filtered.length} article{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
        </div>
        {selected.size > 0 && (
          <Button onClick={pushToGeneration} variant="gradient" className="gap-2 animate-fade-in">
            <Wand2 size={15} />
            Générer avec {selected.size} article{selected.size > 1 ? "s" : ""}
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-9 pl-9 pr-3 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 w-48"
          />
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
        >
          <option value="all">Tous les types</option>
          <option value="jurisprudence">Jurisprudence</option>
          <option value="legislation">Législation</option>
          <option value="reglementation">Réglementation</option>
          <option value="doctrine">Doctrine</option>
          <option value="presse">Presse</option>
        </select>

        <select
          value={filterSource}
          onChange={e => setFilterSource(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
        >
          <option value="all">Toutes les sources</option>
          {sources.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
        >
          <option value="all">Tous les statuts</option>
          <option value="processed">Analysé</option>
          <option value="pending">En attente</option>
          <option value="failed">Échec</option>
        </select>

        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={selectAll} className="text-xs text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors">
            <CheckSquare size={13} /> Tout sélectionner
          </button>
          {selected.size > 0 && (
            <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 cursor-pointer transition-colors ml-2">
              <Square size={13} /> Effacer
            </button>
          )}
        </div>
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-12 text-center">
          <Newspaper size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Aucun article trouvé</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {articles.length === 0
              ? "Activez une source RSS et cliquez sur l'icône rafraîchissement pour collecter des articles."
              : "Modifiez vos filtres pour voir plus d'articles."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(article => {
            const isSelected = selected.has(article.id)
            const meta = article.metadata
            const typeInfo = TYPE_LABELS[meta?.article_type ?? ""] ?? null
            const displayTitle = meta?.newsletter_title || article.title

            return (
              <div
                key={article.id}
                onClick={() => toggleSelect(article.id)}
                className={`group relative bg-white dark:bg-white/5 rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-cyan-500/60 dark:border-cyan-500/50 ring-1 ring-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-500/5"
                    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                {/* Checkbox */}
                <div className={`absolute top-3 right-3 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  isSelected ? "border-cyan-500 bg-cyan-500" : "border-slate-300 dark:border-white/20 bg-white dark:bg-slate-800"
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>

                <div className="p-4 pr-10">
                  {/* Type badge + source + date */}
                  <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                    {typeInfo && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    )}
                    {getSource(article) && (
                      <span className="text-[10px] font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded-full">
                        {getSource(article)?.name}
                      </span>
                    )}
                    {article.published_at && (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
                        <Calendar size={9} />
                        {formatDate(article.published_at)}
                      </span>
                    )}
                  </div>

                  {/* Title — newsletter_title si disponible */}
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                    {displayTitle}
                  </h3>

                  {/* Summary */}
                  {article.summary && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-3">
                      {article.summary}
                    </p>
                  )}
                  {!article.summary && article.status === "pending" && (
                    <p className="text-xs text-amber-500/70 italic mb-3">Analyse IA en cours…</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-white/5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[article.status] ?? statusColors.pending}`}>
                      {article.status === "processed" ? "Analysé" : article.status === "pending" ? "En attente" : "Échec"}
                    </span>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Barre flottante de sélection */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl border border-white/10 dark:border-slate-200 animate-fade-in">
          <span className="text-sm font-medium">{selected.size} article{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}</span>
          <Button size="sm" onClick={pushToGeneration} className="gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950">
            <Wand2 size={13} />
            Pousser vers Génération
          </Button>
          <button onClick={clearAll} className="text-sm text-slate-400 dark:text-slate-600 hover:text-white dark:hover:text-slate-900 cursor-pointer transition-colors">
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
