import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"

// Lazy server-side Stripe instance — avoids build-time crash when env vars are absent
let _stripe: Stripe | null = null
export function getStripeServer(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured")
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia" })
  }
  return _stripe
}

let stripePromise: ReturnType<typeof loadStripe>
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

export const PLANS = {
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    price: 0,
    features: ["5 sources", "Newsletter hebdomadaire", "50 analyses/mois"],
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    price: 4900,
    features: ["Sources illimitées", "Newsletter quotidienne", "Analyses illimitées"],
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    price: 19900,
    features: ["Tout Pro", "Multi-utilisateurs", "API dédiée", "SLA 99.9%"],
  },
}
