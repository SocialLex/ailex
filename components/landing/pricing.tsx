"use client"

import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    period: "/mois",
    description: "Pour découvrir AiLex et ses fonctionnalités de base",
    features: [
      "5 sources RSS",
      "Newsletter hebdomadaire",
      "50 analyses IA/mois",
      "Dashboard basique",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    variant: "outline" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "/mois",
    description: "Pour les professionnels qui ont besoin d'une veille avancée",
    features: [
      "Sources illimitées",
      "Newsletter quotidienne",
      "Analyses IA illimitées",
      "Dashboard avancé + analytics",
      "Alertes en temps réel",
      "Export PDF & Excel",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    href: "/register?plan=pro",
    variant: "gradient" as const,
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "/mois",
    description: "Pour les équipes et cabinets avec des besoins avancés",
    features: [
      "Tout ce qui est dans Pro",
      "Multi-utilisateurs (10+)",
      "White-label newsletter",
      "API dédiée",
      "SLA 99.9%",
      "Intégrations personnalisées",
      "Account manager dédié",
    ],
    cta: "Nous contacter",
    href: "/register?plan=enterprise",
    variant: "secondary" as const,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-4">
            Tarifs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Des tarifs <span className="gradient-text">transparents</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Commencez gratuitement, évoluez selon vos besoins. Aucune carte bancaire requise
            pour l'offre Starter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative glass-card p-8 flex flex-col ${
                plan.highlighted
                  ? "border-cyan-500/40 glow-cyan"
                  : "border-white/10"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    Populaire
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price === 0 ? "Gratuit" : `${plan.price}€`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-400 text-sm">{plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} size="lg" className="w-full" asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
