import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { articles, template, instructions } = await request.json()

  if (!articles?.length) return NextResponse.json({ error: "Aucun article sélectionné" }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey || apiKey === "your_anthropic_api_key") {
    return NextResponse.json({ error: "Clé API Anthropic non configurée. Ajoutez ANTHROPIC_API_KEY dans vos variables d'environnement Vercel." }, { status: 503 })
  }

  const anthropic = new Anthropic({ apiKey })

  // Formater les articles pour le prompt
  const articlesText = articles.map((a: any, i: number) => `
ARTICLE ${i + 1}
Titre: ${a.title}
Source: ${a.source}
Date: ${a.published_at ? new Date(a.published_at).toLocaleDateString("fr-FR") : "Non précisée"}
URL: ${a.url}
Résumé: ${a.summary ?? "Pas de résumé disponible"}
`).join("\n---\n")

  const defaultTemplate = `# Veille Juridique — [DATE]

## Faits marquants de la période

[SYNTHESE_GENERALE]

## Articles analysés

[ARTICLES_ANALYSES]

## Points d'attention

[POINTS_ATTENTION]

## Recommandations

[RECOMMANDATIONS]`

  const templateText = template?.trim() || defaultTemplate

  const prompt = `Tu es un expert en veille juridique et réglementaire. Tu dois rédiger une synthèse de veille juridique professionnelle en français, en remplissant le template fourni avec les articles sélectionnés.

TEMPLATE À REMPLIR:
${templateText}

ARTICLES SÉLECTIONNÉS (${articles.length}):
${articlesText}

${instructions ? `INSTRUCTIONS SPÉCIFIQUES:\n${instructions}\n` : ""}

CONSIGNES:
- Rédige en français, dans un style professionnel et juridique
- Remplace les zones entre crochets [XXX] par le contenu approprié
- Pour [DATE], utilise la date du jour : ${new Date().toLocaleDateString("fr-FR")}
- Synthétise et analyse les articles avec expertise juridique
- Identifie les enjeux, les risques et les opportunités
- Reste factuel et cite les sources quand pertinent
- Si le template contient des balises de formatage, conserve-les

Génère uniquement le contenu final du template rempli, sans commentaires ni introduction.`

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    })

    const content = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({
      success: true,
      content,
      usage: message.usage,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Erreur lors de la génération" }, { status: 500 })
  }
}
