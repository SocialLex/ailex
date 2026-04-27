"use client"

import { MotionConfig } from "framer-motion"

export function Providers({ children }: { children: React.ReactNode }) {
  // reducedMotion="never" est SSR-safe (ne lit pas window.matchMedia)
  // "user" crashe le layout racine sur Vercel avec framer-motion v12
  return (
    <MotionConfig reducedMotion="never">
      {children}
    </MotionConfig>
  )
}
