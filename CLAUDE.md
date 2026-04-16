# HeartNote — Project Reference for Claude

## Project Description

**HeartNote** (heartnote.co.il) is a SaaS digital greeting card creation platform built for the Israeli market. Users pick from interactive card templates (quizzes, timelines, love coupons, open-when envelopes, etc.), fill in personalised content, and share the resulting card via a unique link. The platform has a free tier and a premium subscription tier.

---

## Repository Layout

```
d:\HeartNote\                          ← project root (git root, this file lives here)
├── client/                            ← Next.js application (all code lives here)
│   ├── next.config.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .env.example
│   └── src/
│       ├── app/                       ← Next.js App Router
│       │   ├── layout.tsx             ← root layout (providers, fonts, GTM)
│       │   ├── (main)/                ← authenticated/public browsing routes
│       │   │   ├── page.tsx           ← home
│       │   │   ├── gallery/           ← template gallery
│       │   │   ├── create/[templateId]/  ← card editor
│       │   │   ├── profile/           ← user profile
│       │   │   ├── complete-profile/  ← onboarding gate
│       │   │   ├── pricing/           ← subscription page
│       │   │   ├── preview/           ← creation preview
│       │   │   ├── auth/              ← auth callbacks (reset-password, etc.)
│       │   │   ├── contact/
│       │   │   ├── faq/
│       │   │   ├── privacy/
│       │   │   └── terms/
│       │   ├── (public)/              ← unauthenticated routes
│       │   │   ├── p/[slug]/          ← public card sharing link
│       │   │   └── demo/
│       │   └── api/
│       │       └── auth/              ← POST /api/auth/logout
│       ├── actions/                   ← Server Actions
│       │   ├── auth.ts
│       │   ├── registration.ts
│       │   ├── password.ts
│       │   ├── contact.ts
│       │   ├── dashboard.ts
│       │   ├── templates.ts
│       │   ├── draftActions.ts
│       │   ├── oauthDraft.ts
│       │   ├── profile/
│       │   ├── creations/
│       │   │   ├── create.ts
│       │   │   ├── submit.ts
│       │   │   ├── delete.ts
│       │   │   ├── read.ts
│       │   │   ├── redeem.ts
│       │   │   └── helpers/           ← quotaCheck.ts, expiryCalc.ts
│       │   └── subscription/
│       │       └── upgradeSubscription.ts
│       ├── components/
│       │   ├── accessibility/
│       │   ├── auth/
│       │   ├── contact/
│       │   ├── cookieBanner/
│       │   ├── demo/
│       │   ├── editor/
│       │   ├── footer/
│       │   ├── galleryTemplate/
│       │   ├── header/
│       │   ├── home/
│       │   ├── pricing/
│       │   ├── profile/
│       │   ├── templates/
│       │   ├── ui/
│       │   └── welcomeSplash/
│       ├── contexts/
│       │   └── AuthContext.tsx        ← auth state, session lifecycle
│       ├── hooks/
│       │   ├── useServerAction.ts     ← executes server actions, handles 401
│       │   ├── useProfile.ts
│       │   ├── useDashboard.ts
│       │   ├── useActiveTemplates.ts
│       │   ├── useProfileComplete.ts
│       │   └── useUser.ts
│       ├── lib/
│       │   ├── action-response.ts     ← ActionResult<T>, ActionError, ok(), fail()
│       │   ├── protectedAction.ts     ← auth wrapper for server actions
│       │   ├── fonts.ts
│       │   ├── utils.ts
│       │   ├── supabase/
│       │   │   ├── client.ts          ← browser client (createBrowserClient)
│       │   │   ├── server.ts          ← server client (cookie-based session)
│       │   │   ├── admin.ts           ← service-role client (bypasses RLS)
│       │   │   └── middleware.ts      ← edge-runtime client
│       │   ├── validations/           ← Zod schemas
│       │   │   ├── profile.ts
│       │   │   ├── creation.ts
│       │   │   ├── dashboard.ts
│       │   │   ├── subscription.ts
│       │   │   ├── template.ts
│       │   │   └── metadata.ts
│       │   └── utils/
│       │       ├── csrf.ts            ← origin validation for server actions
│       │       ├── rate-limiter.ts    ← Upstash Redis rate limiting factory
│       │       ├── logger.ts          ← PII-safe logging (masks email/UUID/IP)
│       │       ├── sanitize.ts
│       │       └── image-utils.ts
│       ├── middleware.ts              ← route protection (profile completeness)
│       ├── providers/
│       │   └── QueryProvider.tsx      ← TanStack Query
│       ├── types/
│       │   └── index.ts               ← global TypeScript interfaces
│       └── constants/
│           └── colors.ts
├── supabase/
│   └── migrations/                    ← 21 SQL migration files
│       ├── 000_init.sql               ← consolidated final schema (authoritative)
│       └── 001–021_*.sql              ← incremental migrations
├── project-rules.md
├── AUDIT_REPORT.md
├── DEPLOYMENT_CHECKLIST.md
├── PROJECT_SUMMARY.md
└── docker-compose.yml
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.1.0 (App Router) |
| Language | TypeScript 5.3 (strict) |
| Styling | Tailwind CSS 3.4, Framer Motion 11 |
| Database & Auth | Supabase (PostgreSQL + Auth) via `@supabase/ssr` |
| Server State | TanStack React Query 5 |
| Email | Resend 6 |
| Rate Limiting | Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`) |
| Analytics | Google Tag Manager (optional `NEXT_PUBLIC_GTM_ID`) |
| Validation | Zod 4 |
| Deployment | Vercel |
| Image Cropping | react-easy-crop |
| Icons | lucide-react |
| Toasts | sonner |
| Testing | Vitest + Testing Library |

