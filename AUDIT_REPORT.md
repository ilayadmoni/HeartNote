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

### 🔴 SEC-1: Production Secrets Committed to Repository — **Priority: HIGH**

**File:** `client/.env` (tracked in git)

The `.env` file in the `client/` directory contains **real production secrets** including:

| Secret                          | Exposed Value                                         |
| ------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIs…` (full JWT)                    |
| `SUPABASE_SERVICE_ROLE_KEY`     | `eyJhbGciOiJIUzI1NiIs…` (full JWT — **admin access**) |
| `DATABASE_URL`                  | Full Postgres connection string with password         |
| `RESEND_KEY`                    | `re_cKESENzK_…` (email API key)                       |

**Impact:** Anyone with repo access can impersonate an admin, read/write all database tables, send emails, or directly connect to the database.

**Remediation:**

1. **Immediately rotate** ALL keys in the Supabase Dashboard.
2. Verify `.gitignore` covers `client/.env` — currently `.gitignore` has `*.env` but only at root level. The `client/.env` may have been committed before the rule was added.
3. Run: `git rm --cached client/.env` then re-commit.
4. Audit git history for secrets: `git log --diff-filter=A -- client/.env`
5. Consider using a secrets scanner like `trufflehog` or `gitleaks` in CI.

---

### 🔴 SEC-2: DEBUG Error Messages Returned to Client — **Priority: HIGH**

**File:** `client/src/actions/password.ts` (lines 44, 64, 88, 112)

Error messages prefixed with `DEBUG` are returned directly to the end-user response:

```typescript
return { error: "DEBUG: SUPABASE_SERVICE_ROLE_KEY is missing from .env file" };
return { error: `DEBUG Profile lookup: ${profileError.message}` };
return { error: `DEBUG Counter update: ${updateError.message}` };
return { error: `DEBUG resetPasswordForEmail: ${resetError.message}` };
```

**Impact:** Leaks internal implementation details, database error messages, and configuration state to potentially malicious users. This is an information disclosure vulnerability.

**Remediation:** Replace DEBUG error messages with generic Hebrew error strings. Log the details server-side only.

---

### 🟡 SEC-3: XSS via HTML Email Template Injection — **Priority: MEDIUM**

**File:** `client/src/actions/contact.ts` (lines 42–78)

User-supplied values (`name`, `email`, `subject`, `message`) are directly interpolated into an HTML email template without sanitization:

```typescript
html: `<td>${name}</td>`; // ← unsanitized user input
```

While this is a backend-generated email (not rendered in browser DOM), some email clients do execute HTML/JS, making this an **email injection / phishing vector**.

**Remediation:** Escape HTML entities (`<`, `>`, `&`, `"`, `'`) before interpolation, or use a template library like `react-email`.

---

### 🟡 SEC-4: Contact Form Lacks Rate Limiting — **Priority: MEDIUM**

**File:** `client/src/actions/contact.ts`

The `sendContactEmail` action has no rate limiting. An attacker could call it in a loop to:

- Exhaust the Resend API quota.
- Flood the inbox with spam.
- Increase costs.

**Remediation:** Implement rate limiting via Supabase Edge Functions, Next.js middleware, or an in-memory store (e.g., `Map<IP, timestamp[]>` in server action).

---

### 🟡 SEC-5: Client-Side `resetPassword` Bypasses Server-Side Rate Limiting — **Priority: MEDIUM**

**File:** `client/src/contexts/AuthContext.tsx` (line 176–191)

`AuthContext.resetPassword()` calls `supabase.auth.resetPasswordForEmail()` **directly from the client** — completely bypassing the server-side 3-strike rate-limit logic implemented in `actions/password.ts`.

**Impact:** A user can bypass the rate limit by calling the Supabase API directly from the browser console.

**Remediation:** Remove the `resetPassword` function from `AuthContext` and ensure all password reset flows go through the server action `requestPasswordReset()`.

---

### 🟡 SEC-6: Profiles INSERT Policy is Too Permissive — **Priority: MEDIUM**

**File:** `supabase/migrations/005_destructive_reset.sql` (line 206–208)

```sql
CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);
```

This policy allows **any role** (including `anon`) to insert rows into `profiles`. The comment says "service-role" but the policy is missing `TO service_role`.

**Impact:** An unauthenticated user could insert arbitrary profile rows.

**Remediation:** Restrict to the appropriate role:

