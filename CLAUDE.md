# HeartNote — Project Reference for Claude

## Agent Team Trigger — CRITICAL

Team lives in `.claude/agents/`: **avi** (opus, orchestrator, read-only), **aviel** (sonnet, UI/RTL/Tailwind, edit rights), **adiel** (sonnet, backend/API/Supabase, edit rights), **avishag** (sonnet, QA — layout/render/security, read-only report), **avigil** (sonnet, code quality/comments, read-only report).

**Only activate this team when the user's message starts with the literal phrase "use the team".** Do not auto-route to these agents otherwise — normal tasks use the standard Planning Protocol below.

When triggered:
1. Call `avi` (Agent tool, `subagent_type: "avi"`) first with the task. It applies the Task Classifier and returns a routing plan (which agents, what scope, what order) — avi never edits code itself.
2. Execute avi's routing plan: call `aviel`/`adiel` for implementation (they hold edit rights), then `avishag`/`avigil` for QA and quality pass (read-only — they report findings back, you or aviel/adiel apply any resulting fixes).
3. If avi's classifier says the task is trivial (score ≥5), skip the rest of the team and let the single named specialist handle it directly.

## Planning Protocol

> Load `C:\Users\ilaya\.claude\skills\caveman\SKILL.md` before every task — no exceptions.

### Confidence Gate — applies before either path below
If not 100% certain of the task's goal/scope (ambiguous wording, multiple valid interpretations, unstated target file/component), ask a clarifying question first — even if Task Classifier scores the task trivial. Skip only when intent is fully unambiguous.

### Trivial task (score ≥ 5 in Task Classifier)
- Execute directly with Sonnet
- No plan, no brainstorm (still subject to Confidence Gate above)
- One pass, ship it

### Non-trivial task (score ≤ 4)
1. Ask 3–5 clarifying questions — never jump to code first
2. Write plan to `.claude/plans/<slug>.md` before touching any file
3. Execute in small chunks — max one file per step
4. Run `npm run type-check` after each file
5. Never skip planning, even if the task seems straightforward

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
Copy `client/.env.example` → `client/.env`. Never commit secrets.
Required keys: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, RESEND_KEY, MAIL_HEART_NOTE, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_GTM_ID (optional), NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED (optional, default `true` — set `false` to disable the whole premium/quota system, see `src/lib/config/features.ts`).

---

## Database Schema
Authoritative schema: `supabase/migrations/000_init.sql`

| Table | Key columns |
|---|---|
| `profiles` | id (PK→auth.users), email, first_name, last_name, date_of_birth, avatar_url, subscription_tier ('free'/'lite'/'premium'), creations_count_free, creations_count_pro, additional_creation_free/pro, premium_start/expiry, reset_attempts, is_blocked |
| `templates` | id, slug, name, category[], is_premium, config_schema (JSONB), expiration_policy (JSONB), is_active, uses |
| `creations` | id, user_id→profiles, template_id→templates, metadata (JSONB), is_paid, expires_at, is_deleted |
| `subscription_policies` | tier_code (PK), creation_limit, default_expiry |
| `banned_users` | id, email (UNIQUE), reason, banned_at |
| `password_reset_attempts` | id, email, ip_address, created_at |

DB Triggers: on_auth_user_created → auto-insert profiles row | set_profiles_updated_at → keep updated_at current | trg_handle_new_creation_quota → validate quota + decrement on INSERT | trigger_increment_template_uses → bump templates.uses

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

## Error Patterns

### Standard error codes
| Code | Meaning | When to use |
|---|---|---|
| 400 | Bad input | Zod validation failed |
| 401 | Unauthenticated | No session / session expired |
| 402 | Payment required | Free user accessing premium template |
| 403 | Forbidden | Quota exceeded, banned user |
| 404 | Not found | Resource doesn't exist or soft-deleted |
| 409 | Conflict | Duplicate (e.g. email already registered) |
| 429 | Rate limited | Upstash Redis limit hit |
| 500 | Server error | Unexpected Supabase or internal failure |

