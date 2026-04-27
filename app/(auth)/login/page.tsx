"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

const HERO_IMAGE = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4 flex-shrink-0">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C42 35 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
    } else {
      router.refresh()
      router.push("/dashboard")
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">

      {/* ─── Gauche : formulaire ─────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm space-y-7">

          {/* Logo */}
          <div className="animate-auth-in" style={{ animationDelay: "0ms" }}>
            <Link href="/">
              <Logo size={28} />
            </Link>
          </div>

          {/* Titre */}
          <div className="animate-auth-in" style={{ animationDelay: "80ms" }}>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Bon retour !
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
              Connectez-vous à votre espace AiLex
            </p>
          </div>

          {/* Google OAuth */}
          <div className="animate-auth-in" style={{ animationDelay: "140ms" }}>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
          </div>

          {/* Séparateur */}
          <div className="animate-auth-in relative flex items-center" style={{ animationDelay: "180ms" }}>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="px-3 text-xs text-slate-400">ou avec email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="animate-auth-in flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="animate-auth-in" style={{ animationDelay: "220ms" }}>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Adresse email
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-colors focus-within:border-cyan-500/60 dark:focus-within:border-cyan-500/50 focus-within:bg-white dark:focus-within:bg-white/8">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="vous@exemple.fr"
                  className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none rounded-xl"
                />
              </div>
            </div>

            <div className="animate-auth-in" style={{ animationDelay: "280ms" }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Mot de passe
                </label>
                <Link href="/reset-password" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-colors focus-within:border-cyan-500/60 dark:focus-within:border-cyan-500/50 focus-within:bg-white dark:focus-within:bg-white/8">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full bg-transparent px-4 py-3 pr-11 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="animate-auth-in" style={{ animationDelay: "340ms" }}>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 size={15} className="animate-spin mr-2" />}
                Se connecter
              </Button>
            </div>
          </form>

          <p className="animate-auth-in text-center text-sm text-slate-500 dark:text-slate-400" style={{ animationDelay: "400ms" }}>
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">
              Créer un compte gratuit
            </Link>
          </p>
        </div>
      </section>

      {/* ─── Droite : image hero ─────────────────────────────── */}
      <section className="hidden md:block flex-1 relative p-4">
        {/* Image de fond */}
        <div
          className="auth-slide-in absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        </div>

        {/* Citation juridique */}
        <div className="auth-slide-in absolute bottom-10 left-8 right-8" style={{ animationDelay: "300ms" }}>
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <p className="text-white/90 text-sm leading-relaxed italic mb-3">
              "La loi est l'expression de la volonté générale. Tous les citoyens ont droit de concourir personnellement, ou par leurs représentants, à sa formation."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                §
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Déclaration des Droits de l'Homme</p>
                <p className="text-white/50 text-xs">Article 6 · 26 août 1789</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
