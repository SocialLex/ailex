import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Champs autorisés pour la mise à jour d'une source (évite la mass assignment)
const ALLOWED_PATCH_FIELDS = new Set(["name", "url", "enabled", "type", "fetch_interval_hours"])

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  // Filtrer les champs non autorisés
  const safeUpdate: Record<string, unknown> = {}
  for (const key of Object.keys(body)) {
    if (ALLOWED_PATCH_FIELDS.has(key)) safeUpdate[key] = body[key]
  }

  if (Object.keys(safeUpdate).length === 0) {
    return NextResponse.json({ error: "Aucun champ valide à mettre à jour" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("sources")
    .update(safeUpdate)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ source: data })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { id } = await params

  const { error } = await supabase
    .from("sources")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
