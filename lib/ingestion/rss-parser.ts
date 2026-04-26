import RSSParser from "rss-parser"
import crypto from "crypto"

const parser = new RSSParser({
  timeout: 10000,
  headers: {
    "User-Agent": "AiLex/1.0 (veille-strategique)",
    Accept: "application/rss+xml, application/xml, text/xml",
  },
})

export interface ParsedArticle {
  title: string
  content: string
  url: string
  author: string | null
  published_at: Date | null
  hash: string
}

export async function fetchRSSFeed(url: string): Promise<ParsedArticle[]> {
  const feed = await parser.parseURL(url)

  return feed.items.map((item) => {
    const title = item.title ?? "Sans titre"
    const content =
      item["content:encoded"] ?? item.content ?? item.summary ?? item.contentSnippet ?? ""
    const url = item.link ?? item.guid ?? ""
    const hash = crypto
      .createHash("sha256")
      .update(url || title)
      .digest("hex")
      .slice(0, 32)

    return {
      title: title.trim(),
      content: stripHtml(content).trim(),
      url,
      author: item.creator ?? item.author ?? null,
      published_at: item.pubDate ? new Date(item.pubDate) : null,
      hash,
    }
  })
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
}
