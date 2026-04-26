import { FileText, Sparkles, Rss, TrendingUp } from "lucide-react"

interface Props {
  articleCount: number
  insightCount: number
  sourceCount: number
}

export function DashboardStats({ articleCount, insightCount, sourceCount }: Props) {
  const stats = [
    {
      label: "Articles collectés",
      value: articleCount.toLocaleString("fr-FR"),
      icon: FileText,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      change: "+12% cette semaine",
    },
    {
      label: "Insights générés",
      value: insightCount.toLocaleString("fr-FR"),
      icon: Sparkles,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      change: "+8 aujourd'hui",
    },
    {
      label: "Sources actives",
      value: sourceCount.toLocaleString("fr-FR"),
      icon: Rss,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      change: "Toutes opérationnelles",
    },
    {
      label: "Tendances détectées",
      value: "—",
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      change: "Analyse en cours…",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`glass-card p-5 ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
              <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon size={15} className={stat.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.change}</div>
          </div>
        )
      })}
    </div>
  )
}
