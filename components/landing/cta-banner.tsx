"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaBanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card border-cyan-500/20 p-12 text-center glow-cyan-sm"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-6">
            <Sparkles size={14} />
            Démarrez gratuitement aujourd'hui
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Prêt à automatiser
            <br />
            <span className="gradient-text">votre veille stratégique ?</span>
          </h2>

          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Rejoignez 2 400+ juristes et compliance officers qui ont choisi AiLex.
            Sans carte bancaire. Sans engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="gradient" asChild className="group min-w-56">
              <Link href="/register">
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="#pricing">Voir les tarifs</Link>
            </Button>
          </div>

          <p className="text-slate-600 text-xs mt-6">
            Plan Starter gratuit · Upgrade possible à tout moment · Hébergé en 🇫🇷 France
          </p>
        </motion.div>
      </div>
    </section>
  )
}
