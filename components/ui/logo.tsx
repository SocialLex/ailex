interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className = "", size = 32, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hexagone de fond */}
        <path
          d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
          fill="url(#hex-gradient)"
          opacity="0.15"
        />
        <path
          d="M16 2L28 9V23L16 30L4 23V9L16 2Z"
          stroke="url(#border-gradient)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Lettre A stylisée */}
        <path
          d="M10 22L16 10L22 22"
          stroke="url(#a-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 18H20"
          stroke="url(#a-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Point cyan accent */}
        <circle cx="24" cy="8" r="2.5" fill="url(#dot-gradient)" />

        <defs>
          <linearGradient id="hex-gradient" x1="4" y1="2" x2="28" y2="30">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="border-gradient" x1="4" y1="2" x2="28" y2="30">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="a-gradient" x1="10" y1="10" x2="22" y2="22">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <radialGradient id="dot-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </radialGradient>
        </defs>
      </svg>
      {showText && (
        <span
          className="font-bold tracking-tight"
          style={{ fontSize: size * 0.75, letterSpacing: "-0.02em" }}
        >
          <span className="text-white">Ai</span>
          <span className="text-cyan-400">Lex</span>
        </span>
      )}
    </div>
  )
}
