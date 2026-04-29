"use client"

import { useState } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"

const DOMAINS = [
  { value: "civil", label: "Droit Civil" },
  { value: "penal", label: "Droit Pénal" },
  { value: "public", label: "Droit Public" },
  { value: "affaires", label: "Droit des Affaires" },
  { value: "social", label: "Droit Social" },
]

const DOC_TYPES = [
  { value: "arret", label: "Arrêts de justice" },
  { value: "accord", label: "Accords d'entreprise" },
  { value: "decret", label: "Décrets" },
  { value: "loi", label: "Lois" },
  { value: "autre", label: "Autres" },
]

const SOURCES = [
  { value: "legifrance", label: "Légifrance" },
  { value: "senat", label: "Sénat" },
  { value: "cassation", label: "Cour de Cassation" },
  { value: "conseil_etat", label: "Conseil d'État" },
  { value: "jo", label: "Journal Officiel" },
]

const DATE_RANGES = [
  { value: "today", label: "Aujourd'hui" },
  { value: "week", label: "Cette semaine" },
  { value: "month", label: "Ce mois" },
  { value: "quarter", label: "Ce trimestre" },
  { value: "year", label: "Cette année" },
]

export interface FilterState {
  query: string
  domains: string[]
  docTypes: string[]
  sources: string[]
  dateRange: string
}

interface SearchFiltersProps {
  onFiltersChange?: (filters: FilterState) => void
  className?: string
}

export function SearchFilters({ onFiltersChange, className = "" }: SearchFiltersProps) {
  const [query, setQuery] = useState("")
  const [domains, setDomains] = useState<string[]>([])
  const [docTypes, setDocTypes] = useState<string[]>([])
  const [sources, setSources] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const activeCount = domains.length + docTypes.length + sources.length + (dateRange ? 1 : 0)

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) => {
    const next = list.includes(value) ? list.filter(v => v !== value) : [...list, value]
    setList(next)
    notify(next, list === domains ? "domains" : list === docTypes ? "docTypes" : "sources")
  }

  const notify = (next: string[], field: string) => {
    onFiltersChange?.({
      query,
      domains: field === "domains" ? next : domains,
      docTypes: field === "docTypes" ? next : docTypes,
      sources: field === "sources" ? next : sources,
      dateRange,
    })
  }

  const reset = () => {
    setQuery("")
    setDomains([])
    setDocTypes([])
    setSources([])
    setDateRange("")
    onFiltersChange?.({ query: "", domains: [], docTypes: [], sources: [], dateRange: "" })
  }

  const inputCls = "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500/50 transition-colors"

  const checkboxCls = (active: boolean) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
      active
        ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30"
        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20"
    }`

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              onFiltersChange?.({ query: e.target.value, domains, docTypes, sources, dateRange })
            }}
            placeholder="Rechercher dans les textes juridiques..."
            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
            showFilters || activeCount > 0
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
              : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20"
          }`}
        >
          <Filter size={14} />
          Filtres
          {activeCount > 0 && (
            <span className="bg-cyan-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
          <ChevronDown size={12} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
          >
            <X size={13} />
            Effacer
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-2xl p-5 space-y-5">
          {/* Domains */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Domaines</p>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map(d => (
                <button key={d.value} onClick={() => toggle(domains, setDomains, d.value)} className={checkboxCls(domains.includes(d.value))}>
                  {domains.includes(d.value) && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />}
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Doc types */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Type de document</p>
            <div className="flex flex-wrap gap-2">
              {DOC_TYPES.map(d => (
                <button key={d.value} onClick={() => toggle(docTypes, setDocTypes, d.value)} className={checkboxCls(docTypes.includes(d.value))}>
                  {docTypes.includes(d.value) && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />}
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sources + Date — two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Sources</p>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(s => (
                  <button key={s.value} onClick={() => toggle(sources, setSources, s.value)} className={checkboxCls(sources.includes(s.value))}>
                    {sources.includes(s.value) && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />}
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">Période</p>
              <select
                value={dateRange}
                onChange={e => {
                  setDateRange(e.target.value)
                  onFiltersChange?.({ query, domains, docTypes, sources, dateRange: e.target.value })
                }}
                className={inputCls}
              >
                <option value="">Toutes les périodes</option>
                {DATE_RANGES.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
