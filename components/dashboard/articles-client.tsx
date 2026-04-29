"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Newspaper, ExternalLink, Wand2, CheckSquare, Square,
  Calendar, ChevronLeft, ChevronRight, Search, SlidersHorizontal,
  ArrowUpDown, X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

/* ─── Types ─────────────────────────────────────────────────── */
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

/* ─── Helpers ────────────────────────────────────────────────── */
const getSource = (a: Article) =>
  Array.isArray(a.sources) ? a.sources[0] ?? null : a.sources

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  jurisprudence: { label: "Jurisprudence", color: "bg-purple-500/15 text-purple-400 border border-purple-500/20" },
  legislation:   { label: "Législation",   color: "bg-blue-500/15 text-blue-400 border border-blue-500/20" },
  reglementation:{ label: "Réglementation",color: "bg-amber-500/15 text-amber-400 border border-amber-500/20" },
  doctrine:      { label: "Doctrine",      color: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" },
  presse:        { label: "Presse",        color: "bg-slate-500/15 text-slate-400 border border-slate-500/20" },
}

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  social:   ["travail", "emploi", "licenciement", "accord", "salarié", "branche", "retraite", "chômage", "syndicat"],
  penal:    ["pénal", "criminel", "infraction", "peine", "tribunal correctionnel", "mis en examen"],
  civil:    ["civil", "contrat", "famille", "succession", "divorce", "propriété", "responsabilité"],
  public:   ["administratif", "public", "collectivité", "fonctionnaire", "service public", "préfet"],
  affaires: ["commercial", "entreprise", "société", "bancaire", "concurrence", "fusion", "faillite"],
}

