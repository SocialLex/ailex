"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Activez vos sources officielles",
    description:
      "En deux clics, activez les flux RSS de Légifrance, du Sénat ou de la Cour de Cassation. La Veilleuse commence à ingérer les textes immédiatement.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    number: "02",
    title: "L'IA classe et résume",
    description:
      "Chaque texte est identifié (jurisprudence, loi, décret, accord), résumé en points clés et titré avec la citation juridique correcte (juridiction, chambre, date).",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    number: "03",
    title: "Générez votre newsletter",
    description:
      "Sélectionnez les articles pertinents, appuyez sur Générer. La Veilleuse rédige une newsletter juridique professionnelle prête à envoyer à vos clients ou équipes.",
    gradient: "from-purple-500 to-cyan-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-4">
            Comment ça marche
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Opérationnelle en{" "}
            <span className="gradient-text">moins de 5 minutes</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Pas de configuration complexe. Pas de code. Une veille juridique professionnelle
            automatisée, du texte officiel à la newsletter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connecting dashes between steps — positioned relative to icon row */}
          <div className="hidden lg:flex absolute top-8 left-0 right-0 items-center justify-center pointer-events-none">
            <div className="w-full max-w-xl mx-auto flex items-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent ml-28 mr-4" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent ml-4 mr-28" />
            </div>
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative text-center px-4"
            >
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} p-[1px] glow-cyan-sm`}>
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                    <span className="text-2xl font-bold gradient-text">{step.number}</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-slate-400 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
