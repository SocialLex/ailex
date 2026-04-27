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
    default: "AiLex — Veille stratégique automatisée par l'IA",
    template: "%s | AiLex",
  },
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "AiLex — Veille stratégique automatisée par l'IA",
    description: "Automatisez votre veille juridique et réglementaire avec l'IA",
    type: "website",
    locale: "fr_FR",
    siteName: "AiLex",
  },
  twitter: {
    card: "summary_large_image",
    title: "AiLex — Veille stratégique automatisée par l'IA",
    description: "Automatisez votre veille juridique et réglementaire avec l'IA",
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
