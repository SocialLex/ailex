"use client"

import { motion } from "framer-motion"
import { Rss, Brain, Mail, BarChart3, Shield, Zap, Globe, Bell } from "lucide-react"

const features = [
  {
    icon: Rss,
    title: "Légifrance & Journal Officiel",
    description:
      "Flux RSS officiel du Journal Officiel intégré nativement. Chaque texte promulgué est capté, analysé et classifié en temps réel.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
  },
  {
    icon: Brain,
    title: "Analyse IA juridique",
    description:
      "L'IA identifie le type (arrêt, décret, loi), génère un titre citation précis et résume l'impact pratique pour les professionnels du droit.",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
  },
  {
    icon: Mail,
    title: "Newsletters en un clic",
    description:
      "Sélectionnez vos articles, choisissez un template, et obtenez une newsletter juridique professionnelle rédigée et prête à envoyer.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord unifié",
    description:
      "Vue centralisée de toute l'actualité juridique : jurisprudences, textes législatifs et réglementaires triés par domaine et date.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
  },
  {
    icon: Shield,
    title: "Sources officielles uniquement",
    description:
      "Cour de Cassation, Conseil d'État, Sénat, Légifrance. Zéro bruit médiatique — uniquement des sources à valeur juridique.",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
  },
  {
    icon: Zap,
    title: "Détection instantanée",
    description:
      "Dès qu'un arrêt ou un texte est publié, La Veilleuse le capte, l'analyse et le rend disponible dans votre tableau de bord.",
    color: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/20",
  },
  {
    icon: Globe,
    title: "Filtres par domaine juridique",
    description:
      "Droit civil, pénal, social, public ou des affaires. Personnalisez votre veille selon votre spécialité pour ne voir que l'essentiel.",
    color: "from-rose-500/20 to-pink-500/20",
    border: "border-rose-500/20",
  },
  {
    icon: Bell,
    title: "Sécurité & conformité RGPD",
    description:
      "Données hébergées en Europe, chiffrement bout-en-bout, Row Level Security Supabase. Votre veille reste votre veille.",
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
            Tout ce qu'il faut pour
            <br />
            <span className="gradient-text">une veille juridique de qualité</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Sources officielles, analyse IA, classification automatique et newsletters
            professionnelles — réunis dans une seule plateforme dédiée au droit français.
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
