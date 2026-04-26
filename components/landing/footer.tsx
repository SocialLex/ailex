import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Twitter, Linkedin, Github } from "@/components/ui/social-icons"

const links = {
  Produit: [
    { label: "Fonctionnalités", href: "/#features" },
    { label: "Tarifs", href: "/#pricing" },
    { label: "Comment ça marche", href: "/#how-it-works" },
  ],
  Légal: [
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "RGPD", href: "/privacy#rgpd" },
    { label: "Cookies", href: "/privacy#cookies" },
  ],
  Compte: [
    { label: "Se connecter", href: "/login" },
    { label: "S'inscrire", href: "/register" },
    { label: "Mot de passe oublié", href: "/forgot-password" },
  ],
}

const socials = [
  { Icon: Twitter, href: "https://twitter.com/ailexfr", label: "Twitter / X" },
  { Icon: Linkedin, href: "https://linkedin.com/company/ailex-fr", label: "LinkedIn" },
  { Icon: Github, href: "https://github.com/ailex-fr", label: "GitHub" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={28} className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Automatisez votre veille stratégique avec l'intelligence artificielle.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
                >
                  <Icon size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} AiLex. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Hébergé en</span>
            <span className="text-white font-medium">🇫🇷 France</span>
            <span>·</span>
            <span>Conforme</span>
            <span className="text-cyan-400 font-medium">RGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
