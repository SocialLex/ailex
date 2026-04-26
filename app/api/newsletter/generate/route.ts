import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateNewsletterContent } from "@/lib/ai/pipeline"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { insights } = await request.json()
  if (!insights?.length) return NextResponse.json({ error: "Aucun insight fourni" }, { status: 400 })

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    const html = await generateNewsletterContent(insights, profile?.full_name ?? undefined)
    return NextResponse.json({ html })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
