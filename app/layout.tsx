import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
}

export const metadata: Metadata = {
  title: {
    default: "La Veilleuse — Veille juridique automatisée par l'IA",
    template: "%s | La Veilleuse",
  },
  description:
    "Éclairez votre droit. La Veilleuse agrège et analyse automatiquement Légifrance, le Sénat et la Cour de Cassation. Newsletters juridiques professionnelles en un clic.",
  keywords: [
    "veille juridique",
    "légifrance",
    "jurisprudence",
    "newsletter juridique",
    "analyse réglementaire",
    "droit français",
    "intelligence artificielle",
    "cour de cassation",
  ],
  authors: [{ name: "La Veilleuse" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "La Veilleuse — Veille juridique automatisée par l'IA",
    description: "Éclairez votre droit. Légifrance, Sénat, Cour de Cassation analysés par IA.",
    type: "website",
    locale: "fr_FR",
    siteName: "La Veilleuse",
  },
  twitter: {
    card: "summary_large_image",
    title: "La Veilleuse — Veille juridique automatisée par l'IA",
    description: "Éclairez votre droit. Légifrance, Sénat, Cour de Cassation analysés par IA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
