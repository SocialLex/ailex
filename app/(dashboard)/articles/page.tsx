import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ArticlesClient } from "@/components/dashboard/articles-client"

export default async function ArticlesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, summary, url, author, published_at, status, source_id, metadata, sources(name, type)")
    .eq("user_id", user.id)
    .order("published_at", { ascending: false })
    .limit(100)

  return <ArticlesClient articles={articles ?? []} />
}
