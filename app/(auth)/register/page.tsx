"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Badge } from "@/components/ui/badge"

const planLabels: Record<string, string> = {
  pro: "Pro — 49€/mois",
  enterprise: "Enterprise — 199€/mois",
}

function RegisterContent() {
  const router = useRouter()
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Vérifiez votre email !</h2>
          <p className="text-slate-400 mb-6">
            Un lien de confirmation a été envoyé à <strong className="text-white">{email}</strong>.
            Cliquez sur le lien pour activer votre compte.
          </p>
          <Button variant="outline" asChild>
            <Link href="/login">Retour à la connexion</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex justify-center mb-6">
              <Logo size={36} />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Créer votre compte</h1>
            {plan !== "starter" ? (
              <Badge className="mt-2">{planLabels[plan]}</Badge>
            ) : (
              <p className="text-slate-400 text-sm">Gratuit, sans carte bancaire</p>
            )}
          </div>

          <button
            onClick={handleGoogleRegister}
            className="w-full flex items-center justify-center gap-3 h-11 glass rounded-xl hover:bg-white/10 transition-colors mb-6 text-white text-sm font-medium cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-slate-950/80 px-3 text-slate-500">ou avec email</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
                Nom complet
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Jean Dupont"
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@exemple.fr"
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Minimum 8 caractères"
                  className="w-full h-11 px-4 pr-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className={`flex items-center gap-1.5 mt-1.5 text-xs ${passwordStrength ? "text-green-400" : "text-slate-500"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength ? "bg-green-400" : "bg-slate-600"}`} />
                  {passwordStrength ? "Mot de passe sécurisé" : "8+ caractères, 1 majuscule, 1 chiffre"}
                </div>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Créer mon compte
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="text-slate-400 hover:text-white">conditions d'utilisation</Link>
            {" "}et notre{" "}
            <Link href="/privacy" className="text-slate-400 hover:text-white">politique de confidentialité</Link>.
          </p>

          <p className="text-center text-sm text-slate-400 mt-4">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}
