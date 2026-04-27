"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DropdownOption {
  value: string
  label: string
}

interface FluidDropdownProps {
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
}

export function FluidDropdown({
  options,
  value,
  onChange,
  className,
  placeholder = "Sélectionner…",
  disabled = false,
}: FluidDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hovered, setHovered] = React.useState<string | null>(null)
  const ref = React.useRef<HTMLDivElement>(null)
  const uid = React.useId()

  React.useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    document.addEventListener("touchstart", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
      document.removeEventListener("touchstart", handler)
    }
  }, [])

  const selected = options.find(o => o.value === value)
  const activeIndex = options.findIndex(o => o.value === (hovered ?? value))

  return (
    <div ref={ref} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(v => !v)}
        className={cn(
          "w-full flex items-center justify-between h-9 px-3 rounded-lg text-sm font-normal",
          "border transition-all duration-200 cursor-pointer",
          "bg-white/5 border-white/10 text-white",
          "hover:bg-white/10 hover:border-white/20",
          "focus:outline-none focus:ring-1 focus:ring-cyan-500",
          isOpen && "ring-1 ring-cyan-500 border-cyan-500/30 bg-white/10",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={selected ? "text-white" : "text-slate-500"}>
          {selected?.label ?? placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown size={14} className="text-slate-400" />
        </motion.div>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: { type: "spring", stiffness: 500, damping: 32, mass: 0.8 },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: { type: "spring", stiffness: 500, damping: 32, mass: 0.8 },
            }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden"
          >
            <div className="rounded-xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40 p-1">
              <div className="relative py-1" role="listbox">
                {/* Sliding highlight */}
                {activeIndex >= 0 && (
                  <motion.div
                    className="absolute inset-x-1 h-8 rounded-md bg-white/10 pointer-events-none"
                    animate={{ y: activeIndex * 32 + 0 }}
                    transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                  />
                )}

                {options.map((option, i) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => { onChange(option.value); setIsOpen(false) }}
                    onHoverStart={() => setHovered(option.value)}
                    onHoverEnd={() => setHovered(null)}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.2 } }}
                    className={cn(
                      "relative flex w-full items-center justify-between px-3 h-8 text-sm rounded-md",
                      "cursor-pointer focus:outline-none transition-colors duration-100",
                      option.value === value || hovered === option.value
                        ? "text-white"
                        : "text-slate-400",
                    )}
                  >
                    {option.label}
                    {option.value === value && (
                      <Check size={13} className="text-cyan-400 flex-shrink-0" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
