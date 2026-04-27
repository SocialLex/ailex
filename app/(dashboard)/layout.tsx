import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { AlertTriangle } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single()

  const isRevoked = subscription?.status === "canceled"
  const isExpired = subscription?.current_period_end
    ? new Date(subscription.current_period_end) < new Date()
    : false
  const isBlocked = isRevoked || isExpired

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <DashboardSidebar
        profile={profile}
        subscription={subscription}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar profile={profile} />
        {isBlocked && (
          <div className="flex items-center gap-3 px-6 py-2.5 bg-red-500/10 border-b border-red-500/20 text-red-600 dark:text-red-400 text-sm flex-shrink-0">
            <AlertTriangle size={15} className="flex-shrink-0" />
            <span>
              {isRevoked
                ? "Votre accès a été révoqué par l'administrateur."
                : "Votre accès a expiré."}
              {" "}
              <a href="/settings?tab=billing" className="underline font-medium hover:text-red-500 transition-colors">
                Gérer votre abonnement →
              </a>
            </span>
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
