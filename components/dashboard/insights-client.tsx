"use client"

import { useState } from "react"
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb, BarChart2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import type { Insight } from "@/types"

const typeConfig = {
  summary: { icon: BarChart2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Résumé" },
  risks: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Risques" },
  opportunities: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Opportunités" },
  trends: { icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", label: "Tendances" },
}

interface Props {
  initialInsights: Insight[]
  recentArticles: Array<{ id: string; title: string; summary: string | null; url: string }>
}

export function InsightsClient({ initialInsights, recentArticles }: Props) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights)
  const [generating, setGenerating] = useState(false)
  const [activeType, setActiveType] = useState<string>("all")

  const generateDigest = async () => {
    setGenerating(true)
    try {
      const res = await fetch("/api/insights/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: recentArticles }),
      })
      const data = await res.json()
      if (data.insights) {
        setInsights((prev) => [...data.insights, ...prev])
      }
    } finally {
      setGenerating(false)
    }
  }

  const filtered = activeType === "all"
    ? insights
    : insights.filter((i) => i.type === activeType)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          {["all", "summary", "trends", "risks", "opportunities"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeType === t
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white glass"
              }`}
            >
              {t === "all" ? "Tous" :
               t === "summary" ? "Résumés" :
               t === "trends" ? "Tendances" :
               t === "risks" ? "Risques" : "Opportunités"}
            </button>
          ))}
        </div>

        <Button
          onClick={generateDigest}
          disabled={generating || recentArticles.length === 0}
          variant="gradient"
          size="sm"
          className="gap-2"
        >
          {generating ? (
            <><Loader2 size={14} className="animate-spin" /> Génération…</>
          ) : (
            <><Sparkles size={14} /> Générer un digest</>
          )}
        </Button>
      </div>

      {/* Insight grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 glass-card p-10 text-center text-slate-500 border-white/10">
            <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun insight disponible</p>
            <p className="text-xs mt-1">Ajoutez des sources et lancez une analyse</p>
          </div>
        ) : (
          filtered.map((insight) => {
            const config = typeConfig[insight.type as keyof typeof typeConfig] ?? typeConfig.summary
            const Icon = config.icon
            return (
              <div key={insight.id} className={`glass-card p-5 ${config.border}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="secondary" className="mb-1.5 text-[10px]">{config.label}</Badge>
                    <h3 className="text-sm font-semibold text-white leading-snug">{insight.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{insight.content}</p>
                {insight.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {insight.keywords.slice(0, 4).map((kw) => (
                      <span key={kw} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-slate-400">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-slate-600 mt-3">{formatDate(insight.created_at)}</p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