const detectDomain = (text: string): string => {
  const lower = text.toLowerCase()
  for (const [domain, kws] of Object.entries(DOMAIN_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return domain
  }
  return "autre"
}

const statusColors: Record<string, string> = {
  processed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  pending:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  failed:    "bg-red-500/10 text-red-400 border border-red-500/20",
}
const statusLabel: Record<string, string> = {
  processed: "Analysé", pending: "En attente", failed: "Échec",
}

const PER_PAGE = 6

const selectCls = "h-9 px-3 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"

/* ─── Component ──────────────────────────────────────────────── */
export function ArticlesClient({ articles }: Props) {
  const router = useRouter()

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")
  const [filterSource, setFilterSource] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [filterDomain, setFilterDomain] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "source">("date_desc")
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  const sources = useMemo(() => {
    const s = new Map<string, string>()
    articles.forEach(a => { const src = getSource(a); if (src) s.set(a.source_id, src.name) })
    return Array.from(s.entries())
  }, [articles])

  const filtered = useMemo(() => {
    const now = Date.now()
    const cutoffs: Record<string, number> = {
      today: now - 86400000,
      week:  now - 7 * 86400000,
      month: now - 30 * 86400000,
      quarter: now - 90 * 86400000,
    }

    let list = articles.filter(a => {
      if (filterSource !== "all" && a.source_id !== filterSource) return false
      if (filterType !== "all" && (a.metadata?.article_type ?? "presse") !== filterType) return false
      if (filterDate !== "all") {
        const cutoff = cutoffs[filterDate]
        if (!a.published_at || new Date(a.published_at).getTime() < cutoff) return false
      }
      if (filterDomain !== "all") {
        const text = (a.metadata?.newsletter_title ?? a.title) + " " + (a.summary ?? "")
        if (detectDomain(text) !== filterDomain) return false
      }
      if (search) {
        const q = search.toLowerCase()
        const haystack = (a.metadata?.newsletter_title ?? a.title) + " " + (a.summary ?? "") + " " + (getSource(a)?.name ?? "")
        if (!haystack.toLowerCase().includes(q)) return false
      }
      return true
    })

    if (sortBy === "date_desc") list.sort((a, b) => (b.published_at ?? "").localeCompare(a.published_at ?? ""))
    if (sortBy === "date_asc")  list.sort((a, b) => (a.published_at ?? "").localeCompare(b.published_at ?? ""))
    if (sortBy === "source")    list.sort((a, b) => (getSource(a)?.name ?? "").localeCompare(getSource(b)?.name ?? ""))

    return list
  }, [articles, search, filterSource, filterType, filterDomain, filterDate, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const resetFilters = () => {
    setSearch(""); setFilterSource("all"); setFilterType("all")
    setFilterDomain("all"); setFilterDate("all"); setSortBy("date_desc"); setPage(1)
  }
  const activeFilters = [filterSource, filterType, filterDomain, filterDate].filter(v => v !== "all").length

  const toggleSelect = (id: string) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
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

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Articles & Jurisprudences</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""} disponible{filtered.length !== 1 ? "s" : ""}
            {filtered.length !== articles.length && ` · ${articles.length} au total`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={selected.size === filtered.length ? clearAll : selectAll}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            {selected.size === filtered.length && filtered.length > 0
              ? <><Square size={13} /> Désélectionner</>
              : <><CheckSquare size={13} /> Tout sélectionner</>
            }
          </button>
          {selected.size > 0 && (
            <Button onClick={pushToGeneration} variant="gradient" size="sm" className="gap-1.5 animate-fade-in">
              <Wand2 size={13} />
              Générer ({selected.size})
            </Button>
          )}
        </div>
      </div>

      {/* ── Barre de recherche ─────────────────────────────── */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher dans les textes, jurisprudences, décrets…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full h-10 pl-10 pr-10 text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
            showFilters || activeFilters > 0
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
              : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <SlidersHorizontal size={14} />
          Filtres
          {activeFilters > 0 && (
            <span className="bg-cyan-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {activeFilters}
            </span>
          )}
        </button>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as typeof sortBy); setPage(1) }}
            className={`${selectCls} pl-8`}
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="source">Par source</option>
          </select>
          <ArrowUpDown size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── Panneau de filtres avancés ─────────────────────── */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Domaine juridique</label>
              <select value={filterDomain} onChange={e => { setFilterDomain(e.target.value); setPage(1) }} className={selectCls + " w-full"}>
                <option value="all">Tous les domaines</option>
                <option value="social">Droit Social</option>
                <option value="penal">Droit Pénal</option>
                <option value="civil">Droit Civil</option>
                <option value="public">Droit Public</option>
                <option value="affaires">Droit des Affaires</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type de texte</label>
              <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }} className={selectCls + " w-full"}>
                <option value="all">Tous les types</option>
                <option value="jurisprudence">Jurisprudence</option>
                <option value="legislation">Législation</option>
                <option value="reglementation">Réglementation</option>
                <option value="doctrine">Doctrine</option>
                <option value="presse">Presse</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Source</label>
              <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1) }} className={selectCls + " w-full"}>
                <option value="all">Toutes les sources</option>
                {sources.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Période</label>
              <select value={filterDate} onChange={e => { setFilterDate(e.target.value); setPage(1) }} className={selectCls + " w-full"}>
                <option value="all">Toute période</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
              </select>
            </div>
          </div>
          {activeFilters > 0 && (
            <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1">
              <X size={11} /> Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {/* ── Grille d'articles ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-14 text-center">
          <Newspaper size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Aucun article trouvé</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            {articles.length === 0
              ? "Activez une source officielle et actualisez pour collecter des articles."
              : "Modifiez vos critères de recherche."}
          </p>
          {activeFilters > 0 && (
            <button onClick={resetFilters} className="mt-3 text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map(article => {
            const isSelected = selected.has(article.id)
            const meta = article.metadata
            const typeInfo = TYPE_LABELS[meta?.article_type ?? ""] ?? null
            const displayTitle = meta?.newsletter_title || article.title
            const src = getSource(article)

            return (
              <div
                key={article.id}
                onClick={() => toggleSelect(article.id)}
                className={`group relative flex flex-col bg-white dark:bg-slate-900/60 rounded-2xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                  isSelected
                    ? "border-cyan-500/50 ring-1 ring-cyan-500/20 bg-cyan-50/30 dark:bg-cyan-500/5"
                    : "border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-sm"
                }`}
              >
                {/* Top strip with source color */}
                <div className={`h-0.5 w-full ${isSelected ? "bg-cyan-500" : "bg-gradient-to-r from-cyan-500/40 to-blue-500/20"}`} />

                <div className="flex flex-col flex-1 p-5">
                  {/* Row 1: source + date + link */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {src && (
                        <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 px-2 py-0.5 rounded-full">
                          {src.name}
                        </span>
                      )}
                      {typeInfo && (
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {article.published_at && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={9} />
                          {formatDate(article.published_at)}
                        </span>
                      )}
                      {/* External link — big & obvious */}
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        title="Ouvrir la source officielle"
                        className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5 line-clamp-3 leading-snug flex-grow-0">
                    {displayTitle}
                  </h3>

                  {/* Summary */}
                  <div className="flex-1">
                    {article.summary ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-4 leading-relaxed">
                        {article.summary}
                      </p>
                    ) : article.status === "pending" ? (
                      <p className="text-xs text-amber-500/80 italic">Analyse IA en cours…</p>
                    ) : null}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[article.status] ?? statusColors.pending}`}>
                      {statusLabel[article.status] ?? "En attente"}
                    </span>
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                      isSelected
                        ? "border-cyan-500 bg-cyan-500"
                        : "border-slate-300 dark:border-white/20 group-hover:border-slate-400 dark:group-hover:border-white/40"
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Page {page} sur {totalPages} · {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let p = i + 1
              if (totalPages > 5) {
                const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                p = start + i
              }
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    page === p
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Barre flottante de sélection ───────────────────── */}
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
