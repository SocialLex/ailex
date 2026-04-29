import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  // Rate limit: 30 résumés / 10 minutes
  const rl = checkRateLimit(`ai-free:${user.id}`, { limit: 30, windowSeconds: 600 })
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  const body = await request.json()
  const { text, prompt } = body

  if (!text && !prompt) {
    return NextResponse.json({ error: "Texte ou prompt requis" }, { status: 400 })
  }
  if (typeof text === "string" && text.length > 8000) {
    return NextResponse.json({ error: "Texte trop long (max 8000 caractères)" }, { status: 400 })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: "Service IA gratuit non configuré. Ajoutez GROQ_API_KEY dans vos variables d'environnement." },
      { status: 503 }
    )
  }

  const userMessage = prompt || `Tu es un assistant juridique expert en droit français. Résume ce texte juridique en 3 points clés, en français, de manière concise et professionnelle. Identifie le type de document (jurisprudence, loi, décret, etc.) et l'impact pratique pour les praticiens.\n\nTexte:\n${text}`

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant juridique expert en droit français. Tu réponds toujours en français, de manière concise, précise et professionnelle. Tu cites les références légales exactes quand elles sont disponibles.",
          },
          { role: "user", content: userMessage },
        ],
        max_tokens: 600,
        temperature: 0.2,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: err?.error?.message ?? "Erreur du service IA" },
        { status: 500 }
      )
    }

    const data = await response.json()
    const content: string = data.choices?.[0]?.message?.content ?? ""

    return NextResponse.json({ content, model: "llama3-8b-8192 (Groq)" })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de l'appel IA" },
      { status: 500 }
    )
  }
}
