import { NextResponse } from "next/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  return profile?.role === "admin" ? user : null
}

// POST — créer un utilisateur
export async function POST(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { email, password, fullName, plan, durationDays } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
  }

  const admin = getAdminClient()

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName || email.split("@")[0] },
  })

  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 400 })
  }

  const userId = userData.user.id
  const periodEnd = durationDays > 0
    ? new Date(Date.now() + Number(durationDays) * 86_400_000).toISOString()
    : null

  // Mettre à jour le plan de l'abonnement créé par le trigger
  await admin.from("subscriptions").upsert({
    user_id: userId,
    plan: plan || "starter",
    status: "active",
    current_period_start: new Date().toISOString(),
    current_period_end: periodEnd,
  })

  return NextResponse.json({ success: true, userId, email })
}

// PATCH — modifier le plan ou révoquer l'accès
export async function PATCH(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { userId, action, plan, durationDays } = await request.json()
  if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 })

  const admin = getAdminClient()

  if (action === "revoke") {
    await admin.from("subscriptions")
      .update({ plan: "starter", status: "canceled" })
      .eq("user_id", userId)
    return NextResponse.json({ success: true })
  }

  if (action === "update_plan") {
    const periodEnd = durationDays > 0
      ? new Date(Date.now() + Number(durationDays) * 86_400_000).toISOString()
      : null
    await admin.from("subscriptions")
      .update({
        plan,
        status: "active",
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd,
      })
      .eq("user_id", userId)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Action invalide" }, { status: 400 })
}

// DELETE — supprimer un compte
export async function DELETE(request: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  if (!userId) return NextResponse.json({ error: "userId requis" }, { status: 400 })

  const admin = getAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
