"use client"

import { useEffect } from "react"

export default function GlobalError({
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
    <html lang="fr">
      <body style={{ background: "#020617", color: "#f8fafc", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>Erreur critique</h1>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>Une erreur inattendue s'est produite.</p>
          <button
            onClick={reset}
            style={{ background: "#06b6d4", color: "#020617", padding: "10px 20px", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer" }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
