import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendNewsletter } from "@/lib/email/resend"
import { z } from "zod"

const schema = z.object({
  newsletter_id: z.string().uuid(),
  subject: z.string().min(1),
  html: z.string().min(1),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data: newsletter } = await supabase
    .from("newsletters")
    .select("*")
    .eq("id", parsed.data.newsletter_id)
    .eq("user_id", user.id)
    .single()

  if (!newsletter) return NextResponse.json({ error: "Newsletter introuvable" }, { status: 404 })
  if (!newsletter.recipient_emails?.length) {
    return NextResponse.json({ error: "Aucun destinataire configuré" }, { status: 400 })
  }

  try {
    await sendNewsletter({
      to: newsletter.recipient_emails,
      subject: parsed.data.subject,
      html: parsed.data.html,
    })

    await supabase.from("newsletter_issues").insert({
      newsletter_id: newsletter.id,
      user_id: user.id,
      subject: parsed.data.subject,
      content: parsed.data.html,
      status: "sent",
      sent_at: new Date().toISOString(),
      recipient_count: newsletter.recipient_emails.length,
    })

    return NextResponse.json({ success: true, sent: newsletter.recipient_emails.length })
  } catch (err: any) {
    await supabase.from("newsletter_issues").insert({
      newsletter_id: newsletter.id,
      user_id: user.id,
      subject: parsed.data.subject,
      content: parsed.data.html,
      status: "failed",
      recipient_count: 0,
    })
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
