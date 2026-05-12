# HeartNote — Security Audit Report

## Context

Rigorous security + business-logic audit of HeartNote (Next.js 14 + Supabase, freemium SaaS). Scope: subscription bypass, authN/Z, RLS, Next.js architecture, payment/state edge cases. Note: original prompt ended with `[הדבק את הקוד שלך כאן]` (placeholder); audit was performed against the actual repo at `D:\HeartNote`.

---

## Executive Summary

Overall posture is **mixed**: the app shows strong engineering hygiene (RLS enabled on all tables, service-role key correctly isolated, no committed `.env*` secrets, audit logging table, solid rate limiting on auth flows, Zod validation on most actions, CSRF origin checks on some mutations, `protectedAction` wrapper, server-side tier reads — client never trusts tier from storage).

However, the audit uncovered **two critical, economically-severe business-logic flaws that fully defeat the freemium model**, plus several high-severity database authorization gaps that let a malicious authenticated user write directly to `profiles.subscription_tier` / `creations.is_paid` / `creations.expires_at` / other sensitive columns via raw PostgREST, bypassing every server-action check. The combination means paid-tier gating cannot be enforced today.

**Blocker for production:** until findings C1, C2, C3, H1, H2 are fixed, any authenticated user can obtain unlimited premium behavior in under a minute.

---

## Critical & High Vulnerabilities

### C1 — Self-service premium upgrade with zero payment verification (CRITICAL)
**File:** `client/src/actions/subscription/upgradeSubscription.ts:13-79`

The `upgradeSubscription` server action is wrapped in `protectedAction` and accepts a `tierCode` ("lite" | "premium"), then uses the **admin (service-role) client** to directly `UPDATE profiles SET subscription_tier, premium_start, premium_expiry` for the calling user. **There is no Stripe session, webhook signature verification, PayPal IPN, invoice lookup, or any external payment proof.** No `validateOrigin()` (CSRF). No rate limit.

**Exploit:** Any free user calls the server action (Playwright/curl with their own session cookie) once with `{ tierCode: "premium" }` and immediately receives 45 days of premium + premium-template access. Repeatable. Silent. The audit log entry (`subscription.purchased`) is written as if legitimate.

**Impact:** Full bypass of monetization. Premium templates, no HeartNote branding, extended expiry — all free.

### C2 — `redeem_love_coupon` RPC has no ownership check (CRITICAL)
**File:** `supabase/migrations/022_*.sql:9-68`

`redeem_love_coupon(creation_id uuid, coupon_id text)` is declared `SECURITY DEFINER` and `GRANT EXECUTE … TO anon, authenticated`. Inside the function body the creation row is locked by `id` only — there is **no `auth.uid() = user_id` check**.

**Exploit:** Any authenticated (or even anonymous, given the `anon` grant) caller who knows or guesses a `creation.id` UUID can mutate coupon metadata on other users' cards (redeem, tamper with state). Creation IDs appear in public share links (`/p/[slug]`) and can be discovered.

**Impact:** Tampering with paid users' card content; data integrity loss on shared cards.

### C3 — Users can UPDATE their own `subscription_tier` / `is_blocked` / `premium_expiry` via RLS (CRITICAL)
**File:** `supabase/migrations/000_init.sql:375-379`

