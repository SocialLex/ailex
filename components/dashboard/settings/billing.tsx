"use client"

import { useState, useEffect } from "react"
import { Crown, Loader2, CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

const plans = [
  { id: "starter", name: "Starter", price: "Gratuit", features: ["5 sources", "Newsletter hebdomadaire", "50 analyses/mois"] },
  { id: "pro", name: "Pro", price: "49€/mois", features: ["Sources illimitées", "Newsletter quotidienne", "Analyses illimitées"], highlighted: true },
  { id: "enterprise", name: "Enterprise", price: "199€/mois", features: ["Tout Pro", "Multi-utilisateurs", "API dédiée"] },
]

export function BillingSettings() {
  const searchParams = useSearchParams()
  const [currentPlan, setCurrentPlan] = useState("starter")
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("subscriptions").select("plan").eq("user_id", user.id).single()
        .then(({ data }) => setCurrentPlan(data?.plan ?? "starter"))
    })
  }, [])

  const upgrade = async (planId: string) => {
    if (planId === "starter") return
    setLoading(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(null)
    }
  }

  const success = searchParams.get("success")
  const canceled = searchParams.get("canceled")

  return (
    <div className="space-y-4">
      {success && (
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 text-green-400 text-sm">
          <CheckCircle size={16} />
          Abonnement activé avec succès !
        </div>
      )}
      {canceled && (
        <div className="flex items-center gap-2 bg-slate-500/10 border border-slate-500/20 rounded-lg px-4 py-3 text-slate-400 text-sm">
          <XCircle size={16} />
          Paiement annulé.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id}
            className={`glass-card p-5 flex flex-col gap-3 ${plan.highlighted ? "border-cyan-500/30" : "border-white/10"} ${currentPlan === plan.id ? "ring-1 ring-cyan-500/50" : ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">{plan.name}</h3>
              {currentPlan === plan.id && (
                <Badge><Crown size={10} className="mr-1" />Actuel</Badge>
              )}
            </div>
            <p className="text-xl font-bold text-white">{plan.price}</p>
            <ul className="space-y-1.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            {currentPlan !== plan.id && plan.id !== "starter" && (
              <Button size="sm" variant={plan.highlighted ? "default" : "outline"}
                onClick={() => upgrade(plan.id)} disabled={!!loading} className="w-full">
                {loading === plan.id && <Loader2 size={13} className="animate-spin mr-1.5" />}
                Passer au plan {plan.name}
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
