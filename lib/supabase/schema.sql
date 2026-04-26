-- AiLex — Schéma PostgreSQL via Supabase
-- Exécuter dans l'éditeur SQL de Supabase

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- USERS (étend auth.users de Supabase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'starter' CHECK (plan IN ('starter', 'pro', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SOURCES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'rss' CHECK (type IN ('rss', 'url', 'api')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_fetched_at TIMESTAMPTZ,
  fetch_interval_hours INTEGER NOT NULL DEFAULT 24,
  error_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sources_user_id ON public.sources(user_id);
CREATE INDEX idx_sources_enabled ON public.sources(enabled);

-- ============================================================
-- ARTICLES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  summary TEXT,
  url TEXT NOT NULL,
  author TEXT,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  hash TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, hash)
);

CREATE INDEX idx_articles_user_id ON public.articles(user_id);
CREATE INDEX idx_articles_source_id ON public.articles(source_id);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX idx_articles_title_trgm ON public.articles USING gin(title gin_trgm_ops);

-- ============================================================
-- INSIGHTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('summary', 'risks', 'opportunities', 'trends')),
  keywords TEXT[] DEFAULT '{}',
  sources TEXT[] DEFAULT '{}',
  ai_model TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_insights_user_id ON public.insights(user_id);
CREATE INDEX idx_insights_created_at ON public.insights(created_at DESC);
CREATE INDEX idx_insights_type ON public.insights(type);

-- ============================================================
-- NEWSLETTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  template JSONB DEFAULT '{}',
  recipient_emails TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NEWSLETTER ISSUES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.newsletter_issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  newsletter_id UUID REFERENCES public.newsletters(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  open_count INTEGER NOT NULL DEFAULT 0,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_issues_newsletter_id ON public.newsletter_issues(newsletter_id);
CREATE INDEX idx_newsletter_issues_status ON public.newsletter_issues(status);

-- ============================================================
-- LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_logs_user_id ON public.logs(user_id);
CREATE INDEX idx_logs_event_type ON public.logs(event_type);
CREATE INDEX idx_logs_created_at ON public.logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Sources
CREATE POLICY "sources_all_own" ON public.sources FOR ALL USING (auth.uid() = user_id);

-- Articles
CREATE POLICY "articles_all_own" ON public.articles FOR ALL USING (auth.uid() = user_id);

-- Insights
CREATE POLICY "insights_all_own" ON public.insights FOR ALL USING (auth.uid() = user_id);

-- Newsletters
CREATE POLICY "newsletters_all_own" ON public.newsletters FOR ALL USING (auth.uid() = user_id);

-- Newsletter Issues
CREATE POLICY "newsletter_issues_all_own" ON public.newsletter_issues FOR ALL USING (auth.uid() = user_id);

-- Logs
CREATE POLICY "logs_select_own" ON public.logs FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON public.sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletters_updated_at BEFORE UPDATE ON public.newsletters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_issues_updated_at BEFORE UPDATE ON public.newsletter_issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER: créer profil + abonnement à l'inscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'starter', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
