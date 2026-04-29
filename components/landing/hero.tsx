"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const ShaderAnimation = dynamic(
  () => import("@/components/ui/shader-animation").then((m) => m.ShaderAnimation),
  { ssr: false }
)

const stats = [
  { value: "10x", label: "Plus rapide qu'une veille manuelle" },
  { value: "3", label: "Sources officielles intégrées nativement" },
  { value: "100%", label: "Français · Officiel · RGPD" },
]

export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <ShaderAnimation />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />

      {/* Cyber grid overlay */}
      <div
        className="absolute inset-0 z-10 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge className="mb-6 text-xs px-4 py-1.5 gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Propulsé par l'IA · Légifrance · Cour de Cassation · Sénat
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-white">Éclairez </span>
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
            votre droit.
          </span>
          <br />
          <span className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold leading-snug">
            Ne restez plus dans l'ombre
            <br />
            de l'actualité juridique.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          La Veilleuse agrège Légifrance, le Sénat et la Cour de Cassation,
          analyse chaque texte par IA et génère votre newsletter juridique professionnelle en un clic.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button size="xl" variant="gradient" asChild className="group">
            <Link href="/register">
              Démarrer gratuitement
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" className="group gap-2 cursor-pointer">
            <Play className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            Voir la démo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {stats.map((stat) => (
            <div key={stat.value} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Défiler vers le bas"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  )
}
