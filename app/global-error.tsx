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
      <head>
        <style>{`
          @keyframes gridPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          @keyframes breathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.2); }
          }
          @keyframes float {
            0% { transform: translateY(0px); opacity: 0.6; }
            100% { transform: translateY(-14px); opacity: 1; }
          }
          @keyframes glitch {
            0%, 88%, 100% { text-shadow: none; transform: none; }
            90% { text-shadow: -4px 0 rgba(6,182,212,0.9), 4px 0 rgba(139,92,246,0.9); transform: translateX(-3px); }
            92% { text-shadow: 4px 0 rgba(6,182,212,0.9), -4px 0 rgba(139,92,246,0.9); transform: translateX(3px) skewX(-2deg); }
            94% { text-shadow: -2px 0 rgba(6,182,212,0.6); transform: translateX(-1px); }
            96% { text-shadow: none; transform: none; }
          }
          @keyframes scanline {
            0% { top: -10%; }
            100% { top: 110%; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.8; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .btn-reset {
            background: linear-gradient(135deg, #06b6d4, #3b82f6);
            color: #020617;
            padding: 12px 32px;
            border: none;
            border-radius: 10px;
            font-weight: 700;
            font-size: 0.95rem;
            cursor: pointer;
            letter-spacing: 0.02em;
            transition: transform 0.15s, box-shadow 0.15s;
            box-shadow: 0 0 20px rgba(6,182,212,0.3);
          }
          .btn-reset:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 30px rgba(6,182,212,0.5);
          }
          .btn-home {
            background: rgba(255,255,255,0.05);
            color: #94a3b8;
            padding: 12px 32px;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.95rem;
            cursor: pointer;
            transition: background 0.15s, color 0.15s;
            text-decoration: none;
            display: inline-block;
          }
          .btn-home:hover {
            background: rgba(255,255,255,0.1);
            color: #f8fafc;
          }
        `}</style>
      </head>
      <body style={{
        background: "#020617",
        color: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        margin: 0,
        overflow: "hidden",
        position: "relative",
      }}>

        {/* Grille cyber animée */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridPulse 4s ease-in-out infinite",
        }} />

        {/* Halo central */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, rgba(6,182,212,0.04) 40%, transparent 70%)",
          animation: "breathe 5s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Scanline */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)",
          animation: "scanline 3s linear infinite",
          pointerEvents: "none",
        }} />

        {/* Particules flottantes */}
        {[
          { top: "15%", left: "10%", delay: "0s", color: "rgba(239,68,68,0.7)" },
          { top: "25%", left: "85%", delay: "0.5s", color: "rgba(6,182,212,0.6)" },
          { top: "70%", left: "8%",  delay: "1s",  color: "rgba(139,92,246,0.6)" },
          { top: "75%", left: "88%", delay: "1.5s", color: "rgba(6,182,212,0.5)" },
          { top: "45%", left: "92%", delay: "0.8s", color: "rgba(239,68,68,0.5)" },
          { top: "55%", left: "5%",  delay: "1.2s", color: "rgba(139,92,246,0.7)" },
        ].map((p, i) => (
          <div key={i} style={{
            position: "absolute", width: "4px", height: "4px", borderRadius: "50%",
            background: p.color, top: p.top, left: p.left,
            boxShadow: `0 0 8px ${p.color}`,
            animation: `float 2.5s ease-in-out ${p.delay} infinite alternate`,
          }} />
        ))}

        {/* Contenu principal */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "2rem", maxWidth: "520px", width: "100%", animation: "fadeUp 0.6s ease-out both" }}>

          {/* Anneau pulse autour du logo erreur */}
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <div style={{
              position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
              border: "2px solid rgba(239,68,68,0.5)",
              animation: "pulse-ring 2s ease-out infinite",
            }} />
            <div style={{
              position: "absolute", width: "80px", height: "80px", borderRadius: "50%",
              border: "2px solid rgba(239,68,68,0.3)",
              animation: "pulse-ring 2s ease-out 0.6s infinite",
            }} />
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
          </div>

          {/* Titre glitch */}
          <div style={{
            fontSize: "clamp(3.5rem, 12vw, 6rem)",
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "glitch 4s steps(1) infinite",
            letterSpacing: "-0.02em",
          }}>
            500
          </div>

          {/* Badge statut */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "999px", padding: "4px 12px", marginBottom: "1.5rem",
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "#f87171",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444", animation: "blink 1s ease-in-out infinite", display: "inline-block" }} />
            Erreur système critique
          </div>

          {/* Carte glassmorphism */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1.5rem",
            padding: "2rem",
            marginBottom: "1.5rem",
          }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.75rem", marginTop: 0 }}>
              Une erreur inattendue s'est produite
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem", marginTop: 0 }}>
              La Veilleuse a rencontré une erreur interne. Notre équipe a été notifiée automatiquement.
              Vous pouvez réessayer ou retourner à l'accueil.
            </p>

            {/* Code d'erreur technique */}
            {error?.digest && (
              <div style={{
                background: "rgba(0,0,0,0.3)", borderRadius: "8px",
                padding: "8px 12px", marginBottom: "1.25rem",
                fontFamily: "monospace", fontSize: "0.75rem", color: "#64748b",
              }}>
                <span style={{ color: "#475569" }}>digest: </span>
                <span style={{ color: "#94a3b8" }}>{error.digest}</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={reset} className="btn-reset">
                Réessayer
              </button>
              <a href="/" className="btn-home">
                Retour à l'accueil
              </a>
            </div>
          </div>

          {/* Ligne de statut */}
          <p style={{ color: "#334155", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
            La Veilleuse · Intelligence Juridique · Erreur interne
          </p>
        </div>
      </body>
    </html>
  )
}
