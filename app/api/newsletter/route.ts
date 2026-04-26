import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  recipient_emails: z.array(z.string().email()).min(1),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { data: newsletter, error } = await supabase
    .from("newsletters")
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ newsletter }, { status: 201 })
}
