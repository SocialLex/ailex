import { createClient } from "@/lib/supabase/server"
import { SourcesClient } from "@/components/dashboard/sources-client"

export default async function SourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Sources de veille</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Gérez vos flux RSS et sites web surveillés
        </p>
      </div>
      <SourcesClient initialSources={sources ?? []} />
    </div>
  )
}
