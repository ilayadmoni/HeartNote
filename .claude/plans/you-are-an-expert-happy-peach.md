# Plan: Audit Logging System for HeartNote

## Context

HeartNote has no centralized audit trail today. Sensitive user lifecycle events (signups, password-reset requests, self-deletions, profile edits, creations, upgrades) are only captured ad-hoc via `logger.warn/error` to stdout, which is PII-masked and ephemeral. For compliance, fraud investigation, and support workflows we need a durable per-user log stored in Supabase with RLS-protected read access.

Deliverable when we exit plan mode: a single ready-to-implement markdown file at **`D:\HeartNote\AUDIT_LOGGING_IMPLEMENTATION.md`** plus the SQL/TS files it references. This plan specifies the full content of that doc and where each integration call must land.

---

## Key findings from exploration (authoritative references)

- Migrations authoritative at `supabase/migrations/`, next free number is **`023`** (last sequenced is `022_love_coupons_redeem_rpc.sql`; there is also a date-named `20260419_add_wedding_glass.sql`). Use `023_audit_logs.sql`.
- Schema conventions:
  - UUID PKs via `gen_random_uuid()` (used in templates/creations); `BIGSERIAL` only for rate-limit style tables.
  - Timestamps: `TIMESTAMPTZ DEFAULT NOW()` for audit columns (matches `banned_users`, `password_reset_attempts`).
  - IPs historically stored as `INET` in `password_reset_attempts`. User spec requests `text` — we will use `text` to accept "unknown" sentinel already produced by `getClientIp()` helpers (see `registration.ts:57`, `password.ts:65`) without type casts.
  - Index naming: `idx_{table}_{cols}`.
  - RLS pattern: `ENABLE ROW LEVEL SECURITY`, then named policies. Sensitive tables add explicit DENY-all to authenticated/anon (see `020_security_rls_fixes.sql:129`).
- Service-role client: `client/src/lib/supabase/admin.ts` → `createAdminClient()` (server-only, bypasses RLS).
- Existing PII-safe logger: `client/src/lib/utils/logger.ts` — reuse `logger.error` for fallback when audit insert fails.
- `protectedAction` (`client/src/lib/protectedAction.ts`) provides `(user, supabase)` with verified `user.id` / `user.email`.
- `headers()` is available in every server action; IP is extracted via a local `getClientIp()` helper already present in `registration.ts` and `password.ts` — we will factor this to `client/src/lib/utils/request-meta.ts` and also capture `user-agent`.

### Confirmed integration points

| Event | File | Function | Insert after line | Notes |
|---|---|---|---|---|
| `user.registered` | `client/src/actions/registration.ts` | `registerUser` | after `signUp()` success, before line 256 `return { success: GENERIC_SUCCESS }` | `user_id` IS available: `signUp` returns `data.user.id`. If null (email confirmation pending) log with `user_id = null` + email in metadata. |
| `user.password_reset_requested` | `client/src/actions/password.ts` | `requestPasswordReset` | before line 195 return | unauthenticated — `user_id` nullable; store email + `attempts` in metadata |
| `user.account_deleted` | `client/src/actions/profile/delete.ts` | `deleteMyAccount` | after `admin.auth.admin.deleteUser` success (line ~73), **before** `signOut` | log with `user_id = user.id` while it still exists (FK `ON DELETE SET NULL` preserves row) |
| `user.profile_updated` | `client/src/actions/profile/update.ts` | `updateMyProfile` | after `.update()` success (line ~49), before `fetchProfileInternal` call | metadata = `{ changed_fields: Object.keys(updateDict) }` |
| `user.name_changed` | same file | same function | emitted conditionally when `updateDict.first_name` or `updateDict.last_name` present | metadata = `{ first_name?, last_name? }` (new values only; no old values to avoid leaking history) |
| `creation.created` | `client/src/actions/creations/create.ts` + `client/src/actions/creations/submit.ts` | `createCreation` / `submitGenericCreation` | after `.insert().select().single()` success (create.ts ~line 180; submit.ts ~line 245) | metadata = `{ creation_id, template_id, template_slug, is_paid, applied_quota }` |
| `subscription.purchased` | `client/src/actions/subscription/upgradeSubscription.ts` | `upgradeSubscription` | after `.update()` success (line ~57), before return | metadata = `{ tier_code, premium_start, premium_expiry }` |

