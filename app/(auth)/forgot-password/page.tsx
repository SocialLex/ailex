"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Mail } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />

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
            <h1 className="text-2xl font-bold text-white mb-2">Mot de passe oublié</h1>
            <p className="text-slate-400 text-sm">
              Entrez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-slate-300 text-sm">
                Un email a été envoyé à <strong className="text-white">{email}</strong>.
                Vérifiez votre boîte de réception.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Retour à la connexion</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

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

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Envoyer le lien
              </Button>

              <p className="text-center text-sm text-slate-400">
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
                  Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