### How to return errors in server actions

```typescript
// Validation failure
if (!parsed.success) return fail("Invalid input", 400);

// Auth failure (handled by protectedAction automatically)

// Business logic failure
if (user.subscription_tier === "free" && template.is_premium)
  return fail("Premium template requires upgrade", 402);

// Quota exceeded
if (quotaExceeded) return fail("Creation limit reached", 403);

// Supabase error
const { data, error } = await supabase.from("creations").insert(...);
if (error) {
  logger.error("createCreation failed", { code: error.code });
  return fail("Failed to save creation", 500);
}
```

### Rate limit pattern

```typescript
const { success } = await rateLimiter.limit(ip);
if (!success) return fail("Too many requests", 429);
```

### Never do
- Never throw raw errors to the client — always return `fail(message, code)`
- Never expose Supabase error messages directly — log them, return generic message
- Never use `console.error` — use `logger.error`

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

## TanStack Query Rules

### When to use React Query (client-side hooks)
- Data that needs to stay fresh while the user is on the page (e.g. dashboard stats)
- Data shared across multiple components without prop drilling
- Data that benefits from background refetch or cache invalidation

Existing hooks: `useProfile`, `useDashboard`, `useActiveTemplates`, `useUser`, `useProfileComplete`

### When NOT to use React Query
- One-time reads that only happen on page load → use Server Component + `async/await`
- Mutations (create, update, delete) → call server action directly via `useServerAction()`
- Data only needed in one component → fetch in Server Component, pass as props

### useServerAction pattern (mutations)

```typescript
// Always use this hook for calling server actions from client components
const { execute, loading, error } = useServerAction(myServerAction);

// On button click:
const result = await execute(input);
if (!result.success) toast.error(result.error);
```

### Query key conventions

```typescript
// Use string arrays, most-specific last
["profile", userId]
["dashboard", userId]
["templates", "active"]
["creation", creationId]
```

### Cache invalidation after mutation

