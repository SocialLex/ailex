"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Wand2, Upload, Download, Trash2, X, FileText,
  Loader2, Newspaper, CheckCircle, AlertCircle, Info, Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArticleRef {
  id: string
  title: string
  summary: string | null
  url: string
  source: string
  published_at: string | null
}

const DEFAULT_TEMPLATE = `# Veille Juridique — [DATE]

## Faits marquants de la période
[SYNTHESE_GENERALE]

## Articles analysés
[ARTICLES_ANALYSES]

## Points d'attention
[POINTS_ATTENTION]

## Recommandations
[RECOMMANDATIONS]`

export default function GenerationPage() {
  const [articles, setArticles] = useState<ArticleRef[]>([])
  const [template, setTemplate] = useState("")
  const [instructions, setInstructions] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  // Charger les articles depuis localStorage (poussés depuis /articles)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ailex_generation_articles")
      if (stored) {
        setArticles(JSON.parse(stored))
        localStorage.removeItem("ailex_generation_articles")
      }
    } catch {}
  }, [])

  const removeArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id))

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setTemplateName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setTemplate(ev.target?.result as string ?? "")
    reader.readAsText(file, "UTF-8")
  }

  const handleGenerate = async () => {
    if (articles.length === 0) { setError("Sélectionnez au moins un article depuis la page Articles."); return }
    setLoading(true)
    setError("")
    setOutput("")

    try {
      const res = await fetch("/api/generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles, template: template || DEFAULT_TEMPLATE, instructions }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erreur de génération"); return }
      setOutput(data.content)
    } catch (err: any) {
      setError(err.message ?? "Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `veille-juridique-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5 max-w-7xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-0.5">Génération de veille</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Sélectionnez vos articles, uploadez votre template, et laissez l'IA rédiger votre veille juridique.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">

        {/* ─── Colonne gauche ─────────────────────────────── */}
        <div className="space-y-4">

          {/* Step 1 — Articles sélectionnés */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Articles sélectionnés</h2>
                {articles.length > 0 && (
                  <span className="text-xs bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-full font-medium">{articles.length}</span>
                )}
              </div>
              <Link href="/articles" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                <Newspaper size={12} />
                Parcourir les articles
              </Link>
            </div>

            <div className="p-4">
              {articles.length === 0 ? (
                <div className="py-8 text-center">
                  <Newspaper size={28} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aucun article sélectionné</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Allez dans Articles, cochez vos articles et cliquez "Pousser vers Génération"</p>
                  <Button asChild size="sm" className="mt-3">
                    <Link href="/articles">Sélectionner des articles</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {articles.map(a => (
                    <div key={a.id} className="flex items-start gap-2.5 p-2.5 bg-slate-50 dark:bg-white/3 rounded-lg border border-slate-100 dark:border-white/5 group">
                      <CheckCircle size={14} className="text-cyan-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">{a.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{a.source}</p>
                      </div>
                      <button onClick={() => removeArticle(a.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer flex-shrink-0">
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Step 2 — Template */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Template</h2>
              </div>
              {template && (
                <button onClick={() => { setTemplate(""); setTemplateName("") }} className="text-xs text-red-500 hover:underline cursor-pointer">Supprimer</button>
              )}
            </div>

            <div className="p-4 space-y-3">
              {/* Info template */}
              <div className="flex gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
                <Info size={13} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium mb-0.5">Préparer votre template</p>
                  <p>Créez un fichier <code>.txt</code> avec la structure de votre veille. Utilisez des zones entre <code>[CROCHETS]</code> pour indiquer à l'IA ce qu'elle doit remplir (ex: <code>[SYNTHESE]</code>, <code>[ANALYSE]</code>, <code>[DATE]</code>).</p>
                </div>
              </div>

              {/* Upload zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-cyan-500/40 rounded-xl p-5 text-center cursor-pointer transition-colors group"
              >
                {templateName ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <FileText size={16} className="text-cyan-500" />
                    {templateName}
                  </div>
                ) : (
                  <>
                    <Upload size={20} className="mx-auto mb-2 text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 transition-colors" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Cliquez pour importer votre template</p>
                    <p className="text-xs text-slate-400 mt-1">Fichiers .txt, .md acceptés</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".txt,.md" className="hidden" onChange={handleTemplateUpload} />

              {!template && (
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                  Aucun template → le template par défaut sera utilisé
                </p>
              )}

              {/* Preview */}
              {template && (
                <textarea
                  value={template}
                  onChange={e => setTemplate(e.target.value)}
                  rows={6}
                  className="w-full text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
                  placeholder="Contenu du template…"
                />
              )}
            </div>
          </div>

          {/* Step 3 — Instructions */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Instructions spécifiques <span className="text-slate-400 font-normal">(optionnel)</span></h2>
            </div>
            <div className="p-4">
              <textarea
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                rows={3}
                placeholder="Ex: Mets l'accent sur les impacts pour les PME, utilise un ton vulgarisé, concentre-toi sur le droit du travail…"
                className="w-full text-sm rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 p-3 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Générer */}
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-700 dark:text-red-400">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            disabled={loading || articles.length === 0}
            size="lg"
            variant="gradient"
            className="w-full gap-2"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Génération en cours…</>
            ) : (
              <><Wand2 size={16} /> Générer la veille juridique</>
            )}
          </Button>
        </div>

        {/* ─── Colonne droite — Output ─────────────────────── */}
        <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText size={15} className="text-cyan-500" />
              Veille générée
            </h2>
            {output && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Copy size={13} />
                  {copied ? "Copié !" : "Copier"}
                </button>
                <Button size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download size={13} />
                  Télécharger .txt
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-pulse" />
                    <div className="absolute inset-2 rounded-full border-t-2 border-cyan-500 animate-spin" />
                    <Wand2 size={20} className="absolute inset-0 m-auto text-cyan-400" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Claude analyse vos articles…</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Cela peut prendre 15 à 30 secondes</p>
                </div>
              </div>
            ) : output ? (
              <pre className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-xs">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Wand2 size={24} className="text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">La veille générée apparaîtra ici</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Sélectionnez des articles et cliquez sur "Générer"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