---

## Environment Variables

```bash
# client/.env (copy from .env.example)

# Supabase (public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (server-only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...

# Resend
RESEND_KEY=re_xxxx
MAIL_HEART_NOTE=info@heartnote.co.il

# Site URL (used for redirects, OG meta)
NEXT_PUBLIC_SITE_URL=https://heartnote.co.il

# Google Tag Manager (optional)
NEXT_PUBLIC_GTM_ID=
```

---

## Database Schema

All commands run against Supabase (PostgreSQL). Authoritative schema is `supabase/migrations/000_init.sql`.

### `profiles`
Primary user record; 1:1 with `auth.users`.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | FK → `auth.users(id)` ON DELETE CASCADE |
| `email` | TEXT | |
| `first_name`, `last_name` | TEXT | |
| `date_of_birth` | DATE | |
| `avatar_url` | TEXT | Defaults to dicebear avatar |
| `subscription_tier` | TEXT | `'free'`, `'lite'`, or `'premium'` (CHECK constraint) |
| `creations_count_free` | INT | Running count of free-tier creations used |
| `creations_count_pro` | INT | Running count of premium creations (analytics) |
| `additional_creation_free` | INT | Bonus free-tier quota granted manually |
| `additional_creation_pro` | INT | Bonus premium quota granted manually |
| `premium_start` | TIMESTAMP | When premium began |
| `premium_expiry` | TIMESTAMP | When premium expires |
| `reset_attempts` | INT | Password reset counter |
| `is_blocked` | BOOLEAN | Account ban flag |
| `created_at`, `updated_at` | TIMESTAMPTZ | `updated_at` auto-updated by trigger |

### `templates`
Reusable card template definitions.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `slug` | TEXT UNIQUE | URL-safe identifier |
| `name` | TEXT | Display name |
| `category` | TEXT[] | |
| `tags` | TEXT | |
| `is_premium` | BOOLEAN | If `true`, only premium users can create |
| `config_schema` | JSONB | Field definitions for the editor |
| `expiration_policy` | JSONB | `{ free_days, paid_days }` |
| `is_active` | BOOLEAN | Soft-disable from gallery |
| `uses` | INT | Incremented by trigger on creation |

### `creations`
User-created card instances.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID | FK → `profiles(id)` ON DELETE CASCADE |
| `template_id` | UUID | FK → `templates(id)` ON DELETE CASCADE |
| `metadata` | JSONB | Dynamic card content (validated against `config_schema`) |
| `is_paid` | BOOLEAN | `true` if created under premium tier |
| `expires_at` | TIMESTAMP | Derived from policy + tier at creation time |
| `is_deleted` | BOOLEAN | Soft-delete flag |
| `created_at` | TIMESTAMP | |

### `subscription_policies`
Configuration table, keyed by tier.

| Column | Type | Notes |
|---|---|---|
| `tier_code` | TEXT PK | `'free'`, `'lite'`, or `'premium'` |
| `creation_limit` | INT | Max creations per tier (`null` = unlimited) |
| `default_expiry` | INT | Seconds until expiry |

### `banned_users`
Explicit email blocklist (populated on account deletion or manual ban).

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `email` | TEXT UNIQUE | |
| `reason` | TEXT | Default `'self_deletion'` |
| `banned_at` | TIMESTAMPTZ | |

### `password_reset_attempts`
Rate limiting table for password reset.

| Column | Type | Notes |
|---|---|---|
| `id` | BIGSERIAL PK | |
| `email` | TEXT | |
| `ip_address` | INET | |
| `created_at` | TIMESTAMPTZ | Indexed with `email` for fast lookups |

### DB Triggers
- `on_auth_user_created` → `handle_new_user()`: auto-inserts `profiles` row on signup
- `set_profiles_updated_at` → `handle_updated_at()`: keeps `updated_at` current
- `trg_handle_new_creation_quota` (BEFORE INSERT on `creations`): validates quota and decrements `creations_count_free`
- `trigger_increment_template_uses` → `increment_template_uses()`: bumps `templates.uses`

---

## Business Logic Rules

### Subscription Tiers

`lite` and `premium` are both paid tiers — same benefits (no branding, access to premium templates), different creation limits and expiry windows.

| Tier | Creations | Expiry | HeartNote Branding | Premium Templates |
|---|---|---|---|---|
| `free` | 5 | None (no expiry) | Yes | No |
| `lite` | 2 | 30 days | No | Yes |
| `premium` | 6 | 45 days | No | Yes |

