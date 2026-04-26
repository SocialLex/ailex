"use client"

import { Bell, Search } from "lucide-react"
import type { User as Profile } from "@/types"

interface Props {
  profile: Profile | null
}

export function DashboardTopbar({ profile }: Props) {
  return (
    <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between flex-shrink-0 bg-slate-950/50 backdrop-blur-sm">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          placeholder="Rechercher des articles, insights…"
          className="w-full h-9 pl-9 pr-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="relative w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>
      </div>
    </header>
  )
}
