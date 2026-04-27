import type { PresentSlide, PresentationData } from "./types"

function stripEmoji(s: string) {
  return s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "").trim()
}

function extractKeyPoints(el: Element): string[] {
  const items = Array.from(el.querySelectorAll("li"))
    .map((li) => li.textContent?.trim() ?? "")
    .filter(Boolean)
    .slice(0, 5)
  if (items.length > 0) return items

  const text = el.textContent ?? ""
  return text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 4)
}

export function parseHtmlToSlides(html: string, title: string): PresentSlide[] {
  if (typeof window === "undefined") return []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const slides: PresentSlide[] = []

  // Cover
  const h1 = doc.querySelector("h1")
  slides.push({
    id: crypto.randomUUID(),
    index: 0,
    title: stripEmoji(h1?.textContent ?? title),
    keyPoints: [
      new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ],
    type: "cover",
  })

  // Content slides: one per <h2>
  const h2s = Array.from(doc.querySelectorAll("h2"))
  h2s.forEach((h2) => {
    const slideTitle = stripEmoji(h2.textContent ?? "")
    if (!slideTitle) return
    const wrap = doc.createElement("div")
    let node = h2.nextElementSibling
    while (node && node.tagName !== "H2") {
      wrap.appendChild(node.cloneNode(true))
      node = node.nextElementSibling
    }
    slides.push({
      id: crypto.randomUUID(),
      index: slides.length,
      title: slideTitle,
      keyPoints: extractKeyPoints(wrap),
      type: "content",
    })
  })

  // Fallback: paragraphs when no h2 found
  if (h2s.length === 0) {
    Array.from(doc.querySelectorAll("p"))
      .filter((p) => (p.textContent?.length ?? 0) > 60)
      .slice(0, 8)
      .forEach((p, i) => {
        slides.push({
          id: crypto.randomUUID(),
          index: slides.length,
          title: `Point ${i + 1}`,
          keyPoints: [p.textContent?.trim() ?? ""],
          type: "content",
        })
      })
  }

  // Closing
  slides.push({
    id: crypto.randomUUID(),
    index: slides.length,
    title: "Questions ?",
    keyPoints: ["Merci de votre attention", "Veille réalisée avec AiLex"],
    type: "closing",
  })

  return slides
}

export function buildPresentation(title: string, html: string): PresentationData {
  return {
    id: crypto.randomUUID(),
    title,
    slides: parseHtmlToSlides(html, title),
    createdAt: new Date().toISOString(),
  }
}