```sql
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

The policy has **no column-level restriction** and Postgres has no per-column `GRANT UPDATE` narrowing applied. A user can POST directly to PostgREST (`PATCH /rest/v1/profiles?id=eq.<me>`) with body `{ "subscription_tier": "premium", "premium_expiry": "2099-01-01", "is_blocked": false, "additional_creation_pro": 9999, "creations_count_free": 0 }`. The server-action layer that validates input (`profile/update.ts`) is **bypassed entirely** when the client talks to PostgREST directly using the anon key that's shipped to the browser.

**Impact:** Upgrade to premium, unblock self after ban, zero quota counter, grant bonus quota — all without touching the server action.

### H1 — `creations` INSERT/UPDATE policies allow forged `is_paid`, premium `template_id`, and arbitrary `expires_at` (HIGH)
**Files:** `000_init.sql:398-415` (INSERT WITH CHECK only validates `auth.uid() = user_id`), quota trigger `handle_new_creation_quota` is `BEFORE INSERT` only.

1. Free user inserts with `is_paid=true`, `template_id=<premium template UUID>`, `expires_at='2099-12-31'` — the trigger enforces quota count but not premium-template access, not `is_paid` honesty, not expiry ceiling.
2. Because the trigger is INSERT-only, a user can INSERT a cheap free-template row, then `UPDATE` it to swap in a premium `template_id` or flip `is_paid=true` — trigger never re-runs.

**Impact:** Access to premium templates without paying; creations that never expire; counter manipulation.

### H2 — Admin audit-query helper has no caller authorization (HIGH)
**File:** `client/src/lib/admin/audit-queries.ts:15-29` (`fetchUserAuditLogs`)

Marked `server-only`, uses `createAdminClient()` (service role) and accepts `userId` as a parameter. **No admin role check, no `auth.uid()` comparison.** If any route, page, or action ever calls `fetchUserAuditLogs(someUserId)` with an attacker-controlled value, arbitrary audit logs (PII-adjacent) leak.

### H3 — `updatePassword` server action missing CSRF origin check (HIGH)
**File:** `client/src/actions/password.ts:213` — destructive mutation (password change) without `validateOrigin()`. `requestPasswordReset` and `registerUser` correctly call it; this one does not. A victim loading a malicious site while authenticated could have their password rotated via a same-origin-looking fetch if any CORS/referrer leniency exists.

### H4 — `upgradeSubscription`, `updateMyProfile`, `createCreation`, `submitGenericCreation` all lack `validateOrigin()` (HIGH)
Every state-changing server action should enforce origin. Currently only a subset does. Combined with C1 this means the premium upgrade can be CSRF-triggered from any page.

### H5 — Missing `Content-Security-Policy` header (HIGH)
`client/next.config.js` sets `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy` — but **no CSP**. Given the app renders user-supplied metadata (card content) and loads GTM, this is a meaningful XSS uplift risk.

---

## Business Logic Flaws

- **BL1 — Premium status is fully client-reachable state (C1+C3 combined):** two independent paths to "premium" without payment.
- **BL2 — `is_paid` column is self-asserted:** `is_paid` is set by the server action from `profile.subscription_tier`, but the DB does not verify that server assertion — a direct PostgREST INSERT can claim `is_paid=true` regardless of actual tier (H1).
- **BL3 — Quota counters trust profile mutability (C3):** quota trigger reads `creations_count_free` and `subscription_tier` from `profiles`, but those columns are user-writable via RLS → reset counter to 0, enjoy infinite free creations.
- **BL4 — Premium downgrade check is lazy, not scheduled:** `checkAndDowngradeSubscription` runs only on creation actions; a premium user whose `premium_expiry` has passed retains `subscription_tier='premium'` in the DB until they next create. Public reads (share links, profile) may reflect stale premium state. Acceptable risk but worth noting.
- **BL5 — `additional_creation_free` / `additional_creation_pro` are user-writable (C3):** same RLS policy allows a free user to grant themselves unlimited bonus quota.
- **BL6 — Unauthenticated users can walk into `/create/[templateId]`:** middleware does not gate it. Acceptable only because the `createCreation` server action authenticates via `protectedAction`. Confirm no client-only path issues premium content before submit.

---

## Medium & Low Risks

- **M1 — Rate limiting gaps:** `upgradeSubscription`, `createCreation`, `submitGenericCreation`, `updateMyProfile`, `deleteMyAccount` lack Upstash limiters. At minimum, `upgradeSubscription` needs one (1/day) independent of fixing C1.
- **M2 — `deleteMyAccount` has no confirmation/reauth token** (`profile/delete.ts`) — a CSRF on this path wipes the account. CSRF is validated, but adding password re-entry is prudent.
- **M3 — `banned_users` / `password_reset_attempts` grants:** migration `020_security_rls_fixes.sql` revokes prior grants and adds deny policies. Verify in production with `SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name IN ('banned_users','password_reset_attempts');` — revoke was inside error-catching blocks.
- **M4 — OAuth draft flow (`oauthDraft.ts`)** relies on Supabase's default OAuth `state`. Confirm the callback verifies it and that the draft cookie is `sameSite=lax`, `httpOnly`, short-lived (already `maxAge: 600`, `httpOnly: true` per the exploration).
- **L1 — No GDPR retention policy on `audit_logs`** (acknowledged in `AUDIT_LOGGING_IMPLEMENTATION.md`).
- **L2 — `updatePassword` has no Zod schema** — minimum-length check done inline; formalize with `PasswordSchema`.
- **L3 — Creation IDs are UUIDv4 (unguessable), but share `slug` scheme should be confirmed non-sequential.**

---

## Actionable Remediation Plan

### Fix C1 — Require real payment before upgrade

Replace `upgradeSubscription` with a webhook-driven flow. Keep a client-initiated action that creates a Stripe Checkout Session; mutate `profiles` only from the webhook handler after signature verification.

```ts
// client/src/actions/subscription/createCheckoutSession.ts
"use server";
import Stripe from "stripe";
import { protectedAction } from "@/lib/protectedAction";
import { validateOrigin } from "@/lib/utils/csrf";
import { upgradeLimiter } from "@/lib/utils/rate-limiter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function createCheckoutSession(input: { tierCode: "lite" | "premium" }) {
  await validateOrigin();
  return protectedAction(async (user) => {
    const { success } = await upgradeLimiter.limit(user.id);
    if (!success) throw new ActionError("Too many attempts", 429);

    const priceId = input.tierCode === "premium" ? process.env.STRIPE_PRICE_PREMIUM! : process.env.STRIPE_PRICE_LITE!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      metadata: { user_id: user.id, tier_code: input.tierCode },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/profile?upgraded=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });
    return { url: session.url };
  });
}
```

```ts
// client/src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new NextResponse("bad signature", { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const userId = s.metadata?.user_id;
    const tier = s.metadata?.tier_code;
    if (!userId || !tier) return NextResponse.json({ received: true });
    const admin = createAdminClient();
    const { data: policy } = await admin.from("subscription_policies").select("default_expiry").eq("tier_code", tier).single();
    const expiry = new Date(Date.now() + (policy!.default_expiry * 1000)).toISOString();
    await admin.from("profiles").update({
      subscription_tier: tier, premium_start: new Date().toISOString(), premium_expiry: expiry,
    }).eq("id", userId);
    // write audit log with stripe event id for idempotency
  }
  return NextResponse.json({ received: true });
}
```

Delete the direct-mutation path in `upgradeSubscription.ts`. Idempotency: store `stripe_event_id` unique on `audit_logs` and short-circuit duplicates.

### Fix C2 — Add ownership check to `redeem_love_coupon`

```sql
-- supabase/migrations/024_fix_redeem_ownership.sql
CREATE OR REPLACE FUNCTION public.redeem_love_coupon(p_creation_id uuid, p_coupon_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_owner uuid; v_row creations%ROWTYPE;
BEGIN
  SELECT user_id INTO v_owner FROM creations WHERE id = p_creation_id FOR UPDATE;
  IF v_owner IS NULL THEN RAISE EXCEPTION 'not_found'; END IF;
  IF v_owner <> auth.uid() THEN RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501'; END IF;
  -- … existing redeem logic …
END $$;
REVOKE EXECUTE ON FUNCTION public.redeem_love_coupon(uuid, text) FROM anon;
GRANT   EXECUTE ON FUNCTION public.redeem_love_coupon(uuid, text) TO authenticated;
```

If coupon redemption is supposed to be done by *recipients* (not card owner), replace the `auth.uid() = owner` check with a share-token check passed in as the second argument and verified against a hashed column.

### Fix C3 + H1 — Lock down `profiles` and `creations` writable columns

Two complementary mechanisms:

**(a) Column-level GRANTs** (PostgREST honors these):
```sql
-- supabase/migrations/025_lock_sensitive_columns.sql
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT  UPDATE (first_name, last_name, date_of_birth, avatar_url, email)
       ON public.profiles TO authenticated;

REVOKE UPDATE ON public.creations FROM authenticated;
GRANT  UPDATE (metadata, is_deleted)
       ON public.creations TO authenticated;
-- INSERT: template_id, is_paid, expires_at must come from server-side trigger defaults, not user input
```

**(b) Override forged INSERT values in the BEFORE INSERT trigger** (`handle_new_creation_quota`):
```sql
-- inside trigger, before quota math
IF (SELECT is_premium FROM templates WHERE id = NEW.template_id) AND v_tier = 'free' THEN
  RAISE EXCEPTION 'premium_template_requires_paid_tier' USING ERRCODE = '42501';
END IF;
NEW.is_paid := (v_tier <> 'free');                          -- server-authoritative
NEW.expires_at := now() + make_interval(secs => v_policy_expiry);  -- server-authoritative
```

Add a BEFORE UPDATE trigger on `creations` that blocks changes to `template_id`, `is_paid`, `expires_at`, `user_id`:
```sql
CREATE OR REPLACE FUNCTION public.freeze_creation_invariants() RETURNS trigger AS $$
BEGIN
  IF NEW.template_id <> OLD.template_id OR NEW.is_paid <> OLD.is_paid
     OR NEW.expires_at <> OLD.expires_at OR NEW.user_id <> OLD.user_id
  THEN RAISE EXCEPTION 'immutable_field' USING ERRCODE = '42501'; END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER trg_freeze_creation_invariants BEFORE UPDATE ON public.creations
  FOR EACH ROW EXECUTE FUNCTION public.freeze_creation_invariants();
```

### Fix H2 — Guard `fetchUserAuditLogs`

```ts
// client/src/lib/admin/audit-queries.ts
export async function fetchUserAuditLogs(requestingUserId: string, targetUserId: string) {
  if (requestingUserId !== targetUserId && !(await isAdmin(requestingUserId))) {
    throw new ActionError("forbidden", 403);
  }
  // …
}
```
And grep all call sites to ensure the caller passes the authenticated user, never a client-supplied value.

### Fix H3 + H4 — CSRF everywhere

Add to the top of every mutating server action:
```ts
import { validateOrigin } from "@/lib/utils/csrf";
// …
export async function updatePassword(input: UpdatePasswordInput) {
  await validateOrigin();
  return protectedAction(async (user) => { /* … */ });
}
```
Apply to: `updatePassword`, `updateMyProfile`, `createCreation`, `submitGenericCreation`, any new `createCheckoutSession`.

### Fix H5 — Add CSP header

`client/next.config.js`:
```js
{ key: "Content-Security-Policy", value: [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://api.dicebear.com",
  "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'"
].join("; ") }
```
Tune `script-src` once GTM/analytics inline-script needs are known; prefer nonces over `'unsafe-inline'` long-term.

### Fix M1 — Rate-limit sensitive actions

```ts
// client/src/lib/utils/rate-limiter.ts
export const upgradeLimiter = createRateLimiter({ prefix: "upgrade", requests: 3, window: "1 h" });
export const creationLimiter = createRateLimiter({ prefix: "create", requests: 20, window: "1 h" });
export const profileLimiter = createRateLimiter({ prefix: "profile", requests: 10, window: "5 m" });
```

---

## Verification Plan

After each fix:

1. **C1 (payment):** attempt `POST /api/server-action` calling `upgradeSubscription` with a valid session — expect 404/removed. Stripe test-mode checkout → webhook → confirm `profiles.subscription_tier` flips only on `checkout.session.completed`. Replay the webhook with the same event id → verify idempotency (no duplicate audit rows).
2. **C2 (coupon):** with user A's session, call `rpc('redeem_love_coupon', { p_creation_id: <user B's creation>, … })` → expect `42501 forbidden`.
3. **C3 / H1 (PostgREST direct):** as an authenticated user, `PATCH /rest/v1/profiles?id=eq.<me>` with `{"subscription_tier":"premium"}` → expect 403 / column-not-updatable. Same for `creations` direct `PATCH` changing `template_id` or `is_paid`. INSERT a creation with `is_paid:true` → confirm DB row has `is_paid=false` (trigger override) for free user. INSERT with a premium template as free user → expect exception.
4. **H2:** unit test `fetchUserAuditLogs(A, B)` with A ≠ B, A not admin → throws 403.
5. **H3/H4 (CSRF):** craft a cross-origin POST to each action → expect `validateOrigin` rejection.
6. **H5 (CSP):** curl response headers, confirm `Content-Security-Policy` present; click through app pages, check browser console for CSP violations.
7. **Regression:** `npm run type-check`, `npm run lint`, `npx vitest` in `client/`, plus a manual run of signup → complete-profile → create free card → attempt premium card → upgrade via Stripe test mode → create premium card.

## Critical Files To Modify

- `client/src/actions/subscription/upgradeSubscription.ts` (gut / replace)
- `client/src/app/api/stripe/webhook/route.ts` (new)
- `client/src/actions/subscription/createCheckoutSession.ts` (new)
- `client/src/actions/password.ts:213` (+ `validateOrigin`)
- `client/src/actions/profile/update.ts:23` (+ `validateOrigin`)
- `client/src/actions/creations/create.ts:59`, `client/src/actions/creations/submit.ts:70` (+ `validateOrigin`, rate limit)
- `client/src/lib/admin/audit-queries.ts:15` (+ authorization)
- `client/src/lib/utils/rate-limiter.ts` (new limiters)
- `client/next.config.js` (+ CSP header)
- `supabase/migrations/024_fix_redeem_ownership.sql` (new)
- `supabase/migrations/025_lock_sensitive_columns.sql` (new — column grants + freeze trigger + is_premium/is_paid/expires_at enforcement in `handle_new_creation_quota`)
