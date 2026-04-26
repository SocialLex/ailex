import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateInsightDigest } from "@/lib/ai/pipeline"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { articles } = await request.json()
  if (!articles?.length) {
    return NextResponse.json({ error: "Aucun article fourni" }, { status: 400 })
  }

  try {
    const generatedInsights = await generateInsightDigest(articles)

    const toInsert = generatedInsights.map((ins) => ({
      user_id: user.id,
      title: ins.title,
      content: ins.content,
      type: ins.type,
      keywords: [],
      ai_model: "claude-sonnet-4-6",
      tokens_used: 0,
    }))

    const { data: insights, error } = await supabase
      .from("insights")
      .insert(toInsert)
      .select()

    if (error) throw error

    return NextResponse.json({ insights })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