```sql
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

### 🟡 ARCH-3: Several Files Exceed 150-Line Rule — **Priority: MEDIUM**

| File                       | Lines | Exceeds By           |
| -------------------------- | ----- | -------------------- |
| `actions/creations.ts`     | 677   | 527 lines ⚠️         |
| `app/globals.css`          | 474   | 324 lines            |
| `contexts/AuthContext.tsx` | 283   | 133 lines            |
| `actions/profile.ts`       | 264   | 114 lines            |
| `hooks/useImageUpload.ts`  | 248   | 98 lines             |
| `lib/api/client.ts`        | 212   | 62 lines (also dead) |
| `actions/templates.ts`     | 167   | 17 lines             |
| `actions/password.ts`      | 161   | 11 lines             |

---

### 🟡 ARCH-4: Duplicate Migration Version Numbers — **Priority: MEDIUM**

**Files:** `supabase/migrations/015_password_change_trigger.sql` AND `015_password_reset_trigger.sql`

Two migration files share the same version number `015`. Both create the same `handle_password_change()` function and `on_password_change` trigger, but with subtly different implementations.

**Impact:** Non-deterministic migration order; potential data corruption if only one runs.

**Remediation:** Consolidate into a single `015_password_change_trigger.sql` with the latest logic. Delete the duplicate.

---

## 4. 🐛 Code Inefficiency & Smells

### 🟡 SMELL-1: Duplicate Quota Logic (Application ↔ Database Trigger) — **Priority: MEDIUM**

The creation quota is enforced in **two places simultaneously**:

1. **Application-level** in `actions/creations.ts` (Steps 5 & 8 of both `createCreation` and `submitGenericCreation`)
2. **Database-level** via the `trg_handle_new_creation_quota` trigger in `012_creation_quota_trigger.sql`

Both decrement the same counters, meaning:

- The application decrements (Step 8), then the trigger **also** decrements — resulting in **double-decrementing**.
- Or if either fails silently, quotas become inconsistent.

**Remediation:** Choose ONE enforcement point:

- **Recommended:** Trust the database trigger entirely. Remove application-level quota decrement (Step 8). Keep application-level quota _check_ (Step 5) only as a fast-fail guard.

---

### 🟡 SMELL-2: Artificial `setTimeout` for Read Consistency — **Priority: MEDIUM**

**File:** `client/src/actions/creations.ts` (line 386)

```typescript
await new Promise((resolve) => setTimeout(resolve, 300));
```

A 300ms `setTimeout` is used as a workaround for Supabase read-replica lag.

**Remediation:** Instead, use React Query's `invalidateQueries` with a `refetchType: 'all'` strategy, or call `router.refresh()` to trigger a server-side refetch.

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

| Table                   | RLS Enabled | Policies                                                                    | Issues                           |
| ----------------------- | ----------- | --------------------------------------------------------------------------- | -------------------------------- |
| `profiles`              | ✅          | SELECT own, UPDATE own, INSERT (any!)                                       | ⚠️ INSERT too permissive (SEC-6) |
| `templates`             | ✅          | SELECT public                                                               | ✅ Correct                       |
| `creations`             | ✅          | SELECT own, INSERT own, UPDATE own, DELETE own, SELECT public (non-deleted) | ✅ Correct                       |
| `subscription_policies` | ✅          | SELECT public                                                               | ✅ Correct                       |

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

| Priority      | Count  | Categories                                     |
| ------------- | ------ | ---------------------------------------------- |
| 🔴 **HIGH**   | 3      | SEC-1, SEC-2, ~~ARCH-1~~ ✅                     |
| 🟡 **MEDIUM** | 14     | SEC-3–6, DEAD-2–4, ~~ARCH-2~~ ✅, ARCH-3–4, SMELL-1–3, DB-1–2 |
| 🟢 **LOW**    | 6      | SEC-7–8, DEAD-5, SMELL-5–6, DB-3               |
| **Total**     | **23** |                                                |

---

## 🎯 Recommended Action Plan (Priority Order)

1. **🚨 IMMEDIATE:** Rotate ALL exposed keys (SEC-1). Remove `client/.env` from git history.
2. **🚨 IMMEDIATE:** Replace DEBUG error messages with generic responses (SEC-2).
3. **This Sprint:** Fix the profiles INSERT RLS policy (SEC-6).
4. **This Sprint:** Delete all dead code: `lib/api.ts`, `lib/api/`, `lib/config.ts`, `features/`, `server/`, `components/examples/`, `components/landing/FAQ.tsx` (DEAD-1, DEAD-4).
5. **This Sprint:** Remove unused npm packages: `axios`, `clsx`, `tailwind-merge` (DEAD-2).
6. **This Sprint:** Resolve double quota decrement (SMELL-1).
7. ~~**Next Sprint:** Refactor `creations.ts` into sub-modules (ARCH-1).~~ ✅ COMPLETED
8. **Next Sprint:** Add rate limiting to contact form (SEC-4).
9. **Next Sprint:** Remove client-side `resetPassword` from AuthContext (SEC-5).
10. **Backlog:** File length refactoring, CSS splitting, index optimizations.
