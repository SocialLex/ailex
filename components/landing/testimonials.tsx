"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Marie Leconte",
    role: "Directrice juridique",
    company: "Groupe Vinci",
    avatar: "ML",
    color: "from-cyan-500 to-blue-500",
    text: "AiLex a transformé notre veille réglementaire. Ce qui prenait 3 heures par jour se fait maintenant en 10 minutes. Les résumés IA sont d'une précision remarquable.",
    stars: 5,
  },
  {
    name: "Thomas Renard",
    role: "Associé",
    company: "Cabinet Renard & Associés",
    avatar: "TR",
    color: "from-purple-500 to-pink-500",
    text: "Indispensable pour notre cabinet. Nous suivons en temps réel l'actualité du droit des affaires et envoyons des newsletters personnalisées à nos clients. Un vrai différenciateur.",
    stars: 5,
  },
  {
    name: "Sophie Dumont",
    role: "Compliance Officer",
    company: "BNP Paribas",
    avatar: "SD",
    color: "from-emerald-500 to-teal-500",
    text: "Le pipeline IA détecte des signaux que nous aurions manqués. La conformité RGPD et l'hébergement français étaient des critères non-négociables. AiLex coche toutes les cases.",
    stars: 5,
  },
  {
    name: "Antoine Moreau",
    role: "Juriste d'entreprise",
    company: "Safran Group",
    avatar: "AM",
    color: "from-orange-500 to-amber-500",
    text: "L'intégration avec nos outils existants s'est faite en moins d'une heure. Le ROI est immédiat : moins de temps sur la veille, plus de temps sur le conseil à valeur ajoutée.",
    stars: 5,
  },
  {
    name: "Clara Fontaine",
    role: "Avocate associée",
    company: "Fontaine Legal",
    avatar: "CF",
    color: "from-rose-500 to-red-500",
    text: "Les alertes en temps réel sur les nouvelles jurisprudences nous permettent de conseiller nos clients proactivement. C'est exactement ce dont nous avions besoin.",
    stars: 5,
  },
  {
    name: "Lucas Petit",
    role: "Responsable conformité",
    company: "Société Générale",
    avatar: "LP",
    color: "from-blue-500 to-indigo-500",
    text: "Gestion de 200+ sources en quelques clics. L'analyse automatique par Claude est d'une qualité comparable à ce que ferait un analyste senior. Bluffant.",
    stars: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-sm mb-4">
            Témoignages
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Des milliers de juristes
            <br />
            <span className="gradient-text">nous font confiance</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Découvrez comment AiLex transforme la pratique juridique au quotidien.
          </p>
        </motion.div>

        {/* Marquee-style two-row grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card p-6 border-white/10 hover:-translate-y-1 hover:border-white/20 transition-all duration-200"
            >
              <Stars count={t.stars} />
              <p className="text-slate-300 text-sm leading-relaxed mt-3 mb-5">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 text-center"
        >
          {[
            { value: "2 400+", label: "Utilisateurs actifs" },
            { value: "4.9/5", label: "Note moyenne" },
            { value: "1,2M+", label: "Articles analysés" },
          ].map(({ value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-slate-500 text-sm">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
