import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminStats } from "@/components/dashboard/admin/admin-stats"
import { UsersTable } from "@/components/dashboard/admin/users-table"

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  const [
    { count: userCount },
    { count: articleCount },
    { count: insightCount },
    { data: users },
    { data: recentLogs },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("insights").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*, subscriptions(plan, status)").order("created_at", { ascending: false }).limit(20),
    supabase.from("logs").select("*").order("created_at", { ascending: false }).limit(20),
  ])

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Administration</h1>
        <p className="text-slate-400 text-sm">Vue d'ensemble de la plateforme AiLex</p>
      </div>

      <AdminStats
        userCount={userCount ?? 0}
        articleCount={articleCount ?? 0}
        insightCount={insightCount ?? 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UsersTable users={users ?? []} />
        </div>
        <div className="glass-card border-white/10 p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Logs récents</h2>
          <div className="space-y-2">
            {recentLogs?.length === 0 ? (
              <p className="text-slate-500 text-xs">Aucun log</p>
            ) : (
              recentLogs?.map((log) => (
                <div key={log.id} className="text-xs border-b border-white/5 pb-2">
                  <span className="text-cyan-400">{log.event_type}</span>
                  <span className="text-slate-400 ml-2">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
