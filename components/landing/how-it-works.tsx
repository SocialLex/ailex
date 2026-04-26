"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "01",
    title: "Configurez vos sources",
    description:
      "Ajoutez vos flux RSS, sites web et APIs en quelques clics. AiLex prend en charge Légifrance, EUR-Lex, Dalloz, et des centaines d'autres sources juridiques.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    number: "02",
    title: "L'IA analyse en continu",
    description:
      "Notre pipeline IA collecte, déduplique et analyse chaque article. Claude extrait les insights clés, identifie les risques et catégorise les informations automatiquement.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    number: "03",
    title: "Recevez vos insights",
    description:
      "Consultez votre dashboard en temps réel ou recevez vos newsletters personnalisées. Chaque insight est sourcé, daté et accompagné d'une analyse contextuelle.",
    gradient: "from-purple-500 to-cyan-500",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      {/* Background glow */}
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
            Opérationnel en{" "}
            <span className="gradient-text">moins de 5 minutes</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Pas de configuration complexe. Pas de code. Juste une veille puissante et automatisée.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative text-center"
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
      </div>
    </section>
  )
}
