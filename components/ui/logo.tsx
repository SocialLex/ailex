interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export function Logo({ className = "", size = 32, showText = true }: LogoProps) {
  const s = size
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Handle arc */}
        <path d="M13 5 Q16 1.5 19 5" stroke="#22d3ee" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Top cap */}
        <rect x="9" y="5" width="14" height="2.5" rx="1.25" fill="url(#lv-cap)"/>

        {/* Lantern body */}
        <path d="M11 7.5 L9 11 L9 22.5 L11 26 L21 26 L23 22.5 L23 11 L21 7.5 Z"
          fill="url(#lv-body)" stroke="url(#lv-stroke)" strokeWidth="1"/>

        {/* Vertical frame bars */}
        <line x1="16" y1="7.5" x2="16" y2="26" stroke="#22d3ee" strokeWidth="0.75" strokeOpacity="0.35"/>
        <line x1="12.5" y1="7.5" x2="12.5" y2="26" stroke="#22d3ee" strokeWidth="0.6" strokeOpacity="0.2"/>
        <line x1="19.5" y1="7.5" x2="19.5" y2="26" stroke="#22d3ee" strokeWidth="0.6" strokeOpacity="0.2"/>

        {/* Mid belt */}
        <rect x="9" y="16" width="14" height="1" fill="#22d3ee" fillOpacity="0.3"/>

        {/* Inner warm glow — the veilleuse light */}
        <ellipse cx="16" cy="17" rx="3.5" ry="4.5" fill="url(#lv-flame)"/>

        {/* Bottom cap */}
        <rect x="9" y="26" width="14" height="2.5" rx="1.25" fill="url(#lv-cap)"/>

        {/* Bottom ornament */}
        <circle cx="16" cy="30" r="1.2" fill="#22d3ee" fillOpacity="0.4"/>

        <defs>
          <linearGradient id="lv-cap" x1="9" y1="0" x2="23" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4"/>
            <stop offset="100%" stopColor="#3b82f6"/>
          </linearGradient>
          <linearGradient id="lv-stroke" x1="9" y1="7" x2="23" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4"/>
          </linearGradient>
          <linearGradient id="lv-body" x1="9" y1="7" x2="23" y2="27" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="#1e40af" stopOpacity="0.08"/>
          </linearGradient>
          <radialGradient id="lv-flame" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#fcd34d"/>
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#d97706" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <span className="font-bold tracking-tight leading-none" style={{ fontSize: Math.round(s * 0.62) }}>
          <span className="text-slate-900 dark:text-white">La </span>
          <span className="text-cyan-500 dark:text-cyan-400">Veilleuse</span>
        </span>
      )}
    </div>
  )
}
