import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et traitement des données personnelles d'AiLex.",
}

export default function PrivacyPage() {
  const updated = "26 avril 2025"
  return (
    <article className="prose prose-invert prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-white mb-2">Politique de confidentialité</h1>
      <p className="text-slate-500 text-sm mb-10">Dernière mise à jour : {updated}</p>

      <Section title="1. Responsable du traitement">
        <p>AiLex (ci-après « nous ») est responsable du traitement de vos données personnelles. Pour toute question relative à vos données, contactez-nous à : <a href="mailto:privacy@ailex.fr" className="text-cyan-400 hover:text-cyan-300">privacy@ailex.fr</a></p>
      </Section>

      <Section title="2. Données collectées">
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li><strong>Données de compte :</strong> nom, adresse email, mot de passe (hashé)</li>
          <li><strong>Données d'utilisation :</strong> sources configurées, articles collectés, insights générés</li>
          <li><strong>Données de facturation :</strong> informations de paiement traitées par Stripe (nous ne stockons pas de numéro de carte)</li>
          <li><strong>Données techniques :</strong> adresse IP, logs d'accès, cookies de session</li>
        </ul>
      </Section>

      <Section title="3. Finalités et base légale">
        <table className="w-full text-sm mt-3">
          <thead><tr className="border-b border-white/10"><th className="text-left py-2 text-white">Finalité</th><th className="text-left py-2 text-white">Base légale</th></tr></thead>
          <tbody className="divide-y divide-white/5 text-slate-400">
            <tr><td className="py-2">Fourniture du service</td><td className="py-2">Exécution du contrat (Art. 6.1.b RGPD)</td></tr>
            <tr><td className="py-2">Facturation</td><td className="py-2">Obligation légale (Art. 6.1.c RGPD)</td></tr>
            <tr><td className="py-2">Amélioration du service</td><td className="py-2">Intérêt légitime (Art. 6.1.f RGPD)</td></tr>
            <tr><td className="py-2">Communications marketing</td><td className="py-2">Consentement (Art. 6.1.a RGPD)</td></tr>
          </tbody>
        </table>
      </Section>

      <Section title="4. Conservation des données">
        <p>Vos données sont conservées pendant la durée de votre abonnement, puis 3 ans après la résiliation pour les obligations légales et comptables. Les données de logs sont supprimées après 12 mois.</p>
      </Section>

      <Section title="5. Hébergement et transferts">
        <p>Vos données sont hébergées en <strong className="text-white">France</strong> (région EU-West) via Supabase. Aucun transfert de données hors de l'Union Européenne n'est effectué sans garanties appropriées.</p>
        <p>Sous-traitants :</p>
        <ul>
          <li><strong>Supabase</strong> — Base de données (EU)</li>
          <li><strong>Vercel</strong> — Infrastructure applicative (EU)</li>
          <li><strong>Stripe</strong> — Paiement (certifié PCI-DSS)</li>
          <li><strong>Resend</strong> — Envoi d'emails (EU)</li>
          <li><strong>Anthropic</strong> — Traitement IA des articles (USA, encadré par DPA)</li>
        </ul>
      </Section>

      <Section title="6. Vos droits (RGPD)" id="rgpd">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Accès</strong> — Obtenir une copie de vos données</li>
          <li><strong>Rectification</strong> — Corriger des données inexactes</li>
          <li><strong>Effacement</strong> — Demander la suppression de vos données</li>
          <li><strong>Portabilité</strong> — Recevoir vos données dans un format lisible</li>
          <li><strong>Opposition</strong> — Vous opposer au traitement fondé sur l'intérêt légitime</li>
          <li><strong>Limitation</strong> — Limiter le traitement de vos données</li>
        </ul>
        <p>Pour exercer vos droits : <a href="mailto:privacy@ailex.fr" className="text-cyan-400">privacy@ailex.fr</a>. En cas de litige, vous pouvez saisir la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-cyan-400">CNIL</a>.</p>
      </Section>

      <Section title="7. Cookies" id="cookies">
        <p>Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du service (session d'authentification). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.</p>
      </Section>

      <Section title="8. Contact">
        <p>Délégué à la Protection des Données : <a href="mailto:privacy@ailex.fr" className="text-cyan-400">privacy@ailex.fr</a></p>
      </Section>
    </article>
  )
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-semibold text-white mb-4 pb-2 border-b border-white/10">{title}</h2>
      <div className="text-slate-400 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}
