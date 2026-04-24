# Audit Logging — Implementation Guide

## Overview

Introduces a durable, append-only audit trail for sensitive user-lifecycle events in HeartNote. A new `public.audit_logs` table captures signup, password-reset requests, account self-deletion, profile/name changes, creation authoring, and subscription purchases. Writes go through a server-only logger (`client/src/lib/audit-logger.ts`) that uses the Supabase service-role client to bypass RLS. Reads are gated by RLS so each user can only see their own rows; the service role remains the only path for admin/support queries.

Design choices worth flagging up front:
- `ip_address` is `TEXT` (not `INET`) so the existing `"unknown"` sentinel from `getClientIp()` inserts without a cast.
- The logger never throws. A failed insert is reported through the PII-masked `logger.error` and the business action continues.
- For the one unauthenticated event where the new user's id is not yet known (`user.registered` with email-confirmation pending), `user_id` is `NULL` and the email is stored in `metadata`. The FK uses `ON DELETE SET NULL` so self-deleted accounts retain their historical audit trail.

---

## Database Migration

Create `supabase/migrations/023_audit_logs.sql`:

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

CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

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

Apply via the Supabase MCP `apply_migration` tool with name `023_audit_logs`, or commit and let the CI migration runner pick it up.

---

## TypeScript Logger Utility

### 1. Request metadata helper

Create `client/src/lib/utils/request-meta.ts` (extracts the duplicated `getClientIp()` pattern already present in `registration.ts:57` and `password.ts:65`, and also captures the `User-Agent`):

```ts
import "server-only";
import { headers } from "next/headers";

export interface RequestMeta {
  ip: string;
  userAgent: string | null;
}

export async function getRequestMeta(): Promise<RequestMeta> {
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

### 2. Audit logger

Create `client/src/lib/audit-logger.ts`:

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
  /** default true — pulls IP + UA from Next.js headers() */
  captureRequest?: boolean;
}

export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const {
      eventType,
      userId = null,
      metadata = {},
      captureRequest = true,
    } = input;

    const meta = captureRequest
      ? await getRequestMeta()
      : { ip: null, userAgent: null };

    const admin = createAdminClient();
    const { error } = await admin.from("audit_logs").insert({
      user_id: userId,
      event_type: eventType,
      metadata,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    });

    if (error) {
      logger.error("[audit] insert failed", {
        eventType,
        code: error.code,
        message: error.message,
      });
    }
  } catch (e) {
    // Never throw — audit must not break the business action
    logger.error("[audit] unexpected failure", {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
```

Properties:
- Fully typed `AuditEventType` union matches the SQL `CHECK` constraint.
- Safe for Server Actions and Route Handlers (`import "server-only"` prevents bundling into client chunks).
- Swallows all errors; surfaces failures through the existing PII-masking logger.
- Uses the service-role client (`createAdminClient`) exclusively, so RLS never blocks writes.

---

## Integration Guide

For each event, add the `logAudit(...)` call at the marked "insert after" location. All locations are after the business-critical DB write succeeds so a failed log never rolls back real work.

| Event | File | Function | Insert Point |
|---|---|---|---|
| `user.registered` | `client/src/actions/registration.ts` | `registerUser` | after the `supabase.auth.signUp()` success path, immediately before `return { success: GENERIC_SUCCESS }` (~line 256) |
| `user.password_reset_requested` | `client/src/actions/password.ts` | `requestPasswordReset` | after `resetPasswordForEmail()` succeeds, before the final `return { success: GENERIC_SUCCESS }` (~line 195) |
| `user.account_deleted` | `client/src/actions/profile/delete.ts` | `deleteMyAccount` | after `admin.auth.admin.deleteUser(user.id)` resolves successfully (~line 73), **before** `signOut()` runs |
| `user.profile_updated` | `client/src/actions/profile/update.ts` | `updateMyProfile` | after the `supabase.from("profiles").update(updateDict)` success (~line 49) |
| `user.name_changed` | `client/src/actions/profile/update.ts` | `updateMyProfile` | same spot, emitted conditionally when `updateDict.first_name` or `updateDict.last_name` is defined |
| `creation.created` | `client/src/actions/creations/create.ts` | `createCreation` | after `.insert(...).select("id, expires_at").single()` succeeds (~line 180) |
| `creation.created` | `client/src/actions/creations/submit.ts` | `submitGenericCreation` | after the equivalent insert (~line 245) |
| `subscription.purchased` | `client/src/actions/subscription/upgradeSubscription.ts` | `upgradeSubscription` | after `.update(...)` resolves successfully (~line 57), before the return |

### Code snippets

Add the import once per file:

```ts
import { logAudit } from "@/lib/audit-logger";
```

**`registration.ts` — `registerUser`** (after successful `signUp`):
```ts
await logAudit({
  eventType: "user.registered",
  userId: signUpData?.user?.id ?? null,
  metadata: {
    email: trimmedEmail,
    first_name: firstName,
    last_name: lastName,
  },
});
```

**`password.ts` — `requestPasswordReset`** (before the success return):
```ts
await logAudit({
  eventType: "user.password_reset_requested",
  userId: null,
  metadata: { email, attempts },
});
```

