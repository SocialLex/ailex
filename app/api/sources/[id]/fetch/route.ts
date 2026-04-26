import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchRSSFeed } from "@/lib/ingestion/rss-parser"
import { scrapeUrl } from "@/lib/ingestion/scraper"
import { analyzeArticle } from "@/lib/ai/pipeline"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  const { data: source } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!source) return NextResponse.json({ error: "Source introuvable" }, { status: 404 })

  try {
    const articles =
      source.type === "rss"
        ? await fetchRSSFeed(source.url)
        : await scrapeUrl(source.url)

    let newCount = 0

    for (const article of articles.slice(0, 50)) {
      // Upsert — ignore les doublons via la contrainte UNIQUE(user_id, hash)
      const { data: inserted, error } = await supabase
        .from("articles")
        .upsert(
          {
            source_id: source.id,
            user_id: user.id,
            title: article.title,
            content: article.content,
            url: article.url,
            author: article.author,
            published_at: article.published_at?.toISOString(),
            hash: article.hash,
            status: "pending",
          },
          { onConflict: "user_id,hash", ignoreDuplicates: true }
        )
        .select()
        .single()

      if (!error && inserted) {
        newCount++
        // Analyse AI en arrière-plan (non bloquant)
        analyzeAndStore(supabase, inserted.id, article.title, article.content, user.id).catch(
          console.error
        )
      }
    }

    // Mise à jour last_fetched_at
    await supabase
      .from("sources")
      .update({ last_fetched_at: new Date().toISOString(), error_count: 0, last_error: null })
      .eq("id", id)

    return NextResponse.json({ success: true, newArticles: newCount })
  } catch (err: any) {
    await supabase
      .from("sources")
      .update({ error_count: (source.error_count ?? 0) + 1, last_error: err.message })
      .eq("id", id)

    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function analyzeAndStore(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  articleId: string,
  title: string,
  content: string,
  userId: string
) {
  try {
    if (!content || content.length < 50) return

    const result = await analyzeArticle(title, content)

    await supabase
      .from("articles")
      .update({ summary: result.summary, status: "processed" })
      .eq("id", articleId)

    // Stocker l'insight principal
    await supabase.from("insights").insert({
      user_id: userId,
      article_id: articleId,
      title: `Analyse : ${title.slice(0, 80)}`,
      content: result.summary,
      type: "summary",
      keywords: result.keywords,
      ai_model: "claude-sonnet-4-6",
      tokens_used: 0,
    })
  } catch {
    await supabase
      .from("articles")
      .update({ status: "failed" })
      .eq("id", articleId)
  }
}
