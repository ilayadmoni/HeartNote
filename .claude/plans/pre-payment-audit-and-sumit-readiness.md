# HeartNote — Pre-Payment Security & Sumit Readiness Plan

## Context

HeartNote is about to integrate the Sumit payment gateway (free → lite/premium upgrade). A read-only audit of `client/src/**` and `supabase/migrations/**` surfaced one **critical privilege-escalation bug** plus several smaller gaps that must be closed before payments go live. This plan captures the prioritized fixes, the missing webhook infrastructure to build, and an end-to-end verification checklist. No code changes have been made — this is the action plan.

---

## Critical Findings Summary

| # | Severity | Location | Issue |
|---|----------|----------|-------|
| CRIT-1 | CRITICAL | `client/src/actions/subscription/upgradeSubscription.ts` | Any authenticated user can call this server action directly and grant themselves `lite` / `premium` tier without any payment. Service-role admin client writes `subscription_tier`, `premium_start`, `premium_expiry`. The `NEXT_PUBLIC_ENABLE_UPGRADES` flag is **client-only** — server never checks it. |
| CRIT-2 | HIGH | same file | No `validateOrigin()` CSRF check, unlike every other mutating action in the codebase. |
| MED-1 | MEDIUM | `supabase/migrations/000_init.sql:70-71` | `subscription_tier` CHECK constraint allows only `('free','premium')` while app + seed data uses `'lite'`. May already be patched by a later migration — verify. |
| MED-2 | MEDIUM | `upgradeSubscription.ts` | No rate limiting. Combined with CRIT-1, attacker can flip tier repeatedly. |
| HIGH-2 | MEDIUM | DB column privileges on `profiles` | Authenticated role can UPDATE `profiles.subscription_tier` via RLS. Must be revoked at column level. Verify `20260423_c3_profiles_column_privileges.sql` already covers this. |
| SUMIT-* | BLOCKER | (does not exist yet) | No webhook endpoint, no HMAC verification, no idempotency table, no atomic upgrade RPC, no failure recovery. |

---

## Files to Modify / Create

### Modify
- `client/src/actions/subscription/upgradeSubscription.ts` — gate behind `PAYMENTS_ENABLED`, add `validateOrigin()`, eventually remove direct callability once webhook is live.
- `client/src/hooks/usePricingUpgrade.ts` — replace `upgradeSubscription()` call with `initiateCheckout()` that returns Sumit redirect URL; no tier flip on client.
- `client/src/app/(main)/pricing/page.tsx` — keep `NEXT_PUBLIC_ENABLE_UPGRADES` UI gate; rely on server gate for security.
- `client/.env.example` — add `PAYMENTS_ENABLED`, `SUMIT_WEBHOOK_SECRET`, `SUMIT_API_KEY` (server-only).

### Create (Sumit integration)
- `client/src/app/api/webhooks/sumit/route.ts` — POST handler; raw-body HMAC verify → parse → idempotency insert → call upgrade RPC → 200 / retry-on-5xx.
- `client/src/lib/sumit/verifySignature.ts` — `timingSafeEqual` HMAC-SHA256 over raw body.
- `client/src/lib/sumit/applyUpgrade.ts` — wraps `admin.rpc('apply_paid_upgrade', ...)`.
- `client/src/actions/subscription/initiateCheckout.ts` — replaces user-facing upgrade; returns Sumit checkout URL. Uses `protectedAction` + `validateOrigin()` + Upstash rate limit.
- `supabase/migrations/024_payment_events.sql` — `provider_event_id TEXT PK`, `user_id UUID`, `tier_code TEXT`, `amount_agorot INT`, `status TEXT`, `raw_payload JSONB`, `received_at TIMESTAMPTZ`. RLS: service-role only.
- `supabase/migrations/025_apply_paid_upgrade_rpc.sql` — `SECURITY DEFINER` function: single transaction → INSERT payment_event (idempotent via PK) + UPDATE profile tier/expiry.
- `supabase/migrations/026_subscription_tier_check_fix.sql` (only if MED-1 confirmed) — relax CHECK to `('free','lite','premium')`.
- `supabase/migrations/027_profile_columns_lockdown.sql` (only if HIGH-2 confirmed) — `REVOKE UPDATE (subscription_tier, premium_start, premium_expiry, additional_creation_free, additional_creation_pro) ON public.profiles FROM authenticated;`

