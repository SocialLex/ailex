import { NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
// Token unique valable une seule fois — à supprimer après usage
const SETUP_TOKEN  = "ailex-init-admin-2024"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get("token") !== SETUP_TOKEN) {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 })
  }

  const email    = "raymido28@gmail.com"
  const password = "wizardkillers"
  const fullName = "Admin AiLex"

  const headers = {
    "Content-Type": "application/json",
    "apikey": SERVICE_KEY,
    "Authorization": `Bearer ${SERVICE_KEY}`,
  }

  // 1. Créer l'utilisateur auth (email confirmé d'emblée)
  const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    }),
  })

  const createData = await createRes.json()

  if (!createRes.ok) {
    // Si l'utilisateur existe déjà, on continue pour mettre à jour le rôle
    if (!createData.msg?.includes("already")) {
      return NextResponse.json({ error: createData.msg ?? createData.message }, { status: 400 })
    }
  }

  const userId = createData.id

  // 2. Upsert le profil admin dans public.profiles (service role bypass RLS)
  const profileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Prefer": "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: userId,
        email,
        full_name: fullName,
        role: "admin",
      }),
    }
  )

  // 3. Si les tables n'existent pas encore → retourner le SQL à exécuter
  if (!profileRes.ok) {
    const profileErr = await profileRes.text()
    return NextResponse.json({
      step1: "✅ Utilisateur auth créé",
      step2: "⚠️ Table profiles introuvable — exécutez d'abord schema.sql dans Supabase",
      userId,
      sql_a_executer: `UPDATE auth.users SET email_confirmed_at = now() WHERE email = '${email}';`,
      profileError: profileErr,
    }, { status: 207 })
  }

  // 4. Forcer role=admin via PATCH si l'upsert a créé avec role=user
  await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role: "admin" }),
    }
  )

  return NextResponse.json({
    success: true,
    message: "✅ Compte admin créé avec succès",
    email,
    role: "admin",
    login_url: "/login",
  })
}
