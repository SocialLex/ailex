"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUnsubscribe = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Désinscription confirmée</h1>
        <p className="text-slate-400 mb-6">
          {email ? `${email} a` : "Votre adresse a"} été retirée de notre liste de diffusion.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-white mb-2">Se désabonner</h1>
      <p className="text-slate-400 mb-8">
        {email
          ? <>Confirmer la désinscription de <strong className="text-white">{email}</strong> ?</>
          : "Confirmer votre désinscription de toutes les communications AiLex ?"}
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={handleUnsubscribe} disabled={loading} variant="destructive" className="gap-2">
          {loading && <Loader2 size={14} className="animate-spin" />}
          Confirmer la désinscription
        </Button>
        <Button asChild variant="ghost">
          <Link href="/">Annuler</Link>
        </Button>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Suspense fallback={<Loader2 className="animate-spin text-cyan-400" size={24} />}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  )
}
