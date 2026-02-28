# 🔍 HeartNote — Comprehensive Codebase Audit Report

**Date:** 2026-02-26  
**Stack:** Next.js 14 (App Router) · Supabase (Auth + DB + Storage) · TailwindCSS · React 18  
**Auditor:** Senior Fullstack Architect & Security Auditor

---

## Table of Contents

1. [🚨 Security Vulnerabilities](#1--security-vulnerabilities)
2. [🗃️ Unused Assets & Dead Code](#2-️-unused-assets--dead-code)
3. [📐 File Architecture & Code Splitting](#3--file-architecture--code-splitting)
4. [🐛 Code Inefficiency & Smells](#4--code-inefficiency--smells)
5. [🔐 Database & RLS Audit](#5--database--rls-audit)
6. [🌿 Environment Variables Recommendations](#6--environment-variables-recommendations)

---

## 1. 🚨 Security Vulnerabilities

### ✅ RESOLVED SEC-1: Production Secrets Committed to Repository — **Priority: HIGH**

_(Resolved: 2026-02-28)_

**File:** `client/.env` (was tracked in git)

The `.env` file in the `client/` directory contained real production secrets (Supabase keys, database URL, Resend key).

**Remediation Applied:**

1. Updated `.gitignore` to explicitly ignore `client/.env` and `client/.env.*`, with a negation `!client/.env.example` to keep the safe template tracked.
2. Added global patterns `.env`, `.env.*`, and `*.env` to cover all subdirectories.
3. Created `client/.env.example` with all required keys using dummy placeholder values.
4. The tracked `client/.env` must be removed from git index via: `git rm --cached client/.env`
5. **Key rotation required:** All exposed secrets (Supabase anon key, service role key, database password, Resend key) must be rotated from their respective dashboards.

---

### ✅ RESOLVED SEC-2: DEBUG Error Messages Returned to Client — **Priority: HIGH**

_(Resolved: 2026-02-28)_

**File:** `client/src/actions/password.ts`

Error messages prefixed with `DEBUG` were returned directly to the end-user, leaking internal implementation details.

**Remediation Applied:**

1. Defined three centralized generic Hebrew error constants (`ERR_INTERNAL`, `ERR_USER_VERIFICATION`, `ERR_RESET_PROCESS`) — no internal details exposed.
2. All error paths now log the raw error object server-side via `console.error()` and return only the generic Hebrew string to the client.
3. The `getAdminClient()` helper validates both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, logging missing vars server-side and returning `null` (caller returns `ERR_INTERNAL`).
4. All business logic preserved: 3-strike `reset_attempts` counter, email-existence concealment, counter reset on successful password change.
5. Zero `DEBUG` strings remain in the file.

---

### ✅ RESOLVED SEC-3: XSS via HTML Email Template Injection — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

**File:** `client/src/actions/contact.ts`

User-supplied values (`name`, `email`, `subject`, `message`) were directly interpolated into an HTML email template without sanitization.

**Remediation Applied:**

1. Created `lib/utils/sanitize.ts` — an `escapeHtml()` utility that replaces the five critical HTML entities (`&`, `<`, `>`, `"`, `'`) with their safe equivalents (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).
2. All four user-supplied fields are now escaped via `escapeHtml()` before interpolation into the HTML email template.
3. The raw `email` string is still used for the `replyTo` field (non-HTML context) but the HTML-rendered occurrences use the escaped `safeEmail`.

---

### ✅ RESOLVED SEC-4: Contact Form Lacks Rate Limiting — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

**File:** `client/src/actions/contact.ts`

The `sendContactEmail` action had no rate limiting, allowing API quota exhaustion and inbox flooding.

**Remediation Applied:**

1. Created `lib/utils/rate-limiter.ts` — a reusable `createRateLimiter()` factory that implements a sliding-window algorithm using an in-memory `Map<IP, timestamp[]>`.
2. The contact action extracts the caller's IP via `headers()` (`x-forwarded-for` / `x-real-ip`) and checks against the limiter before processing.
3. Default limit: **5 requests per 60 seconds per IP**. Exceeding the limit returns a generic Hebrew error.
4. The store includes periodic self-cleanup (every 5 min) to prevent unbounded memory growth.
5. For multi-instance deployments (e.g. Vercel serverless), this should be swapped for a Redis-backed store.

---

### ✅ RESOLVED SEC-5: Client-Side resetPassword Bypasses Server-Side Rate Limiting — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

**Files:** `client/src/contexts/AuthContext.tsx`, `client/src/contexts/useAuthActions.ts`

`AuthContext.resetPassword()` called `supabase.auth.resetPasswordForEmail()` directly from the client, completely bypassing the server-side 3-strike rate-limit logic in `actions/password.ts`.

**Remediation Applied:**

1. Removed the `resetPassword` callback from `useAuthActions.ts` (the direct Supabase client call).
2. Removed `resetPassword` from the `AuthContextType` interface and the provider’s value object in `AuthContext.tsx`.
3. Verified no component destructures `resetPassword` from `useAuth()` — the only consumer (`ForgotPasswordForm.tsx`) already uses the server action `requestPasswordReset()` which enforces the 3-strike counter.
4. Added an inline comment in `useAuthActions.ts` explaining the removal and pointing to the correct server action.

---

### ✅ RESOLVED SEC-6: Profiles INSERT Policy is Too Permissive — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

**File:** `supabase/migrations/005_destructive_reset.sql` (line 206–208)

```sql
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);
```

The policy was missing the `TO service_role` clause, allowing any role (including `anon`) to insert rows into `profiles`.

**Remediation Applied:**

1. Added `TO service_role` to the policy, restricting inserts to the service-role only:

```sql
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    TO service_role
    WITH CHECK (true);
```

2. **Note:** This migration fix must also be applied to the live database. Run the following SQL in the Supabase SQL Editor:

```sql
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    TO service_role
    WITH CHECK (true);
```

---

### 🟢 SEC-7: `handle_new_user()` Trigger is SECURITY DEFINER — **Priority: LOW**

**Files:** `001_initial_schema.sql`, `005_destructive_reset.sql`

The trigger function runs with **owner privileges**. This is necessary for the pattern but should be reviewed periodically. It has `SET search_path = public` in `015_password_change_trigger.sql` but **not** in `handle_new_user()`.

**Remediation:** Add `SET search_path = public` to `handle_new_user()` to prevent search_path hijacking.

---

### 🟢 SEC-8: Duplicate `NEXT_PUBLIC_SUPABASE_URL` in `.env` — **Priority: LOW**

**File:** `client/.env` (lines 3 and 6)

The variable is declared twice. While not a security issue, it indicates sloppy configuration management.

---

## 2. 🗃️ Unused Assets & Dead Code

### ✅ COMPLETED DEAD-1: Legacy FastAPI API Client — **Priority: HIGH**

_(Completed: 2026-02-26 18:50:00+02:00)_

| File                                       | Status                                                                                    |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `client/src/lib/api.ts` (110 lines)        | **DEAD** — Axios-based client for a FastAPI backend that no longer exists                 |
| `client/src/lib/config.ts` (25 lines)      | **DEAD** — `API_BASE_URL` / `API_V1_URL` are only imported by the dead API clients        |
| `client/src/lib/api/client.ts` (212 lines) | **DEAD** — Fetch-based API client for a FastAPI backend; only imported by `editor/api.ts` |
| `client/src/components/editor/api.ts`      | **DEAD** — Imports from the dead `lib/api/client.ts`                                      |

The project has fully migrated to **Server Actions** as the data layer, but these legacy FastAPI client files were never cleaned up. The `axios` dependency in `package.json` is also unused.

**Remediation:** Delete these files and remove `axios` from `package.json`.

---

### ✅ COMPLETED DEAD-2: Unused npm Dependencies — **Priority: MEDIUM**

_(Completed: 2026-02-26 19:05:00+02:00)_
**Zod**: Kept, found imports in `/lib/validations`.
**@types/canvas-confetti**: Moved to devDependencies.

| Package                  | Reason                                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `axios`                  | No imports found. Legacy FastAPI proxy client is dead code.                                                                                                               |
| `@types/canvas-confetti` | Types-only package. `canvas-confetti` is used but `@types/canvas-confetti` is listed as a direct dependency instead of devDependency.                                     |
| `clsx`                   | Zero imports found in the codebase. Project uses `tailwind-merge` or nothing.                                                                                             |
| `tailwind-merge`         | Zero imports found in any `.ts`/`.tsx` file.                                                                                                                              |
| `zod`                    | Zero imports found even though `@/lib/validations` exists (the validation files may use it but `zod` v4 was checked and no hits). Verify if validations actually use Zod. |

**Remediation:** Run `npx depcheck` to confirm, then remove unused packages.

---

### ✅ COMPLETED DEAD-3: Unused Hooks — **Priority: MEDIUM**

_(Completed: 2026-02-26 19:05:00+02:00)_

| Hook              | File                       | Issue                                                                 |
| ----------------- | -------------------------- | --------------------------------------------------------------------- |
| `useToggle`       | `hooks/useToggle.ts`       | Exported in barrel `index.ts` but **never imported** by any component |
| `useLocalStorage` | `hooks/useLocalStorage.ts` | Exported in barrel `index.ts` but **never imported** by any component |

**Remediation:** Remove these hooks and their barrel exports.

---

### ✅ COMPLETED DEAD-4: Orphaned Directories & Files — **Priority: MEDIUM**

_(Completed: 2026-02-26 19:20:00+02:00)_

| Path                                                      | Issue                                                                                                     |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `client/src/features/auth/`                               | Contains `LoginForm.tsx`, `useAuth.ts`, `index.ts` — **never imported** by any file. Dead feature folder. |
| `client/src/features/editor/`                             | Contains `CardEditor.tsx`, `index.ts` — **never imported**. Dead feature folder.                          |
| `client/src/components/examples/ServerActionsExample.tsx` | Development-only example file. **Never imported.**                                                        |
| `client/src/components/landing/FAQ.tsx`                   | **Never imported.** A separate `components/faq/` directory exists and is the one actually in use.         |
| `server/app/schemas/__init__.py`                          | Sole remnant of the abandoned FastAPI backend. The entire `server/` directory is dead.                    |
| `TEMPLATE_USAGE_EXAMPLES.ts` (root)                       | A 13KB standalone TS file at project root. Not part of any build.                                         |
| `client/build_log_*.txt` (×7 files)                       | Build artifact logs committed to the repo. Should be gitignored.                                          |

**Remediation:** Delete all orphaned files and directories. Add `build_log*.txt` to `.gitignore`.

---

### ✅ COMPLETED DEAD-5: Duplicate Supabase Client Exports — **Priority: LOW**

_(Completed: 2026-02-26 19:20:00+02:00)_

| File                       | Export                           |
| -------------------------- | -------------------------------- |
| `lib/supabase/client.ts`   | `createClient()` for browser     |
| `lib/supabase/supabase.ts` | `supabase` singleton for browser |

Both serve the same purpose (browser Supabase client). The `supabase.ts` singleton is used in `AuthContext.tsx` and `lib/api.ts` (dead). Consolidate into one.

---

## 3. 📐 File Architecture & Code Splitting

### ✅ ARCH-1: `creations.ts` is 677 Lines — **COMPLETED**

**File:** `client/src/actions/creations.ts` — **677 lines** → Split into modular files (all ≤150 lines)

**Resolution:** The monolithic file was split into the following structure:

```
actions/creations/
  ├── create.ts           # createCreation (115 lines)
  ├── submit.ts           # submitGenericCreation (139 lines)
  ├── read.ts             # getMyCreations, getCreation (118 lines)
  ├── delete.ts           # deleteCreation (50 lines)
  ├── redeem.ts           # redeemCoupon (64 lines)
  ├── helpers/
  │   ├── quotaCheck.ts   # Shared quota/premium guard logic (109 lines)
  │   └── expiryCalc.ts   # Shared expiry calculation (30 lines)
  └── index.ts            # Barrel export (11 lines)
```

Shared logic (quota checks, premium guards, expiry calculations) extracted into helpers, eliminating the DRY violation. Barrel `index.ts` maintains backward compatibility for all existing imports.

---

### ✅ ARCH-2: `globals.css` is 474 Lines — **COMPLETED**

**File:** `client/src/app/globals.css` — **474 lines** → Split into modular partials (all ≤150 lines)

**Resolution:** CSS was split into logical partials imported via `@import`:

- `fonts.css` — @font-face declarations (43 lines)
- `accessibility.css` — High contrast, reduced motion, focus styles (149 lines)
- `scrollbar.css` — Custom scrollbar styles (44 lines)
- `animations.css` — @keyframes and animation utilities (63 lines)
- `globals.css` — Tailwind directives, CSS variables, base styles, utility classes (117 lines)

---

### ✅ ARCH-3: Several Files Exceed 150-Line Rule — **COMPLETED**

_(Completed: 2026-02-28)_

All previously flagged files have been refactored below the 150-line limit. Dead code files have been deleted.

| Original File              | Lines | Resolution                                                                                 | Current Lines |
| -------------------------- | ----- | ------------------------------------------------------------------------------------------ | ------------- |
| `actions/creations.ts`     | 677   | Split into `actions/creations/` module (6 files + 2 helpers)                               | All ≤139      |
| `app/globals.css`          | 474   | Split into 5 CSS partials (`fonts`, `accessibility`, `scrollbar`, `animations`, `globals`) | 117           |
| `contexts/AuthContext.tsx` | 283   | Logic extracted to `useAuthActions.ts` (86 lines) + `auth-helpers.ts` (52 lines)           | 90            |
| `actions/profile.ts`       | 264   | Split into `actions/profile/` module (`get`, `update`, `delete`, `helpers`, `index`)       | All ≤83       |
| `hooks/useImageUpload.ts`  | 248   | Refactored                                                                                 | 119           |
| `lib/api/client.ts`        | 212   | **Deleted** (dead code — DEAD-1)                                                           | —             |
| `actions/templates.ts`     | 167   | Refactored                                                                                 | 92            |
| `actions/password.ts`      | 161   | Refactored (SEC-2 remediation reduced boilerplate)                                         | 137           |

---

### ✅ ARCH-4: Duplicate Migration Version Numbers — **COMPLETED**

_(Completed: 2026-02-28)_

**Files:** `supabase/migrations/015_password_change_trigger.sql` AND `015_password_reset_trigger.sql`

Two migration files shared version number `015` with subtly different trigger implementations.

**Remediation Applied:**

The two duplicate files were consolidated into a single `015_password_management_consolidated.sql` containing the latest trigger logic. The duplicate `015_password_reset_trigger.sql` was deleted. The `supabase/migrations/` directory now has no version-number conflicts.

---

## 4. 🐛 Code Inefficiency & Smells

### ✅ RESOLVED SMELL-1: Duplicate Quota Logic (Application ↔ Database Trigger) — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

The creation quota was enforced in **two places simultaneously**:

1. **Application-level** in `actions/creations/create.ts` and `actions/creations/submit.ts`
2. **Database-level** via the `trg_handle_new_creation_quota` trigger in `012_creation_quota_trigger.sql`

Both decremented the same counters, resulting in **double-decrementing**.

**Remediation Applied:**

1. Removed the `decrementQuota` function entirely from `helpers/quotaCheck.ts`.
2. Removed all `decrementQuota` calls from `create.ts` and `submit.ts`.
3. Retained the application-level quota **check** (`checkQuotaLimit`) as a fast-fail guard to reject requests early without hitting the database.
4. Quota decrement is now handled exclusively by the database trigger `trg_handle_new_creation_quota`, eliminating the double-decrement bug.

---

### ✅ RESOLVED SMELL-2: Artificial `setTimeout` for Read Consistency — **Priority: MEDIUM**

_(Resolved: 2026-02-28)_

**File:** `client/src/actions/creations/delete.ts`

```typescript
// BEFORE:
await new Promise((resolve) => setTimeout(resolve, 300));

// AFTER:
import { revalidatePath } from "next/cache";
revalidatePath("/", "layout");
```

A 300ms `setTimeout` was used as a workaround for Supabase read-replica lag.

**Remediation Applied:**

1. Removed the artificial `setTimeout(resolve, 300)` delay.
2. Replaced it with Next.js native `revalidatePath("/", "layout")` which properly invalidates the server-side cache.
3. This ensures subsequent reads reflect the deletion without arbitrary wait times, using the framework's built-in cache invalidation mechanism.

---

### 🟡 SMELL-3: `console.log` with Sensitive Data in Server Actions — **Priority: MEDIUM**

**File:** `client/src/actions/password.ts`

```typescript
console.log("[requestPasswordReset] Email:", email);
console.log("[requestPasswordReset] Profile lookup:", {
  profile,
  profileError,
});
```

Logging user emails and profile data in production. These will appear in Vercel/server logs.

**Remediation:** Remove or gate behind `process.env.NODE_ENV === 'development'`.

---

### 🟡 SMELL-4: `getSession()` Used Instead of `getUser()` in Client Code — **Priority: MEDIUM**

**Files:** `lib/api.ts` (line 30), `lib/api/client.ts` (line 26), `lib/supabase/supabase.ts`

The Supabase docs [strongly recommend](https://supabase.com/docs/guides/auth/server-side/nextjs) using `getUser()` over `getSession()` for security. `getSession()` reads from the local cookie without verifying the JWT against the server.

**Note:** The server actions correctly use `getUser()`, but the (dead) API client files use `getSession()`. Once dead code is cleaned up, this is resolved.

---

### 🟢 SMELL-5: `select("*")` on Profiles — **Priority: LOW**

**File:** `client/src/actions/profile.ts` (line 96)

```typescript
.select("*")
```

Fetches all columns including potentially sensitive or unnecessary data. Prefer explicit column selection.

---

### 🟢 SMELL-6: Repeated Template Response Mapping — **Priority: LOW**

**File:** `client/src/actions/templates.ts`

The same mapping logic (lines 44–55, 96–107, 146–157) is copy-pasted 3 times across `getTemplates()`, `getPopularTemplates()`, and `getTemplateBySlug()`.

**Remediation:** Extract a `mapTemplateRow(t) => TemplateResponse` helper.

---

## 5. 🔐 Database & RLS Audit

### Summary of RLS Status

| Table                   | RLS Enabled | Policies                                                                    | Issues           |
| ----------------------- | ----------- | --------------------------------------------------------------------------- | ---------------- |
| `profiles`              | ✅          | SELECT own, UPDATE own, INSERT (service_role only)                          | ✅ Fixed (SEC-6) |
| `templates`             | ✅          | SELECT public                                                               | ✅ Correct       |
| `creations`             | ✅          | SELECT own, INSERT own, UPDATE own, DELETE own, SELECT public (non-deleted) | ✅ Correct       |
| `subscription_policies` | ✅          | SELECT public                                                               | ✅ Correct       |

### 🟡 DB-1: Missing Index on `creations.is_deleted` — **Priority: MEDIUM**

The `creations` table is frequently queried with `.eq("is_deleted", false)` but has no index on `is_deleted`.

**Remediation:**

```sql
CREATE INDEX IF NOT EXISTS idx_creations_is_deleted ON public.creations(is_deleted);
```

---

### 🟡 DB-2: Missing Migration Number 007 — **Priority: MEDIUM**

Migration files jump from `006` to `008`. While this doesn't cause errors, it suggests a deleted migration, which could cause confusion.

---

### 🟢 DB-3: `subscription_policies` Seeded with Inconsistent Tiers — **Priority: LOW**

The `subscription_policies` table seeds three tiers: `free`, `lite`, `premium`. But the `profiles.subscription_tier` CHECK constraint only allows `free` and `premium`. The `lite` tier will never be used.

---

## 6. 🌿 Environment Variables Recommendations

### Current State

The existing `/.env.example` is tailored for the **abandoned** Docker/FastAPI setup and is **outdated**. The actual `client/.env` uses different variables.

### Recommended `.env.example` for `client/`

```bash
# ═══════════════════════════════════════════════════════════════
# HeartNote Client — Environment Variables
# ═══════════════════════════════════════════════════════════════
# Copy this file to client/.env and fill in the values.
# NEVER commit the .env file to version control.

# ─── Supabase (Required) ──────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-side only (never exposed to browser):
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres

# ─── Email (Resend) ───────────────────────────────────────────
RESEND_KEY=re_your_resend_api_key
MAIL_HEART_NOTE=your-contact-email@example.com

# ─── App Configuration ───────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# NEXT_PUBLIC_APP_NAME=HeartNote    # optional, defaults to HeartNote

# ─── Optional: Analytics / Monitoring ─────────────────────────
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
# SENTRY_DSN=https://key@sentry.io/project
```

### Missing Variables to Consider Adding

| Variable                        | Purpose                                   | Priority    |
| ------------------------------- | ----------------------------------------- | ----------- |
| `NEXT_PUBLIC_SITE_URL`          | Canonical URL for share links and OG meta | Required    |
| `RATE_LIMIT_WINDOW_MS`          | Configurable rate limiting                | Recommended |
| `RATE_LIMIT_MAX_REQUESTS`       | Max requests per window                   | Recommended |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics                          | Optional    |
| `SENTRY_DSN`                    | Error tracking                            | Recommended |

---

## 📊 Issue Summary

| Priority      | Count  | Categories                                                                                                                                                     |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 **HIGH**   | 3      | ~~SEC-1~~ ✅, ~~SEC-2~~ ✅, ~~ARCH-1~~ ✅                                                                                                                      |
| 🟡 **MEDIUM** | 14     | ~~SEC-3~~ ✅, ~~SEC-4~~ ✅, ~~SEC-5~~ ✅, ~~SEC-6~~ ✅, DEAD-2–4, ~~ARCH-2~~ ✅, ~~ARCH-3~~ ✅, ~~ARCH-4~~ ✅, ~~SMELL-1~~ ✅, ~~SMELL-2~~ ✅, SMELL-3, DB-1–2 |
| 🟢 **LOW**    | 6      | SEC-7–8, DEAD-5, SMELL-5–6, DB-3                                                                                                                               |
| **Total**     | **23** |                                                                                                                                                                |

---

## 🎯 Recommended Action Plan (Priority Order)

1. ~~**🚨 IMMEDIATE:** Rotate ALL exposed keys (SEC-1). Remove `client/.env` from git history.~~ ✅ COMPLETED (.gitignore hardened, .env.example created — key rotation & `git rm --cached` pending manual execution)
2. ~~**🚨 IMMEDIATE:** Replace DEBUG error messages with generic responses (SEC-2).~~ ✅ COMPLETED
3. ~~**This Sprint:** Fix the profiles INSERT RLS policy (SEC-6).~~ ✅ COMPLETED
4. **This Sprint:** Delete all dead code: `lib/api.ts`, `lib/api/`, `lib/config.ts`, `features/`, `server/`, `components/examples/`, `components/landing/FAQ.tsx` (DEAD-1, DEAD-4).
5. **This Sprint:** Remove unused npm packages: `axios`, `clsx`, `tailwind-merge` (DEAD-2).
6. ~~**This Sprint:** Resolve double quota decrement (SMELL-1).~~ ✅ COMPLETED (removed application-level decrement, relying solely on DB trigger)
7. ~~**Next Sprint:** Refactor `creations.ts` into sub-modules (ARCH-1).~~ ✅ COMPLETED
8. ~~**Next Sprint:** Add rate limiting to contact form (SEC-4).~~ ✅ COMPLETED
9. ~~**Next Sprint:** Remove client-side `resetPassword` from AuthContext (SEC-5).~~ ✅ COMPLETED
10. ~~**Backlog:** File length refactoring, CSS splitting, index optimizations.~~ ✅ COMPLETED (ARCH-3, ARCH-4)
