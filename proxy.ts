import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Si les variables d'environnement Supabase ne sont pas configurées, on laisse passer
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  if (!supabaseUrl.startsWith("http") || !supabaseKey.startsWith("eyJ")) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // En cas d'erreur réseau/Supabase, on laisse passer sans bloquer
  }

  const { pathname } = request.nextUrl

  // Protéger le dashboard et les routes admin
  const isProtected = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/sources") ||
    pathname.startsWith("/insights") ||
    pathname.startsWith("/newsletter") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/articles") ||
    pathname.startsWith("/generation") ||
    pathname.startsWith("/support")

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Rediriger les utilisateurs connectés loin des pages auth
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
