# HeartNote Code Conventions

All conventions below are derived from the existing codebase.

---

## Folder structure and path aliases

The Next.js app lives in `client/`. All `import` paths inside the app use `@/` which maps to `client/src/`:

```
@/actions/...       → src/actions/
@/components/...    → src/components/
@/hooks/...         → src/hooks/
@/lib/...           → src/lib/
@/types/...         → src/types/
@/contexts/...      → src/contexts/
@/constants/...     → src/constants/
```

Never use relative `../../` imports when `@/` works.

---

## Naming conventions

| Thing | Convention | Example |
|---|---|---|
| Server action function | `camelCase` verb + noun | `createCreation`, `deleteCreation`, `upgradeSubscription` |
| React component file | `PascalCase.tsx` or `camelCase.tsx` | `AuthContext.tsx`, `useServerAction.ts` |
| Component directories | `camelCase/` | `editor/`, `galleryTemplate/`, `cookieBanner/` |
| Action directories | `camelCase/` | `creations/`, `profile/`, `subscription/` |
| Zod schema | `PascalCase` + `Schema` suffix | `CreateCreationRequestSchema`, `ProfileUpdateSchema` |
| Zod inferred type | `PascalCase` + `Input` or `Response` | `CreateCreationInput`, `ProfileResponse` |
| Hook files | `use` + `PascalCase` | `useServerAction`, `useDashboard` |
| Util files | `kebab-case.ts` | `rate-limiter.ts`, `image-utils.ts` |
| Migration files | `YYYYMMDD_description.sql` | `20260416_add_lite_tier.sql` |

---

## Server action conventions

All authenticated server actions:
1. Start with `"use server"` directive
2. Wrap logic in `protectedAction()` from `@/lib/protectedAction`
3. Validate all input with Zod `.safeParse()` → throw `ActionError(msg, 422)` on failure
4. Return `ActionResult<T>` — success or failure, never throw to the client
5. Throw `ActionError(message, httpCode)` for business-logic errors
6. Call `validateOrigin()` at the top for any mutation (not reads)

See `docs/skills/how-to-add-server-action.md` for the full pattern.

---

## Soft delete pattern

**Never hard-delete creations.** Set `is_deleted = true`:

```typescript
await supabase
  .from("creations")
  .update({ is_deleted: true })
  .eq("id", creationId)
  .eq("user_id", user.id);
```

Queries that list user creations filter `is_deleted = false`. The dashboard reads soft-deleted items too (to show history) but marks them as deleted in the response. When reading a public shared link, `is_deleted = true` returns 410 Gone.

---

## PII-safe logging

**Never use `console.*` directly in server code.** Use `logger.*` from `@/lib/utils/logger`:

```typescript
import { logger } from "@/lib/utils/logger";

logger.debug("Details only in dev");   // suppressed in production
logger.info("User action", { data });  // suppressed in production
logger.warn("Suspicious request", { ip, origin }); // always logged, PII masked
logger.error("DB error", { error });   // always logged, PII masked
```

In production, `logger.warn` and `logger.error` automatically mask:
- Email addresses → `jo***@example.com`
- UUIDs → `abc12***-****-****-****-************`
- IPv4 addresses → `192.168.***.***`
- Israeli phone numbers → `050-***-****`
- Any field named `password`, `token`, `secret`, `key`, `authorization` → `[REDACTED]`

`logger.info` and `logger.debug` are suppressed entirely in production — do not put anything load-bearing behind them.

---

## CSRF validation

Call `validateOrigin()` at the top of any mutating server action (login, register, contact form, etc.):

```typescript
import { validateOrigin, csrfError } from "@/lib/utils/csrf";

export async function myAction(input: Input) {
  if (!await validateOrigin()) {
    return csrfError(); // { success: false, error: "...", code: 403 }
  }
  // ...
}
```

Allowed origins come from `NEXT_PUBLIC_SITE_URL` and the optional `ALLOWED_ORIGINS` env var (comma-separated). No localhost hardcoding. The validator **fails closed** — if no origins are configured, all cross-origin requests are rejected.

Read-only actions (e.g., `getTemplates`, `getDashboard`) do not require CSRF validation.

---

## Upstash rate limiting

Four pre-configured limiters are exported from `@/lib/utils/rate-limiter`:

| Export | Limit | Used in |
|---|---|---|
| `loginLimiter` | 5 req / 15 min / IP | `src/actions/auth.ts` |
| `registrationLimiter` | 3 req / 1 hr / IP | `src/actions/registration.ts` |
| `passwordResetLimiter` | 3 req / 15 min / IP | `src/actions/password.ts` |
| `contactLimiter` | 5 req / 1 min / IP | `src/actions/contact.ts` |

Usage pattern (identical across all actions):
```typescript
import { loginLimiter } from "@/lib/utils/rate-limiter";

const clientIp = await getClientIp(); // reads x-forwarded-for / x-real-ip / cf-connecting-ip
const result = await loginLimiter.check(clientIp);
if (!result.success) {
  return { error: "Too many attempts. Try again later." };
}
```

The limiter **fails closed** — if Redis is unavailable it denies the request (does not fall back to permissive). To add a new limiter:

```typescript
export const myLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 5 * 60 * 1000, // 5 minutes
  prefix: "my_action",       // unique Redis key prefix
});
```

Redis credentials: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env`. These are required — the app will throw at startup if missing.

---

## Supabase client variants

Four client variants exist — pick the right one for the context:

| Import | File | When to use |
|---|---|---|
| `createBrowserClient` | `@/lib/supabase/client.ts` | Client components, browser hooks (`useProfile`, `useAuth`) |
| `createClient` | `@/lib/supabase/server.ts` | Server components, server actions (default for `protectedAction`) |
| `createAdminClient` | `@/lib/supabase/admin.ts` | Bypasses RLS — admin ops only (ban check, subscription update) |
| `createMiddlewareClient` | `@/lib/supabase/middleware.ts` | `src/middleware.ts` only |

**Rules:**
- Never use `createAdminClient()` in client components or anywhere the response is sent directly to the browser
- The service role key is server-only — it is never in `NEXT_PUBLIC_*` variables
- `protectedAction` calls `createClient()` internally — do not create a second client inside the callback unless you need admin access
- The admin client is used in `registration.ts` (banned check), `auth.ts` (banned check), and `upgradeSubscription.ts` (profile update bypass)

---

## Error codes in use

| Code | Meaning | When to throw |
|---|---|---|
| 401 | Unauthorized | Handled by `protectedAction` automatically — do not throw manually |
| 402 | Payment Required | Free user attempts premium-only template |
| 403 | Forbidden | Quota exceeded, subscription expired |
| 404 | Not Found | Template, creation, or profile not found |
| 410 | Gone | Expired or deleted creation (public endpoint) |
| 422 | Unprocessable Entity | Zod validation failure, invalid input |
| 500 | Server Error | DB error, unexpected failure |

---

## Cache invalidation

Call `revalidatePath()` after mutations that affect cached pages:

```typescript
import { revalidatePath } from "next/cache";

// After deleting a creation:
revalidatePath("/", "layout");

// After updating a profile:
revalidatePath("/profile");
revalidatePath("/", "layout");
```

---

## TypeScript

- Strict mode is enabled — no `any` types
- Global types live in `src/types/index.ts`
- Zod-inferred types are preferred over manually written interfaces for validated data
- Cast DB row unknowns explicitly: `(row.field as string) ?? "default"`
