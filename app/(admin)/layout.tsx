import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const adminNav = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/users", label: "Utilisateurs" },
  { href: "/admin/logs", label: "Logs" },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") redirect("/dashboard")

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <aside className="w-56 flex flex-col border-r border-white/10 bg-slate-950/80 backdrop-blur-sm flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/dashboard"><Logo size={24} /></Link>
          <span className="text-xs text-cyan-400 font-medium mt-2 block">Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            ← Retour au dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
