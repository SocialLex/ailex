"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, AlertCircle, Eye, EyeOff, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 2000)
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
            <h1 className="text-2xl font-bold text-white mb-2">Nouveau mot de passe</h1>
            <p className="text-slate-400 text-sm">Choisissez un mot de passe sécurisé.</p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-slate-300 text-sm">
                Mot de passe mis à jour ! Redirection en cours…
              </p>
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
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Répétez le mot de passe"
                  className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Mettre à jour le mot de passe
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
