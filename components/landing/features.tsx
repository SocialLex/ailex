"use client"

import { motion } from "framer-motion"
import { Rss, Brain, Mail, BarChart3, Shield, Zap, Globe, Bell } from "lucide-react"

const features = [
  {
    icon: Rss,
    title: "Ingestion multi-sources",
    description:
      "Agrégez des centaines de flux RSS, sites web et APIs en temps réel. Couverture complète de l'actualité juridique et réglementaire.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
  },
  {
    icon: Brain,
    title: "Analyse par IA Claude",
    description:
      "Notre moteur IA analyse, synthétise et extrait les informations clés. Identifiez les risques et opportunités en quelques secondes.",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
  },
  {
    icon: Mail,
    title: "Newsletters automatisées",
    description:
      "Créez et planifiez des newsletters personnalisées. Livrez les bons insights aux bonnes personnes, au bon moment.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Tableaux de bord analytics",
    description:
      "Visualisez les tendances, mesurez l'impact de vos newsletters et suivez les métriques qui comptent pour votre activité.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
  },
  {
    icon: Shield,
    title: "Sécurité & conformité RGPD",
    description:
      "Vos données restent en Europe. Chiffrement bout-en-bout, Row Level Security et conformité RGPD intégrée.",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Traitement en temps réel",
    description:
      "Dès qu'une nouvelle loi, directive ou jurisprudence est publiée, AiLex la détecte, l'analyse et vous alerte instantanément.",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Veille internationale",
    description:
      "Surveillez les évolutions réglementaires en France, en Europe et à l'international. Support multilingue intégré.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
  },
  {
    icon: Bell,
    title: "Alertes intelligentes",
    description:
      "Définissez vos mots-clés et recevez des alertes contextualisées dès qu'un sujet critique émerge dans votre domaine.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-4">
            Fonctionnalités
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tout ce dont vous avez besoin
            <br />
            <span className="gradient-text">pour une veille efficace</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Une plateforme complète qui automatise l'ensemble du cycle de veille stratégique,
            de la collecte à la diffusion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`glass-card p-6 ${feature.border} hover:-translate-y-1 hover:bg-white/8 transition-all duration-200`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
