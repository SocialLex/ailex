import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-white/10 py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/"><Logo size={24} /></Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">← Accueil</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-16">
        {children}
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} AiLex. Tous droits réservés.
      </footer>
    </div>
  )
}
