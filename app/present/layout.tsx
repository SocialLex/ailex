import type { Metadata } from "next"

export const metadata: Metadata = { title: "AiLex — Présentation" }

export default function PresentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Inter:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      {children}
    </>
  )
}
