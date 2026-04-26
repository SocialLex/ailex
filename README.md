# AiLex — Veille stratégique automatisée par l'IA

Plateforme SaaS complète pour automatiser la veille juridique et réglementaire avec Claude AI.

**Stack :** Next.js 14 App Router · TypeScript · Tailwind v4 · Supabase · Anthropic Claude · Stripe · Resend

---

## Fonctionnalités

- **Ingestion multi-sources** — Flux RSS + scraping web, déduplication SHA-256
- **Pipeline IA** — Analyse d'articles, extraction d'insights, digest quotidien via Claude Sonnet
- **Newsletter** — Génération HTML par IA, envoi via Resend, gestion des destinataires
- **Stripe** — Plans Starter (gratuit) / Pro (49€) / Enterprise (199€), webhook complet
- **Admin** — Panel role-gated, stats globales, table utilisateurs, logs
- **Auth** — Supabase SSR, Google OAuth, email/password, reset par email

---

## Démarrage rapide

### 1. Cloner et installer

```bash
git clone <repo>
cd ailex
npm install
```

### 2. Configurer les variables d'environnement

Éditez `.env.local` et remplissez les valeurs :

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

ANTHROPIC_API_KEY=

STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ENTERPRISE_PRICE_ID=

RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@votredomaine.fr

NEXT_PUBLIC_APP_URL=https://votredomaine.fr
CRON_SECRET=<random_secret>
```

### 3. Initialiser la base de données

Dans Supabase SQL Editor, exécutez `lib/supabase/schema.sql`.

Ce script crée : `profiles`, `subscriptions`, `sources`, `articles`, `insights`, `newsletters`, `newsletter_issues`, `logs` — avec RLS et triggers automatiques.

### 4. Lancer en développement

```bash
npm run dev
```

---

## Structure

```
app/
├── (auth)/         # login, register, forgot/reset-password
├── (dashboard)/    # dashboard, sources, insights, newsletter, settings
├── (admin)/        # admin panel (role=admin requis)
└── api/            # sources · insights · newsletter · stripe · cron

components/
├── landing/        # navbar, hero, features, how-it-works, testimonials, pricing, cta, footer
├── dashboard/      # sidebar, topbar, stats, feeds, clients
└── ui/             # button, badge, skeleton, logo

lib/
├── ai/             # Claude pipeline (analyze, digest, newsletter)
├── email/          # Resend
├── ingestion/      # RSS + scraper
├── stripe/         # client + PLANS
└── supabase/       # browser + server + admin + schema.sql
```

---

## Déploiement Vercel

1. Importez le dépôt, ajoutez les variables d'environnement
2. Le cron (`vercel.json`) s'exécute automatiquement toutes les heures
3. Webhook Stripe : `stripe listen --forward-to https://votredomaine.fr/api/stripe/webhook`
