import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { fetchRSSFeed } from "@/lib/ingestion/rss-parser"
import { scrapeUrl } from "@/lib/ingestion/scraper"
import { analyzeArticle } from "@/lib/ai/pipeline"

// Route appelée par Vercel Cron — sécurisée par CRON_SECRET
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const supabase = await createClient()

  // Récupérer toutes les sources actives dont l'heure est venue
  const { data: sources } = await supabase
    .from("sources")
    .select("*")
    .eq("enabled", true)
    .or(
      `last_fetched_at.is.null,last_fetched_at.lt.${new Date(
        Date.now() - 60 * 60 * 1000
      ).toISOString()}`
    )
    .limit(50)

  if (!sources?.length) {
    return NextResponse.json({ processed: 0 })
  }

  let totalNew = 0

  for (const source of sources) {
    try {
      const articles =
        source.type === "rss"
          ? await fetchRSSFeed(source.url)
          : await scrapeUrl(source.url)

      for (const article of articles.slice(0, 20)) {
        const { data: inserted, error } = await supabase
          .from("articles")
          .upsert(
            {
              source_id: source.id,
              user_id: source.user_id,
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

        if (!error && inserted && article.content.length > 50) {
          totalNew++
          const result = await analyzeArticle(article.title, article.content)
          await supabase
            .from("articles")
            .update({ summary: result.summary, status: "processed" })
            .eq("id", inserted.id)

          await supabase.from("insights").insert({
            user_id: source.user_id,
            article_id: inserted.id,
            title: `Analyse : ${article.title.slice(0, 80)}`,
            content: result.summary,
            type: "summary",
            keywords: result.keywords,
            ai_model: "claude-sonnet-4-6",
            tokens_used: 0,
          })
        }
      }

      await supabase
        .from("sources")
        .update({ last_fetched_at: new Date().toISOString(), error_count: 0 })
        .eq("id", source.id)
    } catch (err: any) {
      await supabase
        .from("sources")
        .update({ error_count: (source.error_count ?? 0) + 1, last_error: err.message })
        .eq("id", source.id)
    }
  }

  return NextResponse.json({ processed: sources.length, newArticles: totalNew })
}
