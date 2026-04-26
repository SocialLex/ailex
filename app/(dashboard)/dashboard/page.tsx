import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/stats"
import { ArticleFeed } from "@/components/dashboard/article-feed"
import { RecentInsights } from "@/components/dashboard/recent-insights"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { count: articleCount },
    { count: insightCount },
    { count: sourceCount },
    { data: recentArticles },
    { data: recentInsights },
  ] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("insights").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("sources").select("*", { count: "exact", head: true }).eq("user_id", user!.id).eq("enabled", true),
    supabase
      .from("articles")
      .select("*, sources(name)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("insights")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Tableau de bord</h1>
        <p className="text-slate-400 text-sm">Vue d'ensemble de votre veille stratégique</p>
      </div>

      <DashboardStats
        articleCount={articleCount ?? 0}
        insightCount={insightCount ?? 0}
        sourceCount={sourceCount ?? 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ArticleFeed articles={recentArticles ?? []} />
        </div>
        <div>
          <RecentInsights insights={recentInsights ?? []} />
        </div>
      </div>
    </div>
  )
}
