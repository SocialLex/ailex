import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation",
  description: "Conditions générales d'utilisation de la plateforme AiLex.",
}

export default function TermsPage() {
  const updated = "26 avril 2025"
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-white mb-2">Conditions générales d'utilisation</h1>
      <p className="text-slate-500 text-sm mb-10">Dernière mise à jour : {updated}</p>

      <Section title="1. Objet">
        <p>Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme AiLex, service de veille stratégique automatisée par intelligence artificielle, éditée par AiLex SAS.</p>
      </Section>

      <Section title="2. Accès au service">
        <p>L'accès à AiLex est réservé aux personnes physiques majeures et aux personnes morales. Vous êtes responsable de la confidentialité de vos identifiants de connexion.</p>
        <p>Nous nous réservons le droit de suspendre ou résilier votre accès en cas de violation des présentes CGU.</p>
      </Section>

      <Section title="3. Description du service">
        <p>AiLex est une plateforme SaaS qui permet :</p>
        <ul>
          <li>La collecte automatisée d'informations depuis des sources publiques (flux RSS, sites web)</li>
          <li>L'analyse et la synthèse de ces informations par intelligence artificielle</li>
          <li>La création et l'envoi de newsletters personnalisées</li>
          <li>La gestion d'une veille stratégique multi-sources</li>
        </ul>
      </Section>

      <Section title="4. Plans et facturation">
        <p>AiLex propose trois plans :</p>
        <ul>
          <li><strong className="text-white">Starter</strong> — Gratuit, limité à 5 sources et 50 analyses/mois</li>
          <li><strong className="text-white">Pro</strong> — 49€ HT/mois, sources illimitées, analyses illimitées</li>
          <li><strong className="text-white">Enterprise</strong> — 199€ HT/mois, multi-utilisateurs, API dédiée, SLA 99,9%</li>
        </ul>
        <p>Les prix s'entendent hors taxes. La TVA applicable est celle en vigueur au moment de la facturation. Les abonnements sont renouvelés automatiquement. Vous pouvez résilier à tout moment depuis vos paramètres.</p>
      </Section>

      <Section title="5. Propriété intellectuelle">
        <p>La plateforme AiLex, son code source, ses interfaces et ses bases de données sont protégés par le droit de la propriété intellectuelle. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
        <p>Les contenus que vous importez (articles, sources) restent votre propriété. Vous nous accordez une licence limitée pour les traiter dans le cadre du service.</p>
      </Section>

      <Section title="6. Responsabilité">
        <p>AiLex est un outil d'aide à la décision. Les analyses produites par notre IA ne constituent pas des conseils juridiques et ne sauraient remplacer l'avis d'un professionnel qualifié.</p>
        <p>Notre responsabilité est limitée au montant des sommes versées au cours des 12 derniers mois. Nous ne sommes pas responsables des dommages indirects, pertes de données ou interruptions de service indépendantes de notre volonté.</p>
      </Section>

      <Section title="7. Données personnelles">
        <p>Le traitement de vos données personnelles est encadré par notre <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">Politique de confidentialité</a>, conforme au RGPD.</p>
      </Section>

      <Section title="8. Disponibilité du service">
        <p>Nous nous efforçons d'assurer une disponibilité maximale du service (objectif 99,5% hors maintenance planifiée). Le plan Enterprise bénéficie d'un SLA contractuel de 99,9%.</p>
      </Section>

      <Section title="9. Résiliation">
        <p>Vous pouvez résilier votre abonnement à tout moment depuis <strong className="text-white">Paramètres → Facturation</strong>. La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata n'est effectué.</p>
      </Section>

      <Section title="10. Droit applicable">
        <p>Les présentes CGU sont soumises au droit français. Tout litige relève de la compétence exclusive des tribunaux de Paris.</p>
      </Section>

      <Section title="11. Contact">
        <p>Pour toute question : <a href="mailto:support@ailex.fr" className="text-cyan-400">support@ailex.fr</a></p>
      </Section>
    </article>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">{title}</h2>
      <div className="text-slate-400 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
