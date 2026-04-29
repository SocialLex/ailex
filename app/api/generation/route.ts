import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const rl = checkRateLimit(`generation:${user.id}`, { limit: 10, windowSeconds: 600 })
  if (!rl.allowed) return rateLimitResponse(rl.resetAt)

  const body = await request.json()
  const { articles, template, instructions } = body

  if (!Array.isArray(articles) || articles.length === 0)
    return NextResponse.json({ error: "Aucun article sélectionné" }, { status: 400 })
  if (articles.length > 50)
    return NextResponse.json({ error: "Maximum 50 articles par génération" }, { status: 400 })
  if (typeof instructions === "string" && instructions.length > 2000)
    return NextResponse.json({ error: "Instructions trop longues (max 2000 caractères)" }, { status: 400 })

  // Formater les articles
  const articlesText = articles.map((a: any, i: number) => `
${a.article_type === "jurisprudence" ? "JURISPRUDENCE" : a.article_type === "legislation" ? "TEXTE LÉGISLATIF" : a.article_type === "reglementation" ? "TEXTE RÉGLEMENTAIRE" : "ARTICLE"} ${i + 1}
Référence: ${a.title}
Source: ${a.source}
Date: ${a.published_at ? new Date(a.published_at).toLocaleDateString("fr-FR") : "Non précisée"}
URL: ${a.url}
Résumé: ${a.summary ?? "Pas de résumé disponible"}
`).join("\n---\n")

  const defaultTemplate = `# Veille Juridique — [DATE]

## Faits marquants de la période

[SYNTHESE_GENERALE]

## Jurisprudences & Textes analysés

[ARTICLES_ANALYSES]
Pour chaque jurisprudence : citation complète (juridiction, chambre, date, numéro de pourvoi si connu), portée de la décision, impact pratique.
Pour chaque texte : référence officielle, champ d'application, date d'entrée en vigueur.

## Points d'attention

[POINTS_ATTENTION]

## Recommandations pratiques

[RECOMMANDATIONS]`

  const templateText = template?.trim() || defaultTemplate

  const systemPrompt = `Tu es un expert en veille juridique et réglementaire française. Tu rédiges des synthèses de veille juridique professionnelles en français. Tu cites précisément les sources, juridictions et références légales.`

  const userPrompt = `Tu dois rédiger une synthèse de veille juridique professionnelle en remplissant le template ci-dessous avec les articles fournis.

TEMPLATE À REMPLIR:
${templateText}

ARTICLES SÉLECTIONNÉS (${articles.length}):
${articlesText}

${instructions ? `INSTRUCTIONS SPÉCIFIQUES:\n${instructions}\n` : ""}

CONSIGNES:
- Rédige en français, style professionnel et juridique
- Remplace les zones [XXX] par le contenu approprié
- Pour [DATE] : ${new Date().toLocaleDateString("fr-FR")}
- Pour les jurisprudences : cite juridiction, chambre, date (ex: "Cass. soc., 15 janv. 2026, n° 24-12.345")
- Pour les textes réglementaires : numéro officiel + date de publication au JO
- Identifie enjeux, risques et opportunités pour les praticiens du droit
- Reste factuel, cite toujours la source
- Génère uniquement le contenu final sans commentaires ni introduction`

  /* ── 1. Groq (gratuit — Llama 3.3 70B, 128k contexte) ── */
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${groqKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.3,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const content: string = data.choices?.[0]?.message?.content ?? ""
        if (content) {
          return NextResponse.json({ success: true, content, model: "Llama 3.3 70B (Groq)" })
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        // If rate limit on Groq, fall through to Anthropic
        if (res.status !== 429) {
          return NextResponse.json(
            { error: `Erreur Groq : ${errData?.error?.message ?? res.statusText}` },
            { status: 500 }
          )
        }
      }
    } catch {
      // Network error — fall through to Anthropic
    }
  }

  /* ── 2. Anthropic Claude (fallback payant) ──────────────── */
  const anthropicKey = process.env.ANTHROPIC_API_KEY
  if (anthropicKey && anthropicKey !== "your_anthropic_api_key") {
    try {
      const { default: Anthropic } = await import("@anthropic-ai/sdk")
      const anthropic = new Anthropic({ apiKey: anthropicKey })
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [{ role: "user", content: `${systemPrompt}\n\n${userPrompt}` }],
      })
      const content = message.content[0].type === "text" ? message.content[0].text : ""
      return NextResponse.json({ success: true, content, model: "Claude Haiku (Anthropic)" })
    } catch (err: any) {
      return NextResponse.json(
        { error: `Erreur Anthropic : ${err.message ?? "Erreur inconnue"}` },
        { status: 500 }
      )
    }
  }

  /* ── 3. Aucune clé configurée ───────────────────────────── */
  return NextResponse.json(
    {
      error:
        "Aucun service IA configuré. Ajoutez GROQ_API_KEY (gratuit sur groq.com) ou ANTHROPIC_API_KEY dans vos variables d'environnement Vercel.",
    },
    { status: 503 }
  )
}
