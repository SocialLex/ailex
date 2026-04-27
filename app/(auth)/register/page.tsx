"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

const HERO_IMAGE = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"

const planLabels: Record<string, string> = {
  pro: "Plan Pro — 49€/mois",
  enterprise: "Plan Enterprise — 199€/mois",
}

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-4 w-4 flex-shrink-0">
    <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C42 35 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
  </svg>
)

function RegisterContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "starter"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const passwordStrength = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordStrength) {
      setError("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.")
      return
    }
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, plan },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogleRegister = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  if (success) {
    return (
      <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">
        <section className="flex-1 flex items-center justify-center p-8 md:p-12">
          <div className="w-full max-w-sm text-center space-y-6 animate-auth-in">
            <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Vérifiez votre email !</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Un lien de confirmation a été envoyé à{" "}
                <strong className="text-slate-900 dark:text-white">{email}</strong>.
                Cliquez sur le lien pour activer votre compte.
              </p>
            </div>
            <Button variant="outline" asChild className="w-full">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
          </div>
        </section>
        <section className="hidden md:block flex-1 relative p-4">
          <div
            className="auth-slide-in absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-background">

      {/* ─── Gauche : formulaire ─────────────────────────────── */}
      <section className="flex-1 flex items-center justify-center p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">

          {/* Logo + titre */}
          <div className="animate-auth-in" style={{ animationDelay: "0ms" }}>
            <Link href="/" className="inline-flex mb-5">
              <Logo size={28} />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Créer votre compte
            </h1>
            {plan !== "starter" ? (
              <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mt-1.5">
                {planLabels[plan]}
              </p>
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
                Gratuit, sans carte bancaire
              </p>
            )}
          </div>

          {/* Google OAuth */}
          <div className="animate-auth-in" style={{ animationDelay: "80ms" }}>
            <button
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
          </div>

          {/* Séparateur */}
          <div className="animate-auth-in relative flex items-center" style={{ animationDelay: "120ms" }}>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="px-3 text-xs text-slate-400">ou avec email</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Formulaire */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="animate-auth-in flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Nom complet */}
            <div className="animate-auth-in" style={{ animationDelay: "160ms" }}>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Nom complet
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-colors focus-within:border-cyan-500/60 dark:focus-within:border-cyan-500/50 focus-within:bg-white dark:focus-within:bg-white/8">
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Jean Dupont"
                  className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none rounded-xl"
                />
              </div>
            </div>

            {/* Email */}
            <div className="animate-auth-in" style={{ animationDelay: "210ms" }}>
              <label htmlFor="email" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Adresse email
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-colors focus-within:border-cyan-500/60 dark:focus-within:border-cyan-500/50 focus-within:bg-white dark:focus-within:bg-white/8">
                <input
                  id="email"
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

            {/* Mot de passe */}
            <div className="animate-auth-in" style={{ animationDelay: "260ms" }}>
              <label htmlFor="password" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Mot de passe
              </label>
              <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 transition-colors focus-within:border-cyan-500/60 dark:focus-within:border-cyan-500/50 focus-within:bg-white dark:focus-within:bg-white/8">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="8+ caractères, 1 majuscule, 1 chiffre"
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
              {password.length > 0 && (
                <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${passwordStrength ? "text-green-600 dark:text-green-400" : "text-slate-400"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${passwordStrength ? "bg-green-500" : "bg-slate-400"}`} />
                  {passwordStrength ? "Mot de passe sécurisé" : "8+ caractères, 1 majuscule, 1 chiffre"}
                </div>
              )}
            </div>

            <div className="animate-auth-in" style={{ animationDelay: "310ms" }}>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 size={15} className="animate-spin mr-2" />}
                Créer mon compte
              </Button>
            </div>
          </form>

          <p className="animate-auth-in text-center text-xs text-slate-400 dark:text-slate-500" style={{ animationDelay: "360ms" }}>
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2">conditions d'utilisation</Link>
            {" "}et notre{" "}
            <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300 underline underline-offset-2">politique de confidentialité</Link>.
          </p>

          <p className="animate-auth-in text-center text-sm text-slate-500 dark:text-slate-400" style={{ animationDelay: "400ms" }}>
            Déjà un compte ?{" "}
            <Link href="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </section>

      {/* ─── Droite : image hero ─────────────────────────────── */}
      <section className="hidden md:block flex-1 relative p-4">
        <div
          className="auth-slide-in absolute inset-4 rounded-3xl bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
        </div>

        {/* Citation juridique */}
        <div className="auth-slide-in absolute bottom-10 left-8 right-8" style={{ animationDelay: "300ms" }}>
          <div className="bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-5">
            <p className="text-white/90 text-sm leading-relaxed italic mb-3">
              "Nul ne peut être contraint de faire ce que la loi n'ordonne pas et nul ne peut être empêché de faire ce qu'elle ne défend pas."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                §
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Déclaration des Droits de l'Homme</p>
                <p className="text-white/50 text-xs">Article 5 · 26 août 1789</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
