"use client"

import { useState } from "react"
import { Plus, Mail, Send, Loader2, Eye, Trash2, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Insight { id: string; title: string; content: string; type: string; created_at: string }
interface Newsletter { id: string; name: string; description: string | null; recipient_emails: string[]; created_at: string }

interface Props {
  newsletters: Newsletter[]
  availableInsights: Insight[]
}

export function NewsletterClient({ newsletters: initial, availableInsights }: Props) {
  const [newsletters, setNewsletters] = useState(initial)
  const [step, setStep] = useState<"list" | "create" | "compose">("list")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [recipients, setRecipients] = useState("raymido28@gmail.com")
  const [selectedInsights, setSelectedInsights] = useState<string[]>([])
  const [subject, setSubject] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [activeNewsletter, setActiveNewsletter] = useState<Newsletter | null>(null)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const createNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        recipient_emails: recipients.split(",").map((e) => e.trim()).filter(Boolean),
      }),
    })
    const data = await res.json()
    if (data.newsletter) {
      setNewsletters((p) => [data.newsletter, ...p])
      setStep("list")
      setName("")
      setDescription("")
    }
  }

  const generateContent = async () => {
    if (!selectedInsights.length) return
    setGenerating(true)
    const insights = availableInsights.filter((i) => selectedInsights.includes(i.id))
    try {
      const res = await fetch("/api/newsletter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insights }),
      })
      const data = await res.json()
      setHtmlContent(data.html ?? "")
      if (!subject) setSubject(`Veille AiLex — ${new Date().toLocaleDateString("fr-FR")}`)
    } finally {
      setGenerating(false)
    }
  }

  const sendNewsletter = async () => {
    if (!activeNewsletter || !htmlContent || !subject) return
    setSending(true)
    setMsg(null)
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newsletter_id: activeNewsletter.id,
          subject,
          html: htmlContent,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg({ type: "success", text: `Newsletter envoyée à ${data.sent} destinataire(s) !` })
        setHtmlContent("")
        setSubject("")
        setSelectedInsights([])
        setStep("list")
      } else {
        setMsg({ type: "error", text: data.error ?? "Erreur lors de l'envoi" })
      }
    } finally {
      setSending(false)
    }
  }

  if (step === "create") {
    return (
      <div className="glass-card p-6 border-white/10 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-5">Nouvelle newsletter</h2>
        <form onSubmit={createNewsletter} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              placeholder="Ma veille juridique"
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle"
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Destinataires (séparés par virgule)</label>
            <textarea value={recipients} onChange={(e) => setRecipients(e.target.value)} required rows={3}
              placeholder="email1@exemple.fr, email2@exemple.fr"
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" size="sm">Créer</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep("list")}>Annuler</Button>
          </div>
        </form>
      </div>
    )
  }

  if (step === "compose" && activeNewsletter) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setStep("list")}>← Retour</Button>
          <h2 className="text-lg font-semibold text-white">{activeNewsletter.name}</h2>
          <Badge variant="secondary">
            <Users size={11} className="mr-1" />{activeNewsletter.recipient_emails.length} destinataire(s)
          </Badge>
        </div>

        {msg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${msg.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: insight selector */}
          <div className="glass-card border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Sélectionner les insights</h3>
              <Button size="sm" variant="outline" onClick={generateContent} disabled={!selectedInsights.length || generating} className="gap-1.5">
                {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Générer
              </Button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {availableInsights.map((ins) => (
                <label key={ins.id} className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedInsights.includes(ins.id) ? "bg-cyan-500/10 border border-cyan-500/20" : "hover:bg-white/5"}`}>
                  <input type="checkbox" checked={selectedInsights.includes(ins.id)}
                    onChange={(e) => setSelectedInsights((p) => e.target.checked ? [...p, ins.id] : p.filter((id) => id !== ins.id))}
                    className="mt-0.5 accent-cyan-500" />
                  <div>
                    <p className="text-xs font-medium text-white line-clamp-1">{ins.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(ins.created_at)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Right: editor + send */}
          <div className="glass-card border-white/10 p-5 flex flex-col gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Objet</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de la newsletter"
                className="w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-slate-400 mb-1">Contenu HTML</label>
              <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} rows={12}
                placeholder="Le contenu HTML sera généré automatiquement par l'IA…"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none font-mono" />
            </div>
            <Button onClick={sendNewsletter} disabled={sending || !htmlContent || !subject} variant="gradient" className="gap-2 w-full">
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Envoyer la newsletter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setStep("create")} className="gap-2">
        <Plus size={16} /> Nouvelle newsletter
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsletters.length === 0 ? (
          <div className="col-span-3 glass-card p-10 text-center text-slate-500 border-white/10">
            <Mail size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune newsletter créée</p>
          </div>
        ) : (
          newsletters.map((nl) => (
            <div key={nl.id} className="glass-card border-white/10 p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{nl.name}</h3>
                  {nl.description && <p className="text-xs text-slate-500 mt-0.5">{nl.description}</p>}
                </div>
                <Badge variant="secondary">
                  <Users size={10} className="mr-1" />{nl.recipient_emails.length}
                </Badge>
              </div>
              <p className="text-xs text-slate-600">{formatDate(nl.created_at)}</p>
              <Button size="sm" variant="outline" className="w-full gap-2"
                onClick={() => { setActiveNewsletter(nl); setStep("compose") }}>
                <Send size={13} /> Composer &amp; envoyer
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