**`profile/delete.ts` — `deleteMyAccount`** (after auth user deletion, before `signOut`):
```ts
await logAudit({
  eventType: "user.account_deleted",
  userId: user.id,
  metadata: {
    email: user.email ?? null,
    reason: "self_deletion",
  },
});
```

**`profile/update.ts` — `updateMyProfile`** (after `.update()` succeeds):
```ts
const changedFields = Object.keys(updateDict);

await logAudit({
  eventType: "user.profile_updated",
  userId: user.id,
  metadata: { changed_fields: changedFields },
});

if (
  updateDict.first_name !== undefined ||
  updateDict.last_name !== undefined
) {
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

**`creations/create.ts` — `createCreation`** (after insert/select success):
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

**`creations/submit.ts` — `submitGenericCreation`** (after insert success; same shape, use local `creation`/`template` bindings):
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

**`subscription/upgradeSubscription.ts` — `upgradeSubscription`** (after tier `.update()` success):
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

---

## Admin Query

### SQL

```sql
SELECT id, user_id, event_type, metadata, ip_address, user_agent, created_at
FROM public.audit_logs
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 100;
```

### TypeScript helper

Place in an admin-only module (e.g., `client/src/lib/admin/audit-queries.ts`). Must be called from a server-authenticated admin path — the service-role client bypasses RLS.

```ts
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuditEventType } from "@/lib/audit-logger";

export interface AuditLogRow {
  id: string;
  user_id: string | null;
  event_type: AuditEventType;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export async function fetchUserAuditLogs(
  userId: string,
  limit = 100,
): Promise<AuditLogRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("audit_logs")
    .select("id, user_id, event_type, metadata, ip_address, user_agent, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as AuditLogRow[];
}
```

---

## RLS Policies

Included in the migration above and reproduced here for standalone review:

```sql
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users see only their own rows
CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Deny all client-side mutations; writes happen via service-role only
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

This mirrors the deny-pattern already used for `password_reset_attempts` in `020_security_rls_fixes.sql`.

---

## Notes & Assumptions

- **`ip_address` is `TEXT`, not `INET`.** The existing `getClientIp()` helpers return the literal `"unknown"` when no forwarding header is present, which `INET` would reject. Using `TEXT` is the lowest-friction choice; downstream tooling can cast as needed.
- **`user_id` may be `NULL` for `user.registered`.** When Supabase email confirmation is enabled, `signUp()` returns `data.user = null` on first call (the user row is created but not yet confirmed). The email lives in `metadata` for correlation. The FK uses `ON DELETE SET NULL` so audit rows survive future account deletion.
- **`user.profile_updated` + `user.name_changed` can both fire from one action.** Consumers that want unique "profile touched" events should filter on `event_type = 'user.profile_updated'` only; the name event is an additional, narrower signal for name-change workflows.
- **`subscription_tier` enum mismatch.** The `profiles.subscription_tier` CHECK constraint currently lists only `'free'` and `'premium'`, while `subscription_policies.tier_code` also contains `'lite'`. We log the raw `tier_code` so audits remain correct across any future schema realignment.
- **Logger is fire-and-forget by design.** It `await`s the insert (so you get sequential ordering within a request and the IP/UA header read completes), but every failure path is caught and routed to `logger.error`. No audit failure can block a user's registration, upgrade, or deletion.
- **Service-role only writes.** The deny-all write policies mean that if `createAdminClient()` is ever misconfigured (missing `SUPABASE_SERVICE_ROLE_KEY`), audit inserts will fail loudly in `logger.error`. Monitor for `[audit] insert failed` in production logs.
- **Retention / GDPR.** No automatic TTL has been defined. A scheduled job or `pg_cron` task to prune rows older than N days (and a user-initiated purge on account deletion, if required by policy) is out of scope here.
- **Rate-limit / abuse coupling.** `password.ts` already inserts into `password_reset_attempts` for rate limiting. `audit_logs` is the durable event record and intentionally duplicates some of that signal — do not conflate the two tables.
- **Next migration number is `023`.** If a competing migration lands first, bump to the next free integer and rename the file accordingly.

---

## Verification Checklist

1. **Apply migration:** run `023_audit_logs.sql` via Supabase MCP (`apply_migration`) or your migration runner. Confirm with `list_tables` and review `get_advisors` for RLS warnings.
2. **Typecheck:** `cd client && npm run type-check`.
3. **Smoke test each integration point** (ideally a fresh test account):
   - Register → row with `event_type = 'user.registered'`.
   - Request password reset → row with `event_type = 'user.password_reset_requested'`.
   - Update profile (change first name) → **two** rows: `user.profile_updated` + `user.name_changed`.
   - Create a card → `creation.created` with `template_slug` populated.
   - Upgrade subscription → `subscription.purchased` with `tier_code`.
   - Delete account → `user.account_deleted` (row persists after auth user deletion thanks to `ON DELETE SET NULL`).
4. **RLS check:**
   - As user A: `supabase.from('audit_logs').select('*')` returns only A's rows.
   - As anon: returns zero rows.
   - As any client attempting insert: denied.
5. **Query the table:**
   ```sql
   SELECT event_type, user_id, metadata, created_at
   FROM audit_logs
   ORDER BY created_at DESC
   LIMIT 20;
   ```
