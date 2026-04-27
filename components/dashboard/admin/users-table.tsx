import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  subscriptions: Array<{ plan: string; status: string }> | null
}

interface Props { users: User[] }

const planVariants: Record<string, "default" | "secondary" | "warning"> = {
  starter: "secondary",
  pro: "default",
  enterprise: "warning",
}

export function UsersTable({ users }: Props) {
  return (
    <div className="glass-card">
      <div className="p-5 border-b border-slate-100 dark:border-white/10">
        <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Utilisateurs ({users.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              {["Nom", "Email", "Plan", "Rôle", "Inscription"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {users.map((u) => {
              const sub = u.subscriptions?.[0]
              return (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-slate-900 dark:text-white font-medium">{u.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-500">{u.email}</td>
                  <td className="px-4 py-3">
                    {sub ? (
                      <Badge variant={planVariants[sub.plan] ?? "secondary"}>
                        {sub.plan}
                      </Badge>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(u.created_at)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
