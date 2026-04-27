"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Rss, Sparkles, Mail, Settings,
  ChevronRight, Crown, LogOut, Newspaper, Wand2, HelpCircle,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as Profile, Subscription } from "@/types"

const navItems = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/sources",    icon: Rss,             label: "Sources" },
  { href: "/articles",   icon: Newspaper,       label: "Articles" },
  { href: "/generation", icon: Wand2,           label: "Génération" },
  { href: "/insights",   icon: Sparkles,        label: "Insights IA" },
  { href: "/newsletter", icon: Mail,            label: "Newsletters" },
  { href: "/settings",   icon: Settings,        label: "Paramètres" },
  { href: "/support",    icon: HelpCircle,      label: "Support" },
]

const planColors: Record<string, string> = {
  starter: "secondary", pro: "default", enterprise: "warning",
}

interface Props {
  profile: Profile | null
  subscription: Subscription | null
}

export function DashboardSidebar({ profile, subscription }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <aside className="w-64 flex flex-col border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
      <div className="px-5 py-5 border-b border-slate-200 dark:border-white/10">
        <Link href="/dashboard"><Logo size={26} /></Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                active
                  ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={17} className={active ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"} />
              {item.label}
              {active && <ChevronRight size={13} className="ml-auto text-cyan-500/50" />}
            </Link>
          )
        })}
      </nav>

      {subscription && (
        <div className="mx-3 mb-3 p-3 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Votre plan</span>
            <Badge variant={planColors[subscription.plan] as any}>
              <Crown size={10} className="mr-1" />
              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
            </Badge>
          </div>
          {subscription.plan === "starter" && (
            <Link href="/settings?tab=billing" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors">
              Passer au plan Pro →
            </Link>
          )}
        </div>
      )}

      <div className="px-3 pb-4 border-t border-slate-200 dark:border-white/10 pt-3">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profile?.full_name?.[0]?.toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{profile?.full_name ?? "Utilisateur"}</p>
            <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Se déconnecter">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
