import { createClient } from "@/lib/supabase/server"
import { InsightsClient } from "@/components/dashboard/insights-client"

export default async function InsightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: insights }, { data: articles }] = await Promise.all([
    supabase
      .from("insights")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("articles")
      .select("id, title, summary, url")
      .eq("user_id", user!.id)
      .eq("status", "processed")
      .order("created_at", { ascending: false })
      .limit(30),
  ])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Insights IA</h1>
        <p className="text-slate-400 text-sm">
          Analyses générées automatiquement par Claude
        </p>
      </div>
      <InsightsClient initialInsights={insights ?? []} recentArticles={articles ?? []} />
    </div>
  )
}
