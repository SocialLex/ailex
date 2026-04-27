import { createClient } from "@/lib/supabase/server"
import { NewsletterClient } from "@/components/dashboard/newsletter-client"

export default async function NewsletterPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: newsletters }, { data: insights }] = await Promise.all([
    supabase
      .from("newsletters")
      .select("*, newsletter_issues(count)")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("insights")
      .select("id, title, content, type, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ])

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Newsletters</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Créez et envoyez des newsletters à partir de vos insights
        </p>
      </div>
      <NewsletterClient
        newsletters={newsletters ?? []}
        availableInsights={insights ?? []}
      />
    </div>
  )
}
