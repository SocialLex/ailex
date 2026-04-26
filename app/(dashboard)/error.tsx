"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-5 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white mb-2">Une erreur est survenue</h2>
        <p className="text-slate-400 text-sm max-w-sm">
          Quelque chose s'est mal passé. Réessayez ou contactez le support si le problème persiste.
        </p>
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Réessayer
      </Button>
    </div>
  )
}