### Delete / Review
- `system-prompt-senior-luminous-cook.md` (untracked stray) → DELETE.
- `framesApril.html`, `status.txt`, `Dockerfile`, `docker-compose.yml` → REVIEW_BEFORE_DELETE (Vercel-only deploy per CLAUDE.md).
- Historical planning docs at repo root (`*_plan.md`, `REFACTOR_BACKLOG.md`, `AUDIT_REPORT.md`, etc.) → REVIEW_BEFORE_DELETE.

---

## Reusable Utilities Already in the Codebase

- `client/src/lib/protectedAction.ts` — auth wrapper; reuse for `initiateCheckout`.
- `client/src/lib/utils/csrf.ts` (`validateOrigin`, `csrfError`) — apply to upgrade & checkout actions.
- `client/src/lib/utils/rate-limiter.ts` — Upstash factory; reuse for `initiateCheckout`.
- `client/src/lib/supabase/admin.ts` (`createAdminClient`) — only place that should escalate tiers (called from webhook handler).
- `client/src/lib/audit-logger.ts` (`logAudit`) — emit `subscription.purchased`, `subscription.payment_received`, `subscription.upgrade_failed`.
- `client/src/lib/subscription/checkAndDowngradeSubscription.ts` — already handles expiry auto-revoke; keep as the single downgrade path.
- `client/src/lib/action-response.ts` (`ActionError`, `ActionResult`, `ok`, `fail`) — standard return shape.

---

## Execution Order (Prioritized)

### Phase A — Stop the bleed (≤ 30 min, ship today)
1. Patch `upgradeSubscription.ts`:
   - Add `if (!(await validateOrigin())) throw new ActionError("Invalid origin", 403);`
   - Add `if (process.env.PAYMENTS_ENABLED !== "true") throw new ActionError("Upgrades disabled", 403);`
2. Set `PAYMENTS_ENABLED=false` in Vercel envs.
3. Verify `NEXT_PUBLIC_ENABLE_UPGRADES=false` in production.

### Phase B — DB hardening (1–2 h)
4. Confirm or write migration for CHECK constraint (`lite` allowed).
5. Confirm or write column-level REVOKE on `profiles` sensitive columns.

### Phase C — Sumit integration (8–12 h)
6. Migrations `024_payment_events` + `025_apply_paid_upgrade_rpc`.
7. `lib/sumit/verifySignature.ts` + `applyUpgrade.ts`.
8. `app/api/webhooks/sumit/route.ts`.
9. `actions/subscription/initiateCheckout.ts`.
10. Refactor `usePricingUpgrade.ts` to call `initiateCheckout` and redirect.
11. Remove `upgradeSubscription` from client bundle entirely.

### Phase D — Cleanup ✅ COMPLETED 2026-05-13
12. [x] Delete stray root files — deleted: `system-prompt-senior-luminous-cook.md`, `framesApril.html`, `status.txt`, `docker-compose.yml`, `client/Dockerfile`, `AUDIT_REPORT.md`, `templates_integration_plan.md`, `ui_ux_fixes_plan.md`.
13. [x] Add index — migration created: `supabase/migrations/20260513_add_premium_expiry_index.sql`.
14. [x] `react-joyride` — zero hits in `client/src`; uninstalled (16 packages removed, lockfile updated).

---

## Verification

### Phase A
- Signed-in free user attempts to invoke `upgradeSubscription` via React server-action transport → expect 403.
- `profiles` row unchanged.

### Phase B
- `psql`: inserting/updating tier `'lite'` succeeds.
- Authenticated user via Supabase JS attempts `update({ subscription_tier: 'premium' })` → permission-denied.

### Phase C
- Sumit sandbox checkout → webhook hits `/api/webhooks/sumit` → row in `payment_events` → `profiles.subscription_tier` flips to `premium`, `premium_expiry` ≈ now+14d.
- Replay same webhook payload → 200 OK, **no duplicate** `payment_events`, tier unchanged.
- Tampered signature → 401.
- Tampered body → 401.
- Timestamp older than 5 min → 401.
- Force RPC failure → endpoint returns 5xx; Sumit retries; no partial DB state.
- `getDashboard()` reflects new tier.
- `checkAndDowngradeSubscription` reverts tier after `premium_expiry`.

### Phase D ✅ COMPLETED 2026-05-13
- `npm run build` — ✅ compiled successfully, 23 static pages generated.
- `npm run type-check` — ✅ zero errors.
- `npx vitest` — not run (no test suite configured for affected code).

---

## Out of Scope

- Public-shared-link RLS policy `"Anyone can view non-deleted creations by id"` — intentional per product spec.
- `subscription_policies` memoization — minor optimization; tackle only if profiler flags it.
- Dashboard query shape — fine for current data volume.