export type UserRole = "user" | "admin"
export type SubscriptionPlan = "starter" | "pro" | "enterprise"
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing"
export type SourceType = "rss" | "url" | "api"
export type ArticleStatus = "pending" | "processed" | "failed"
export type InsightType = "summary" | "risks" | "opportunities" | "trends"

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  created_at: string
  updated_at: string
}

export interface Source {
  id: string
  user_id: string
  name: string
  url: string
  type: SourceType
  enabled: boolean
  last_fetched_at: string | null
  fetch_interval_hours: number
  error_count: number
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  source_id: string
  user_id: string
  title: string
  content: string
  summary: string | null
  url: string
  author: string | null
  published_at: string | null
  status: ArticleStatus
  hash: string
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Insight {
  id: string
  user_id: string
  article_id: string | null
  title: string
  content: string
  type: InsightType
  keywords: string[]
  sources: string[]
  ai_model: string
  tokens_used: number
  created_at: string
}

export interface Newsletter {
  id: string
  user_id: string
  name: string
  description: string | null
  template: Record<string, unknown>
  recipient_emails: string[]
  created_at: string
  updated_at: string
}

export interface NewsletterIssue {
  id: string
  newsletter_id: string
  user_id: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sent" | "failed"
  scheduled_at: string | null
  sent_at: string | null
  recipient_count: number
  open_count: number
  click_count: number
  created_at: string
  updated_at: string
}

export interface PricingPlan {
  id: SubscriptionPlan
  name: string
  price: number
  priceId: string
  description: string
  features: string[]
  highlighted?: boolean
}