---

## File changes

### 1. New migration — `supabase/migrations/023_audit_logs.sql`

```sql
-- 023_audit_logs.sql — Append-only audit trail for sensitive user events
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type  TEXT        NOT NULL,
    metadata    JSONB       NOT NULL DEFAULT '{}'::jsonb,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT audit_logs_event_type_check CHECK (event_type IN (
        'user.registered',
        'user.password_reset_requested',
        'user.account_deleted',
        'user.profile_updated',
        'user.name_changed',
        'creation.created',
        'subscription.purchased'
    ))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created
    ON public.audit_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_created
    ON public.audit_logs (event_type, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read only their own logs
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Block all client-side writes; service role bypasses RLS
CREATE POLICY "No client writes to audit_logs"
    ON public.audit_logs FOR INSERT
    TO authenticated, anon
    WITH CHECK (false);

CREATE POLICY "No client updates to audit_logs"
    ON public.audit_logs FOR UPDATE
    TO authenticated, anon
    USING (false) WITH CHECK (false);

CREATE POLICY "No client deletes from audit_logs"
    ON public.audit_logs FOR DELETE
    TO authenticated, anon
    USING (false);
```

### 2. New utility — `client/src/lib/utils/request-meta.ts`

Factor the duplicated `getClientIp()` into a single helper and add `getUserAgent()`. Keep the existing inline copies intact in `registration.ts` / `password.ts` or replace them — either is fine; replace for cleanliness.

```ts
import "server-only";
import { headers } from "next/headers";

export async function getRequestMeta(): Promise<{ ip: string; userAgent: string | null }> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}
```

### 3. New logger — `client/src/lib/audit-logger.ts`

```ts
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/utils/logger";
import { getRequestMeta } from "@/lib/utils/request-meta";

export type AuditEventType =
  | "user.registered"
  | "user.password_reset_requested"
  | "user.account_deleted"
  | "user.profile_updated"
  | "user.name_changed"
  | "creation.created"
  | "subscription.purchased";

export interface AuditInput {
  eventType: AuditEventType;
  userId?: string | null;
  metadata?: Record<string, unknown>;
  captureRequest?: boolean; // default true — pulls ip/ua from headers()
}

export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const { eventType, userId = null, metadata = {}, captureRequest = true } = input;
    const meta = captureRequest ? await getRequestMeta() : { ip: null, userAgent: null };
    const admin = createAdminClient();
    const { error } = await admin.from("audit_logs").insert({
      user_id: userId,
      event_type: eventType,
      metadata,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    });
    if (error) logger.error("[audit] insert failed", { eventType, code: error.code });
  } catch (e) {
    // Never throw — audit must not break the business action
    logger.error("[audit] unexpected failure", { error: e instanceof Error ? e.message : String(e) });
  }
}
```

### 4. Integration call sites

