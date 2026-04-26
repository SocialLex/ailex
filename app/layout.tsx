import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AiLex — Veille stratégique automatisée par l'IA",
  description:
    "Automatisez votre veille juridique et réglementaire avec l'intelligence artificielle. Collecte, analyse et distribution de newsletters en temps réel.",
  keywords: [
    "veille juridique",
    "intelligence artificielle",
    "veille stratégique",
    "newsletter automatisée",
    "analyse réglementaire",
    "IA juridique",
  ],
  authors: [{ name: "AiLex" }],
  openGraph: {
    title: "AiLex — Veille stratégique automatisée par l'IA",
    description: "Automatisez votre veille juridique et réglementaire avec l'IA",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiLex — Veille stratégique automatisée par l'IA",
    description: "Automatisez votre veille juridique et réglementaire avec l'IA",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${plusJakartaSans.variable} font-sans bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
