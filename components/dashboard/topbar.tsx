"use client"

import { Bell, Search } from "lucide-react"
import type { User as Profile } from "@/types"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface Props {
  profile: Profile | null
}

export function DashboardTopbar({ profile }: Props) {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-white/10 px-6 flex items-center justify-between flex-shrink-0 bg-white/80 dark:bg-slate-950/50 backdrop-blur-sm">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="search"
          placeholder="Rechercher des articles, insights…"
          className="w-full h-9 pl-9 pr-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button className="relative w-9 h-9 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
      </div>
    </header>
  )
}
