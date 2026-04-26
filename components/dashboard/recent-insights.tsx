import Link from "next/link"
import { Sparkles, ArrowRight, TrendingUp, AlertTriangle, Lightbulb, BarChart2 } from "lucide-react"
import { formatDateShort, truncate } from "@/lib/utils"
import type { Insight } from "@/types"

const typeConfig = {
  summary: { icon: BarChart2, color: "text-blue-400", bg: "bg-blue-500/10", label: "Résumé" },
  risks: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", label: "Risques" },
  opportunities: { icon: Lightbulb, color: "text-yellow-400", bg: "bg-yellow-500/10", label: "Opportunités" },
  trends: { icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10", label: "Tendances" },
}

interface Props {
  insights: Insight[]
}

export function RecentInsights({ insights }: Props) {
  return (
    <div className="glass-card border-white/10">
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <h2 className="font-semibold text-white">Insights récents</h2>
        </div>
        <Link href="/insights" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          Voir tout <ArrowRight size={12} />
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {insights.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Aucun insight — lancez une analyse IA
          </div>
        ) : (
          insights.map((insight) => {
            const config = typeConfig[insight.type] ?? typeConfig.summary
            const Icon = config.icon
            return (
              <div key={insight.id} className="p-4 hover:bg-white/3 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon size={13} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                    </div>
                    <p className="text-sm text-white font-medium line-clamp-1">{insight.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                      {truncate(insight.content, 100)}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {formatDateShort(insight.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