### Creation Flow
1. User selects template → editor renders fields from `config_schema`
2. Submit triggers `createCreation()` server action
3. Fast-fail checks (in order):
   - Premium expiry auto-downgrade (if `premium_expiry` < now)
   - Premium access guard (402 if free user picks `is_premium` template)
   - Quota limit guard (403 if `creations_count_free ≥ limit + additional_creation_free`)
4. `expires_at` calculated: `now() + policy.default_expiry` (seconds), adjusted per tier
5. INSERT into `creations` → DB trigger decrements quota atomically
6. Returns `{ creationId, expires_at }`

### Subscription Upgrade
- `upgradeSubscription()` action updates `profiles.subscription_tier`, `premium_start`, `premium_expiry`
- Expiry is calculated from `subscription_policies.default_expiry` for the new tier
- Premium users bypass creation quota checks entirely

### Registration & Auth
- Email/password via Supabase Auth
- `registerUser()` checks `banned_users` first (returns generic success to avoid enumeration)
- Existing accounts receive "already have account" email via Resend
- Profile completeness check (first_name + last_name + date_of_birth) gates `/profile`
- Incomplete profile → redirected to `/complete-profile` if they try to visit `/profile`

### Rate Limits (Upstash Redis)
| Action | Limit |
|---|---|
| Login | 5 attempts / 15 min / IP |
| Registration | 3 accounts / hour / IP |
| Password reset | 3 attempts / 15 min / IP |
| Contact form | 5 messages / min / IP |

---

## Server Action Pattern

All authenticated server actions use the `protectedAction` wrapper:

```typescript
// src/lib/protectedAction.ts
export async function myAction(input: Input): Promise<ActionResult<Output>> {
  return protectedAction<Output>(async (user, supabase) => {
    // user is verified — go straight to business logic
    throw new ActionError("Not found", 404); // signals business-logic failure
    return data;
  });
}

// Return type
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number }
```

Client-side consumption via `useServerAction()` hook which auto-handles 401 (signs out + shows toast).

---

## Supabase Client Variants

| File | Client type | Use case |
|---|---|---|
| `src/lib/supabase/client.ts` | `createBrowserClient` | Client components, hooks |
| `src/lib/supabase/server.ts` | `createServerClient` (cookies) | Server components, server actions |
| `src/lib/supabase/admin.ts` | `createClient` (service role) | Admin ops, bypasses RLS |
| `src/lib/supabase/middleware.ts` | `createServerClient` | Edge middleware, session refresh |

---

## Middleware

`src/middleware.ts` — runs on all routes except `_next`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `assets`, `api`.

**Two rules only:**
1. **Profile Lock**: Authenticated user with incomplete profile hitting `/profile` → redirect to `/complete-profile`
2. **Onboarding Lock**: Authenticated user with complete profile hitting `/complete-profile` → redirect to intended destination or `/`

Everything else passes through freely (no hard auth wall on gallery, home, create pages — those are guarded at the action level).

---

## Git Workflow

- The agent works on `dev` branch only
- `main` branch is touched only by the developer
- All PRs from `dev` → `main` are done manually by the developer
- Never merge, never touch `main`

---

## Dev Commands

All commands run from `client/`:

```bash
npm run dev          # start dev server on localhost:3000
npm run dev:lan      # dev server bound to 0.0.0.0 (LAN access)
npm run build        # production build
npm run start        # start production server
npm run start:lan    # production server on 0.0.0.0
npm run lint         # ESLint
npm run type-check   # tsc --noEmit (no emit, just type errors)
npx vitest           # run tests
```

---

## Conventions & Patterns

- **Monorepo-lite**: `client/` is the Next.js app; `supabase/` holds migrations. Always `cd client/` before running npm commands.
- **Path aliases**: `@/*` maps to `src/*`. Use `@/lib/...`, `@/components/...`, `@/hooks/...`, `@/types/...`.
- **Zod everywhere**: All input validated with Zod schemas in `src/lib/validations/`. Metadata validated dynamically against `template.config_schema`.
- **ActionResult pattern**: Every server action returns `{ success: true, data }` or `{ success: false, error, code }`. Never throw raw errors to the client.
- **Soft deletes**: Creations use `is_deleted = true`, not hard deletes.
- **PII logging**: `logger.ts` masks emails, UUIDs, IPs in production. Use `logger.*` instead of `console.*`.
- **CSRF**: All mutating server actions call `validateOrigin()` from `src/lib/utils/csrf.ts`.
- **RLS**: Enabled on all tables. `admin.ts` (service role) is the only way to bypass. Never expose service role key to the client.
- **Security headers**: Configured in `next.config.js` for all routes (X-Frame-Options, CSP-adjacent headers).
- **Font loading**: Custom fonts (Glacial Indifference, Inter, Open Sans) loaded via `src/lib/fonts.ts` and `FontReadyGateway` component.
- **Subscription tiers**: Three valid values — `'free'`, `'lite'`, `'premium'` — all enforced by CHECK constraint. `lite` and `premium` are paid tiers with identical benefits but different limits.
