import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Animated cyber grid background */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridPulse 4s ease-in-out infinite",
        }}
      />

      {/* Radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)",
          animation: "breathe 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(6,182,212,0.6)" : "rgba(59,130,246,0.5)",
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 13) % 90}%`,
            animation: `float ${3 + (i % 3)}s ease-in-out ${(i * 0.4)}s infinite alternate`,
            boxShadow: i % 2 === 0 ? "0 0 6px rgba(6,182,212,0.8)" : "0 0 6px rgba(59,130,246,0.8)",
          }}
        />
      ))}

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "640px", width: "100%" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "inline-flex", justifyContent: "center", marginBottom: "2rem" }}>
          <Logo size={36} />
        </Link>

        {/* Animated illustration area */}
        <div
          style={{
            height: "280px",
            backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            animation: "floatUp 4s ease-in-out infinite",
            position: "relative",
          }}
          aria-hidden="true"
        >
          {/* 404 overlaid on the GIF area */}
          <h1
            style={{
              position: "absolute",
              top: "1.5rem",
              left: 0,
              right: 0,
              fontSize: "clamp(5rem, 15vw, 8rem)",
              fontWeight: 900,
              lineHeight: 1,
              background: "linear-gradient(135deg, #22d3ee 0%, #38bdf8 50%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "glitch 3s steps(1) infinite",
              letterSpacing: "-0.02em",
            }}
          >
            404
          </h1>
        </div>

        {/* Content card */}
        <div
          style={{
            marginTop: "-2rem",
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "1.5rem",
            padding: "2rem 2.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: "0.75rem",
            }}
          >
            Vous vous êtes perdu ?
          </h2>
          <p
            style={{
              color: "#94a3b8",
              marginBottom: "1.75rem",
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            Cette page n'existe pas ou a été déplacée vers une autre dimension juridique.
          </p>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Button asChild size="lg">
              <Link href="/">Retour à l'accueil</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">Mon dashboard</Link>
            </Button>
          </div>
        </div>

        {/* Subtle status line */}
        <p style={{ marginTop: "1.5rem", color: "#475569", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          AiLex · Erreur 404 · Page non trouvée
        </p>
      </div>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-12px); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes glitch {
          0%, 90%, 100% {
            text-shadow: none;
          }
          92% {
            text-shadow: -3px 0 rgba(6,182,212,0.8), 3px 0 rgba(139,92,246,0.8);
            transform: translateX(-2px);
          }
          94% {
            text-shadow: 3px 0 rgba(6,182,212,0.8), -3px 0 rgba(139,92,246,0.8);
            transform: translateX(2px);
          }
          96% {
            text-shadow: none;
            transform: translateX(0);
          }
          98% {
            text-shadow: -2px 0 rgba(6,182,212,0.6);
            transform: skewX(-2deg);
          }
        }
      `}</style>
    </main>
  )
}