```typescript
import { useQueryClient } from "@tanstack/react-query";
const queryClient = useQueryClient();

// After successful server action:
queryClient.invalidateQueries({ queryKey: ["dashboard", userId] });
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

---

## Component Conventions

### Where components live
| Type | Location |
|---|---|
| Shared UI primitives (Button, Modal, Input) | `components/ui/` |
| Page-specific components | `components/<page>/` (e.g. `components/pricing/`) |
| Layout components (Header, Footer) | `components/header/`, `components/footer/` |
| Full-page feature components | `components/<feature>/` |

### File naming
- Component file: `PascalCase.tsx` (e.g. `TemplateCard.tsx`)
- Hook: `camelCase` prefixed with `use` (e.g. `useTemplateCard.ts`)
- Types: `ComponentName.types.ts`
- Utils: `componentName.utils.ts`
- Animations: `componentName.animations.ts`
- Barrel: `index.ts` (re-exports only, zero logic)

### Component structure (within file)
1. Imports
2. Types (if not extracted)
3. Constants (if not extracted)
4. Component function
5. Export

### Server vs Client components
- Default to **Server Component** — no `"use client"` unless needed
- Add `"use client"` only when using: useState, useEffect, event handlers, browser APIs
- Never fetch data in a Client Component — pass as props from Server Component

### RTL-specific rules (Hebrew layout)
- Always test with `dir="rtl"` active
- Replace directional Tailwind classes: `border-l` → `border-r`, `pl-` → `pr-`, `ml-` → `mr-`, `left-` → `right-`
- Use `start/end` logical properties when available (e.g. `ps-`, `pe-`)

---

## Infrastructure

- **Supabase region**: `eu-central-1` (Frankfurt). All DB calls originate from Vercel edge functions co-located in Frankfurt; target round-trip ≤ 80 ms.
- **Feb 2026 migration**: Consolidated schema snapshot written to `supabase/migrations/000_init.sql`; incremental migrations 001–021 applied on top. New migrations should follow the `NNN_<slug>.sql` naming convention and be tested locally before push.

---

## Agent Skills

| Skill | Purpose |
|---|---|
| `modular-code-architect` | Enforces ≤ 150-line file limit; auto-decomposes large files |
| `ui-ux-pro-max` | UI/UX design intelligence — layouts, palettes, component design |
| `frontend-design` | Production-grade React/Tailwind components, design tokens |
| `file-reading` | Smart file reading — selects correct tool per file type |
| `next-performance` | Enforces Server Components, Suspense, caching, bundle discipline |
| `supabase-best-practices` | RLS, N+1 prevention, typed client, pgbouncer, service role safety |
| `typescript-strict` | Zero `any`, explicit return types, discriminated unions |
| `git-ship` | Full pipeline: build check → diff review → commit → push on `dev` branch. Invoke with `/git-ship` or `/ship` |
| `caveman` | Short, token-efficient responses — always active |

---

## Output Rules

- **Plans**: Save implementation plans to `.claude/plans/<slug>.md` before starting non-trivial tasks.
- **File length**: Hard limit of 150 lines per file. Extract helpers, split components into sub-modules when approaching the limit.
- **Server Actions**: Follow the `protectedAction` wrapper pattern in `src/lib/protectedAction.ts`.
- **Supabase JS**: Use `@supabase/ssr` v2 client variants (see Supabase Client Variants section above).

---

## Task Classifier (read this before every task)

Score the incoming task. Each signal = 1 point.

| Signal | +1 if... |
|---|---|
| File scope | Touches ≤ 2 files |
| No new DB | No new tables, columns, or RLS rules |
| No new action | No new server action or API route |
| Additive only | No logic deletion or restructure |
| Clear scope | Describable in one sentence without ambiguity |
| No auth/payments | No auth, Stripe, or email logic involved |
| Small output | Estimated output < 80 lines total |

**Score ≥ 5 → TRIVIAL** → Sonnet executes directly, no plan, no brainstorm
**Score ≤ 4 → NON-TRIVIAL** → Opus writes plan first, then Sonnet executes

### Examples
| Task | Verdict |
|---|---|
| Fix a typo, rename a class, change a color | TRIVIAL |
| Add one field to existing Zod schema | TRIVIAL |
| New page, new server action, new DB table | NON-TRIVIAL |
| Refactor component > 150 lines | NON-TRIVIAL |
| Wire auth, payments, or email logic | NON-TRIVIAL |

---

## Agent Model Policy — CRITICAL

| Role | Model | Responsibility |
|---|---|---|
| Planner | `claude-opus-4-5` | Analyze task, write plan to `.claude/plans/`, decompose steps |
| Executor | `claude-sonnet-4-5` | Implement each step from the plan, write code, run commands |

### Rules
- Opus NEVER writes code directly — it produces plans only.
- Sonnet NEVER plans — it reads the plan and executes step-by-step.
- If no plan exists for a non-trivial task → Opus creates one first, then Sonnet executes.
- Trivial tasks (1-liner fixes, renaming) → Sonnet executes directly, no plan required.

---

## Response Style — CRITICAL

> Caveman skill is always active — keep all responses minimal and token-efficient.

All agent responses must be **concise**. This conserves tokens and keeps context lean.

### Rules
- No filler phrases ("Of course!", "Great question!", "Let me help you with that").
- No restating the task before answering.
- Code blocks only — no narrative around obvious code.
- Errors: state what failed + fix. No explanation of what the error means.
- Max response length: what's strictly necessary.

---

## Autonomous Decisions
The agent makes these decisions without asking the developer:

### Code structure
- Extract to a hook when stateful logic exceeds ~30 lines in a component
- Extract to a utility when a pure function is used in 2+ places
- Split a file that approaches 130 lines — don't wait for 150
- Use barrel `index.ts` for any component folder with 3+ files

### Supabase client selection
- Client component or hook → `client.ts` (createBrowserClient)
- Server component or server action → `server.ts` (cookie-based)
- Admin / bypass RLS → `admin.ts` (service role, never expose to client)
- Middleware → `middleware.ts`

### Styling
- Use Tailwind utility classes — no inline styles
- RTL layout: swap `border-l` → `border-r`, `pl-` → `pr-`, `left-` → `right-`
- Brand color `#D85A30` — use via CSS variable, never hardcoded in multiple places