Each call is fire-and-forget (awaited but wrapped in logger's internal try/catch). Exact snippets:

**registration.ts** (after successful `signUp`):
```ts
await logAudit({
  eventType: "user.registered",
  userId: signUpData?.user?.id ?? null,
  metadata: { email: trimmedEmail, first_name: firstName, last_name: lastName },
});
```

**password.ts** (before line 195 return; after successful `resetPasswordForEmail`):
```ts
await logAudit({
  eventType: "user.password_reset_requested",
  userId: null,
  metadata: { email, attempts },
});
```

**profile/delete.ts** (after `admin.auth.admin.deleteUser` success, before `signOut`):
```ts
await logAudit({
  eventType: "user.account_deleted",
  userId: user.id,
  metadata: { email: user.email ?? null, reason: "self_deletion" },
});
```

**profile/update.ts** (after `.update()` success):
```ts
const changed = Object.keys(updateDict);
await logAudit({
  eventType: "user.profile_updated",
  userId: user.id,
  metadata: { changed_fields: changed },
});
if (updateDict.first_name !== undefined || updateDict.last_name !== undefined) {
  await logAudit({
    eventType: "user.name_changed",
    userId: user.id,
    metadata: {
      first_name: updateDict.first_name,
      last_name: updateDict.last_name,
    },
  });
}
```

**creations/create.ts** (after `.insert().select().single()`):
```ts
await logAudit({
  eventType: "creation.created",
  userId: user.id,
  metadata: {
    creation_id: creation.id,
    template_id: template.id,
    template_slug: template.slug,
    is_paid: isPremiumBehavior,
    applied_quota: appliedQuota,
  },
});
```

**creations/submit.ts** — identical shape, using its own `creation`/`template` locals.

**subscription/upgradeSubscription.ts** (after `.update()` success):
```ts
await logAudit({
  eventType: "subscription.purchased",
  userId: user.id,
  metadata: {
    tier_code: tierCode,
    premium_start: premiumStart,
    premium_expiry: premiumExpiry,
  },
});
```

### 5. Admin query helper (optional) — inside `AUDIT_LOGGING_IMPLEMENTATION.md` only

```ts
import { createAdminClient } from "@/lib/supabase/admin";
export async function fetchUserAuditLogs(userId: string, limit = 100) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("audit_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
```

### 6. Deliverable doc — `D:\HeartNote\AUDIT_LOGGING_IMPLEMENTATION.md`

Sections (per user request):
1. Overview
2. Database Migration (full SQL from §1)
3. TypeScript Logger Utility (full `lib/audit-logger.ts` from §3 + request-meta helper from §2)
4. Integration Guide (filled table + snippets from §4)
5. Admin Query (SQL + TS from §5)
6. RLS Policies (SQL block — already included in §1; repeat standalone for clarity)
7. Notes & Assumptions:
   - `ip_address` is `text` (not `INET`) to accept the `"unknown"` sentinel used by `getClientIp()`.
   - `subscription_tier` check constraint currently omits `'lite'` — we still log the raw `tier_code` from the policy row, so this is tolerant to schema drift.
   - Registration may produce `user_id = null` when Supabase email confirmation is enabled; email lives in metadata for correlation.
   - Profile update emits TWO events when names change (`profile_updated` + `name_changed`); consumers should de-dup by `(id, created_at)` if needed.
   - Logger never throws; failures are surfaced via `logger.error` only.
   - No `user_agent` retention policy baked in — consider a GDPR retention job (out of scope).

---

## Verification

1. **DB**: apply migration via Supabase MCP (`apply_migration` with name `023_audit_logs`), then `list_tables` to confirm + `get_advisors` for any RLS warnings.
2. **Typecheck**: `cd client && npm run type-check`.
3. **Unit smoke**: from a dev session, trigger each flow (register new user → request password reset → update profile → create a card → upgrade subscription → delete account) and run:
   ```sql
   select event_type, user_id, metadata, created_at
   from audit_logs order by created_at desc limit 20;
   ```
   Expect one row per action with correct `event_type` and populated `metadata`.
4. **RLS**: while logged in as user A, `supabase.from('audit_logs').select('*')` → only A's rows. As anon → zero rows. Insert via anon → denied.

---

## Critical files

- New: `supabase/migrations/023_audit_logs.sql`
- New: `client/src/lib/audit-logger.ts`
- New: `client/src/lib/utils/request-meta.ts`
- Edit: `client/src/actions/registration.ts`
- Edit: `client/src/actions/password.ts`
- Edit: `client/src/actions/profile/delete.ts`
- Edit: `client/src/actions/profile/update.ts`
- Edit: `client/src/actions/creations/create.ts`
- Edit: `client/src/actions/creations/submit.ts`
- Edit: `client/src/actions/subscription/upgradeSubscription.ts`
- New deliverable: `D:\HeartNote\AUDIT_LOGGING_IMPLEMENTATION.md`
