import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Concept } from "@/components/landing/concept"
import { CtaBanner } from "@/components/landing/cta-banner"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="bg-slate-950 min-h-screen scroll-smooth">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Concept />
      <CtaBanner />
      <Footer />
    </main>
  )
}
