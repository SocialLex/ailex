"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Rss, Sparkles, Mail, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  articleCount: number
  sourceCount: number
  insightCount: number
}

const steps = [
  {
    icon: Rss,
    title: "Ajoutez vos sources",
    description: "Flux RSS, sites web ou APIs à surveiller",
    href: "/sources",
    cta: "Ajouter une source",
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Sparkles,
    title: "Lancez l'analyse IA",
    description: "Claude analyse et résume chaque article automatiquement",
    href: "/insights",
    cta: "Voir les insights",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    icon: Mail,
    title: "Créez votre newsletter",
    description: "Générez et envoyez des newsletters personnalisées",
    href: "/newsletter",
    cta: "Créer une newsletter",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
]

export function OnboardingBanner({ articleCount, sourceCount, insightCount }: Props) {
  const counts = [sourceCount, articleCount, insightCount]
  const completedSteps = counts.filter((c) => c > 0).length
  const isComplete = completedSteps === 3

  if (isComplete) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card border-cyan-500/20 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-slate-900 dark:text-white font-semibold">Bienvenue sur AiLex !</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Complétez les étapes pour activer votre veille stratégique.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 dark:text-slate-400">{completedSteps}/3</span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  counts[i] > 0 ? "bg-cyan-500" : "bg-slate-200 dark:bg-white/10"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon
          const done = counts[i] > 0
          return (
            <div
              key={step.title}
              className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
                done
                  ? "bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 opacity-60"
                  : `${step.bg} ${step.border}`
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${step.bg} flex items-center justify-center`}>
                  {done ? (
                    <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400" />
                  ) : (
                    <Icon size={16} className={step.color} />
                  )}
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{step.title}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
              {!done && (
                <Button size="sm" variant="outline" asChild className="mt-auto gap-1.5">
                  <Link href={step.href}>
                    {step.cta}
                    <ArrowRight size={12} />
                  </Link>
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