### TypeScript
- New shared types → `src/types/index.ts`
- Component-scoped types → `ComponentName.types.ts` in the same folder
- Never use `any` — use `unknown` + type guard if shape is truly unknown

### When to ask
Only ask the developer when:
- Business logic is ambiguous (e.g. what happens when quota = 0 for a paid user?)
- A decision would affect the DB schema or RLS policies
- Two valid approaches have meaningfully different UX outcomes

---

## Global Skills

Skills are loaded from the global directory: `C:\Users\ilaya\.claude\skills`

| Skill | Path |
|---|---|
| `modular-code-architect` | `C:\Users\ilaya\.claude\skills\modular-code-architect\` |
| `ui-ux-pro-max` | `C:\Users\ilaya\.claude\skills\ui-ux-pro-max\` |
| `frontend-design` | `C:\Users\ilaya\.claude\skills\frontend-design\` |
| `file-reading` | `C:\Users\ilaya\.claude\skills\file-reading\` |
| `next-performance` | `C:\Users\ilaya\.claude\skills\next-performance\` |
| `supabase-best-practices` | `C:\Users\ilaya\.claude\skills\supabase-best-practices\` |
| `typescript-strict` | `C:\Users\ilaya\.claude\skills\typescript-strict\` |
| `git-ship` | `C:\Users\ilaya\.claude\skills\git-ship\` |
| `caveman` | `C:\Users\ilaya\.claude\skills\caveman\` |

Project-specific skills (override globals): `.claude/skills/`

---

## Plan Storage Policy
- All plans → `.claude/plans/<slug>.md`
- All logs → `.claude/plans/logs/<slug>-<timestamp>.log`
- Never write to global Claude storage (`~/.claude/` or `%APPDATA%\Claude\`)
- When listing plans → read ONLY from `.claude/plans/`

---

## Gotchas — Hard-Won Lessons

Issues discovered during development. Check here before debugging.

| Area | Gotcha | Fix |
|---|---|---|
| RTL layout | `border-l` renders on the wrong side in Hebrew (`dir="rtl"`) | Use `border-r` instead; swap all directional classes |
| Tailwind + RTL | `pl-`, `ml-`, `left-` don't flip automatically in RTL | Use `pr-`, `mr-`, `right-` or logical properties `ps-`/`pe-` |
| Supabase client | Using `client.ts` in a Server Component causes auth issues | Server Components must use `server.ts` |
| Supabase client | Using `server.ts` in middleware breaks edge runtime | Middleware must use `middleware.ts` |
| protectedAction | Forgetting to wrap a server action exposes it to unauthenticated calls | Every auth-gated action needs `protectedAction` |
| Zod 4 | Zod 4 import paths changed from Zod 3 | Import from `zod` not `zod/v4` |
| Next.js App Router | `usePathname()` returns `null` on first render in some layouts | Guard with `pathname ?? ""` |
| TanStack Query | Calling a server action inside `useQuery` causes double-execution | Mutations go through `useServerAction`, not `useQuery` |
| logger.ts | `console.log` in production leaks PII | Always `logger.info/warn/error` — never `console.*` |
| dev branch | Accidentally committing to `main` breaks the deployment gate | Always verify `git branch` before first commit in a session |

> When you hit a new gotcha, add it here immediately.
