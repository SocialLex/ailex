import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getStripeServer, PLANS } from "@/lib/stripe/client"
import { z } from "zod"

const schema = z.object({
  plan: z.enum(["pro", "enterprise"]),
})

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Plan invalide" }, { status: 400 })

  const plan = PLANS[parsed.data.plan]

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  const session = await getStripeServer().checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: plan.priceId, quantity: 1 }],
    customer: subscription?.stripe_customer_id ?? undefined,
    customer_email: subscription?.stripe_customer_id ? undefined : user.email ?? undefined,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=billing&success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=billing&canceled=1`,
    metadata: { user_id: user.id, plan: parsed.data.plan },
    locale: "fr",
  })

  return NextResponse.json({ url: session.url })
}
