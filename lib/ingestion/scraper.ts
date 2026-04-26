import axios from "axios"
import * as cheerio from "cheerio"
import crypto from "crypto"
import type { ParsedArticle } from "./rss-parser"

export async function scrapeUrl(url: string): Promise<ParsedArticle[]> {
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent": "AiLex/1.0 (veille-strategique)",
      Accept: "text/html",
    },
  })

  const $ = cheerio.load(html)

  // Remove scripts, styles, nav, footer
  $("script, style, nav, footer, header, aside, .ad, .advertisement").remove()

  // Try to extract main content
  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Article sans titre"

  const content =
    $("article").text().trim() ||
    $("main").text().trim() ||
    $("body").text().trim()

  const hash = crypto.createHash("sha256").update(url).digest("hex").slice(0, 32)

  return [
    {
      title: title.slice(0, 500),
      content: content.slice(0, 10000),
      url,
      author: $('meta[name="author"]').attr("content") ?? null,
      published_at: null,
      hash,
    },
  ]
}
