import Link from "next/link"
import { ExternalLink, Rss, Search, CheckCircle, BookOpen, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const sources = [
  { name: "Légifrance", url: "https://www.legifrance.gouv.fr", rss: "https://www.legifrance.gouv.fr/rss.xml", desc: "Textes officiels, lois, décrets, JO" },
  { name: "EUR-Lex", url: "https://eur-lex.europa.eu", rss: "https://eur-lex.europa.eu/rss/rss.xml", desc: "Droit de l'Union européenne" },
  { name: "DALLOZ Actualité", url: "https://www.dalloz-actualite.fr", rss: "https://www.dalloz-actualite.fr/rss.xml", desc: "Actualité juridique et doctrine" },
  { name: "Le Monde — Droit", url: "https://www.lemonde.fr/droit", rss: "https://www.lemonde.fr/droit/rss_full.xml", desc: "Actualités juridiques grand public" },
  { name: "Conseil constitutionnel", url: "https://www.conseil-constitutionnel.fr", rss: "https://www.conseil-constitutionnel.fr/decision/rss.xml", desc: "Décisions QPC et DC" },
  { name: "Cour de cassation", url: "https://www.courdecassation.fr", rss: "https://www.courdecassation.fr/flux-rss/flux-rss-des-decisions-de-la-cour-de-cassation.xml", desc: "Jurisprudences de la Cour de cassation" },
]

const steps = [
  { icon: Search, title: "Chercher le flux sur le site", desc: 'Cherchez une icône RSS (🔶) ou un lien "Flux RSS", "Feed", "Atom" en bas de page ou dans le header.' },
  { icon: Globe, title: "Tester les URLs standard", desc: 'La plupart des sites proposent un flux à /rss.xml, /feed, /rss ou /atom.xml. Essayez ces variantes directement dans votre navigateur.' },
  { icon: CheckCircle, title: "Valider le flux", desc: 'Collez l\'URL dans un validateur comme validator.w3.org/feed pour vérifier que le flux est valide avant de l\'ajouter à AiLex.' },
  { icon: Zap, title: "Ajouter dans AiLex", desc: 'Une fois l\'URL confirmée, allez dans "Sources", cliquez "Ajouter une source" et collez l\'URL. AiLex collectera automatiquement les articles.' },
]

export default function SupportPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Centre d'aide</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Tout ce qu'il faut savoir pour configurer et utiliser AiLex efficacement.</p>
      </div>

      {/* Qu'est-ce qu'un flux RSS */}
      <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
            <Rss size={18} className="text-orange-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Qu'est-ce qu'un flux RSS ?</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          Un <strong>flux RSS</strong> (Really Simple Syndication) est un format standardisé qui permet à un site web de publier automatiquement ses nouveaux contenus. Au lieu de visiter chaque site manuellement, AiLex interroge ces flux régulièrement pour récupérer les dernières publications juridiques.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Chaque article, loi, décision ou actualité publiée sur un site compatible est automatiquement transmise à votre espace AiLex, analysée par l'IA, et intégrée à votre veille.
        </p>
      </section>

      {/* Comment trouver un flux RSS */}
      <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center">
            <BookOpen size={18} className="text-cyan-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Comment trouver le flux RSS d'un site juridique ?</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="flex gap-3 p-4 bg-slate-50 dark:bg-white/3 rounded-xl border border-slate-100 dark:border-white/5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={14} className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    <span className="text-cyan-500 mr-1.5">{i + 1}.</span>{step.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <strong>Astuce :</strong> L'extension de navigateur <strong>RSS Finder</strong> (Chrome/Firefox) détecte automatiquement les flux RSS disponibles sur la page que vous visitez.
          </p>
        </div>
      </section>

      {/* Sources pré-configurées */}
      <section className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Globe size={18} className="text-blue-500" />
            </div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Sources juridiques recommandées</h2>
          </div>
          <Button asChild size="sm">
            <Link href="/sources">Gérer mes sources</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                {["Source", "Description", "URL du flux", ""].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-xs font-medium text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {sources.map(s => (
                <tr key={s.name} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                  <td className="px-3 py-3 font-medium text-slate-900 dark:text-white text-sm whitespace-nowrap">{s.name}</td>
                  <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-400">{s.desc}</td>
                  <td className="px-3 py-3">
                    <code className="text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-0.5 rounded font-mono">{s.rss}</code>
                  </td>
                  <td className="px-3 py-3">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Espace Génération */}
      <section className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Zap size={18} className="text-cyan-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Espace Génération — Comment ça marche ?</h2>
        </div>
        <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-300 ml-2">
          <li><span className="text-cyan-500 font-semibold">1.</span> Allez dans <strong>Articles</strong> et sélectionnez les articles qui vous intéressent.</li>
          <li><span className="text-cyan-500 font-semibold">2.</span> Cliquez <strong>"Pousser vers Génération"</strong> pour les envoyer dans l'espace Génération.</li>
          <li><span className="text-cyan-500 font-semibold">3.</span> Dans <strong>Génération</strong>, uploadez votre template (.txt) ou utilisez le template par défaut.</li>
          <li><span className="text-cyan-500 font-semibold">4.</span> Ajoutez des instructions spécifiques (optionnel) et cliquez <strong>"Générer la veille"</strong>.</li>
          <li><span className="text-cyan-500 font-semibold">5.</span> L'IA analyse les articles et remplit votre template. Téléchargez le résultat.</li>
        </ol>
        <div className="mt-4 flex gap-2">
          <Button asChild size="sm"><Link href="/articles">Parcourir les articles</Link></Button>
          <Button asChild variant="outline" size="sm"><Link href="/generation">Espace Génération</Link></Button>
        </div>
      </section>
    </div>
  )
}
