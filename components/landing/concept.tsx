"use client"

import { motion } from "framer-motion"
import { Lightbulb, BookOpen, Target, Clock, FileText, Scale } from "lucide-react"

const tips = [
  {
    icon: Target,
    title: "Ciblez vos domaines",
    body: "Activez uniquement les sources pertinentes à votre pratique. Un avocat en droit social n'a pas les mêmes besoins qu'un juriste d'entreprise en droit des affaires.",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/20",
  },
  {
    icon: Clock,
    title: "Planifiez vos newsletters",
    body: "Le lundi matin est le moment idéal pour envoyer une newsletter juridique hebdomadaire. Configurez l'envoi automatique pour ne jamais manquer la fenêtre.",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
  },
  {
    icon: FileText,
    title: "Soignez vos templates",
    body: "Un bon template de veille cite systématiquement la juridiction, la chambre et le numéro de pourvoi. La Veilleuse vous propose des modèles prêts à l'emploi.",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/20",
  },
  {
    icon: Scale,
    title: "Hiérarchisez par impact",
    body: "Utilisez les filtres de type (arrêt, décret, loi) pour prioriser. Un arrêt de la Cour de Cassation a plus d'impact immédiat qu'un décret d'application.",
    color: "from-orange-500/20 to-amber-500/20",
    border: "border-orange-500/20",
  },
]

export function Concept() {
  return (
    <section id="concept" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/3 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-4">
            <Lightbulb size={14} />
            Concept & Tips
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Conçu pour les{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">professionnels du droit</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            La Veilleuse n'est pas un simple agrégateur. C'est un assistant juridique qui transforme
            le flux constant de l'actualité légale en veille stratégique exploitable.
          </p>
        </motion.div>

        {/* Concept block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card border-cyan-500/15 p-8 md:p-10 mb-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-cyan-500 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                C'est quoi La Veilleuse ?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                La Veilleuse agrège automatiquement les sources officielles françaises — <strong className="text-slate-900 dark:text-white">Légifrance</strong>,
                le <strong className="text-slate-900 dark:text-white">Sénat</strong>, la <strong className="text-slate-900 dark:text-white">Cour de Cassation</strong>,
                le <strong className="text-slate-900 dark:text-white">Conseil d'État</strong> — et les analyse par IA pour en extraire
                l'essentiel. Chaque texte est classifié (jurisprudence, loi, décret, accord d'entreprise),
                résumé et mis en contexte.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Le résultat : une newsletter juridique de qualité professionnelle, générée en un clic,
                prête à être envoyée à vos clients, collègues ou équipes compliance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tips.map((tip, i) => {
            const Icon = tip.icon
            return (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card p-6 ${tip.border} hover:-translate-y-0.5 transition-all duration-200`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1.5">{tip.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
