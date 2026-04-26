import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface AIAnalysisResult {
  summary: string
  keyInsights: string[]
  risks: string[]
  opportunities: string[]
  keywords: string[]
  category: string
  relevanceScore: number
}

export async function analyzeArticle(
  title: string,
  content: string
): Promise<AIAnalysisResult> {
  const truncated = content.slice(0, 4000)

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Tu es un expert en veille juridique et stratégique. Analyse cet article et réponds UNIQUEMENT en JSON valide.

ARTICLE :
Titre : ${title}
Contenu : ${truncated}

Réponds avec ce JSON exact (sans markdown, sans texte avant/après) :
{
  "summary": "Résumé en 2-3 phrases en français",
  "keyInsights": ["insight 1", "insight 2", "insight 3"],
  "risks": ["risque 1", "risque 2"],
  "opportunities": ["opportunité 1", "opportunité 2"],
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
  "category": "une catégorie parmi: Législation, Jurisprudence, Réglementation, RH, Fiscal, Social, RGPD, International, Autre",
  "relevanceScore": 0.8
}`,
      },
    ],
  })

  const raw = (message.content[0] as { text: string }).text.trim()

  try {
    return JSON.parse(raw) as AIAnalysisResult
  } catch {
    // Fallback si le JSON est malformé
    return {
      summary: raw.slice(0, 300),
      keyInsights: [],
      risks: [],
      opportunities: [],
      keywords: [],
      category: "Autre",
      relevanceScore: 0.5,
    }
  }
}

export async function generateInsightDigest(
  articles: Array<{ title: string; summary: string | null; url: string }>
): Promise<{ title: string; content: string; type: "summary" | "trends" | "risks" | "opportunities" }[]> {
  if (articles.length === 0) return []

  const articleList = articles
    .slice(0, 20)
    .map((a, i) => `${i + 1}. ${a.title}\n   ${a.summary ?? ""}`)
    .join("\n\n")

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Tu es un expert en veille stratégique pour professionnels juridiques. À partir de ces articles récents, génère 3 insights structurés en JSON.

ARTICLES :
${articleList}

Réponds UNIQUEMENT avec ce JSON (sans markdown) :
[
  {
    "title": "Titre de l'insight résumé",
    "content": "Analyse détaillée en 3-4 phrases",
    "type": "summary"
  },
  {
    "title": "Titre des tendances identifiées",
    "content": "Analyse des tendances en 3-4 phrases",
    "type": "trends"
  },
  {
    "title": "Titre des risques et opportunités",
    "content": "Analyse risques/opportunités en 3-4 phrases",
    "type": "opportunities"
  }
]`,
      },
    ],
  })

  const raw = (message.content[0] as { text: string }).text.trim()
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function generateNewsletterContent(
  insights: Array<{ title: string; content: string; type: string }>,
  recipientName: string = "Cher(e) abonné(e)"
): Promise<string> {
  const insightText = insights
    .map((i) => `[${i.type.toUpperCase()}] ${i.title}\n${i.content}`)
    .join("\n\n---\n\n")

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Tu es rédacteur d'une newsletter de veille juridique professionnelle. Rédige une newsletter en HTML à partir de ces insights.

DESTINATAIRE : ${recipientName}

INSIGHTS :
${insightText}

Génère un HTML complet avec :
- En-tête avec date du jour
- Introduction personnalisée
- Sections pour chaque insight avec mise en forme
- Conclusion avec appel à l'action
- Style professionnel (police sans-serif, couleurs sobres #1e3a8a et #06b6d4)
Ne réponds qu'avec le HTML, sans explication.`,
      },
    ],
  })

  return (message.content[0] as { text: string }).text
}
