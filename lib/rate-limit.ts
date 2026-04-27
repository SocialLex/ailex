// Simple in-memory rate limiter — resets per serverless cold start
// For persistent rate limiting across instances, use Upstash Redis.

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  windowSeconds: number
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const windowMs = options.windowSeconds * 1000

  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + windowMs }
    store.set(key, newEntry)
    // Cleanup old entries periodically
    if (store.size > 10_000) {
      for (const [k, v] of store) {
        if (now >= v.resetAt) store.delete(k)
      }
    }
    return { allowed: true, remaining: options.limit - 1, resetAt: newEntry.resetAt }
  }

  entry.count++
  const allowed = entry.count <= options.limit
  return {
    allowed,
    remaining: Math.max(0, options.limit - entry.count),
    resetAt: entry.resetAt,
  }
}

export function rateLimitResponse(resetAt: number) {
  return new Response(
    JSON.stringify({ error: "Trop de requêtes. Réessayez dans quelques instants." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
        "X-RateLimit-Reset": new Date(resetAt).toISOString(),
      },
    }
  )
}
