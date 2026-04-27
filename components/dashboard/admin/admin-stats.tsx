import { Users, FileText, Sparkles, Activity } from "lucide-react"

interface Props { userCount: number; articleCount: number; insightCount: number }

export function AdminStats({ userCount, articleCount, insightCount }: Props) {
  const stats = [
    { label: "Utilisateurs", value: userCount, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Articles traités", value: articleCount, icon: FileText, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Insights générés", value: insightCount, icon: Sparkles, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Disponibilité", value: "99.9%", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div key={s.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">{s.label}</span>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <Icon size={15} className={s.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {typeof s.value === "number" ? s.value.toLocaleString("fr-FR") : s.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}
