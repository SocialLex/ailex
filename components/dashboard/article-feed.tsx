"use client"

import { useState } from "react"
import { ExternalLink, Clock, Filter } from "lucide-react"
import { formatDateShort, truncate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Article {
  id: string
  title: string
  summary: string | null
  url: string
  published_at: string | null
  created_at: string
  status: string
  sources: { name: string } | null
}

interface Props {
  articles: Article[]
}

const statusVariants: Record<string, "default" | "secondary" | "destructive"> = {
  processed: "default",
  pending: "secondary",
  failed: "destructive",
}

const statusLabels: Record<string, string> = {
  processed: "Analysé",
  pending: "En attente",
  failed: "Échec",
}

export function ArticleFeed({ articles }: Props) {
  const [filter, setFilter] = useState<"all" | "processed" | "pending">("all")

  const filtered = filter === "all" ? articles : articles.filter((a) => a.status === filter)

  return (
    <div className="glass-card border-white/10">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <h2 className="font-semibold text-white">Flux d'articles</h2>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">Tous</option>
            <option value="processed">Analysés</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            Aucun article — ajoutez des sources pour commencer
          </div>
        ) : (
          filtered.map((article) => (
            <div key={article.id} className="p-4 hover:bg-white/3 transition-colors group">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.sources?.name && (
                      <span className="text-xs text-cyan-500 font-medium">{article.sources.name}</span>
                    )}
                    <Badge variant={statusVariants[article.status] ?? "secondary"}>
                      {statusLabels[article.status] ?? article.status}
                    </Badge>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-white hover:text-cyan-400 transition-colors line-clamp-2 block"
                  >
                    {article.title}
                  </a>
                  {article.summary && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {truncate(article.summary, 150)}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                    <Clock size={11} />
                    {formatDateShort(article.published_at ?? article.created_at)}
                  </div>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white transition-all cursor-pointer flex-shrink-0 mt-1"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
