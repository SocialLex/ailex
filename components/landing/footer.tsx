import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Twitter, Linkedin, Github } from "@/components/ui/social-icons"

const links = {
  Produit: [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Feuille de route", href: "/roadmap" },
  ],
  Ressources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Guides", href: "/guides" },
    { label: "API", href: "/docs/api" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Partenaires", href: "/partners" },
    { label: "Presse", href: "/press" },
  ],
  Légal: [
    { label: "Politique de confidentialité", href: "/privacy" },
    { label: "Conditions d'utilisation", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
    { label: "RGPD", href: "/gdpr" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={28} className="mb-4" />
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Automatisez votre veille stratégique avec l'intelligence artificielle.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white hover:border-cyan-500/40 transition-all cursor-pointer"
                >
                  <Icon size={16} />
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
