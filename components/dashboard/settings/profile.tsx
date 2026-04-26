"use client"

import { useState, useEffect } from "react"
import { Loader2, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

export function ProfileSettings() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? "")
      supabase.from("profiles").select("full_name").eq("id", user!.id).single()
        .then(({ data }) => setFullName(data?.full_name ?? ""))
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("profiles").update({ full_name: fullName }).eq("id", user!.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={save} className="glass-card p-6 border-white/10 space-y-4">
      <h2 className="text-sm font-semibold text-white mb-2">Informations personnelles</h2>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Nom complet</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)}
          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500" />
      </div>
      <div>
        <label className="block text-xs text-slate-400 mb-1">Email</label>
        <input value={email} disabled
          className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
      </div>
      <Button type="submit" size="sm" disabled={loading} className="gap-2">
        {loading ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : null}
        {saved ? "Sauvegardé !" : "Sauvegarder"}
      </Button>
    </form>
  )
}
