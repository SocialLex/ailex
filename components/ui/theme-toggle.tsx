"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className={`w-9 h-9 ${className}`} />

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer
        text-slate-500 hover:text-slate-900 hover:bg-slate-100
        dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10
        ${className}`}
      aria-label={isDark ? "Passer en mode jour" : "Passer en mode nuit"}
      title={isDark ? "Mode jour" : "Mode nuit"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  )
}
