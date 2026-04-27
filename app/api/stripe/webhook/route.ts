import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe/client"
import { createAdminClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = getStripeServer().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan as "pro" | "enterprise" | undefined

      if (userId && plan) {
        await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              status: "active",
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
            },
            { onConflict: "user_id" }
          )
      }
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const plan = (sub.metadata?.plan ?? "starter") as "starter" | "pro" | "enterprise"

      await supabase
        .from("subscriptions")
        .update({
          status: sub.status as "active" | "canceled" | "past_due",
          plan,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await supabase
        .from("subscriptions")
        .update({ status: "canceled", plan: "starter" })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice
      await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_customer_id", invoice.customer as string)
      break
    }
  }

  return NextResponse.json({ received: true })
}
