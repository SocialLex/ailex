import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LayoutDashboard, Users, ScrollText, ArrowLeft } from "lucide-react"

const adminNav = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/logs", label: "Logs", icon: ScrollText },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <aside className="w-56 flex flex-col border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-5 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <Link href="/dashboard"><Logo size={24} /></Link>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mt-1.5 block">Admin Panel</span>
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t border-slate-200 dark:border-white/10 pt-3">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
            <ArrowLeft size={13} />
            Retour au dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
