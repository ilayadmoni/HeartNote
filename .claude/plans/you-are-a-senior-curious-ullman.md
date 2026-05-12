# Technical Design Document — Love Coupons Persistent Redemption

## Context

The `LoveCoupons` template currently tracks redemption in local React state only (`useCoupons` hook). If the recipient refreshes the public page at `/p/[slug]`, every coupon reappears as un‑redeemed. A stub `redeemCoupon` server action at `client/src/actions/creations/redeem.ts` already exists and `useCoupons` already calls it when a `creationId` is passed — but **nothing ever passes `creationId`** (neither `LoveCouponsDesktop` nor `LoveCouponsMobile` forward it, and `TemplateRenderer` has no concept of it). The result: the persistence path is dead code and the UX leaks "single‑use" semantics.

This plan wires up real persistence, hardens the server action against double‑redemption and abuse, and adds the confirmation modal the product needs so the recipient can't redeem by accident.

It deliberately **keeps the JSONB‑in‑`creations.metadata` shape** rather than introducing a new `coupons` table (see trade‑off below). The entire redemption domain is already modelled that way — every other interactive template (ScratchCard, SteamyWindow, etc.) stores user‑facing state inside `metadata`.

---

## 1. DB Schema — Decision & Migration

### Options considered

| Option | Pros | Cons |
|---|---|---|
| **A. JSONB array inside `creations.metadata.coupons[]`** (current shape) | Zero schema churn; one row to fetch; RLS already configured on `creations`; atomic update via single `UPDATE`; consistent with every other template. | Can't UPDATE a single nested field with column‑level RLS — update policy must gate the **whole `metadata` column**. Requires a server‑side JSONPath update to avoid clobber. |
| **B. Separate `coupons` table, FK → `creations(id)`** | Column‑level RLS on `is_redeemed` possible; per‑row audit trail; simpler constraints (`UNIQUE(creation_id, coupon_index)`). | Requires migration of existing rows; breaks the metadata‑driven template pattern; extra join on read; `templates.config_schema` loses ownership of coupon shape. |

**Recommendation: Option A (JSONB).** It matches the existing pattern in `CLAUDE.md` ("Metadata validated dynamically against `template.config_schema`") and every other template. Column‑level write safety is achieved in the server action (service‑role path with explicit field merge) rather than by splitting storage.

### Migration — `supabase/migrations/022_love_coupons_redeem_rpc.sql`

Add a **Postgres function** so redemption is atomic and enforced at the DB layer. This is the key defence against double‑redemption and against an attacker replaying a stale `metadata` blob.

```sql
-- 022_love_coupons_redeem_rpc.sql
-- Atomic single-coupon redemption for the LoveCoupons template.
-- SECURITY DEFINER so it can UPDATE past the (restrictive) RLS policy on creations.
-- Returns the updated coupon row or NULL if already redeemed / not found.

create or replace function public.redeem_love_coupon(
  p_creation_id uuid,
  p_coupon_id   uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupons     jsonb;
  v_idx         int;
  v_coupon      jsonb;
  v_updated     jsonb;
begin
  -- Lock the row to prevent concurrent redemptions racing on the same coupon.
  select metadata -> 'coupons'
    into v_coupons
    from creations
   where id = p_creation_id
     and is_deleted = false
   for update;

  if v_coupons is null then
    return null;                                           -- creation not found / deleted
  end if;

  -- Find coupon index
  select ord - 1
    into v_idx
    from jsonb_array_elements(v_coupons) with ordinality as t(val, ord)
   where val ->> 'id' = p_coupon_id::text;

  if v_idx is null then
    return null;                                           -- coupon not in array
  end if;

  v_coupon := v_coupons -> v_idx;

  if coalesce((v_coupon ->> 'isRedeemed')::boolean, false) then
    return null;                                           -- already redeemed → caller treats as 409
  end if;

  v_updated := v_coupon
             || jsonb_build_object(
                  'isRedeemed', true,
                  'redeemedAt', to_char(now() at time zone 'utc',
                                        'YYYY-MM-DD"T"HH24:MI:SS"Z"')
                );

  update creations
     set metadata = jsonb_set(metadata, array['coupons', v_idx::text], v_updated, false)
   where id = p_creation_id;

  return v_updated;
end;
$$;

-- Allow the anon + authenticated roles to call the RPC. Service-role already can.
grant execute on function public.redeem_love_coupon(uuid, uuid) to anon, authenticated;
```

### RLS policies (no new tables, reuse `creations`)

`creations` already has RLS. Since recipients are **unauthenticated**, direct table UPDATE from the public client must remain forbidden. The `SECURITY DEFINER` RPC above is the **only** write path for recipients. Confirm the existing restrictive UPDATE policy on `creations` is intact — if any permissive policy was ever added for anon users, remove it.

```sql
-- Sanity audit (not a migration step; run via MCP to confirm)
-- Expected: only owner (user_id = auth.uid()) can UPDATE; no anon UPDATE policy.
select policyname, cmd, roles, qual, with_check
  from pg_policies
 where schemaname = 'public' and tablename = 'creations';
```

---

## 2. Server Action — `redeemCouponAction`

Rewrites the existing stub at `client/src/actions/creations/redeem.ts` to call the RPC instead of read‑modify‑write. This closes the TOCTOU gap the current implementation has (two coupons redeemed simultaneously can clobber each other).

**Conforms to project conventions** (`CLAUDE.md`): Zod input, `ActionResult<T>` return shape via `ok()`/`fail()` helpers from `src/lib/action-response.ts`, PII‑safe logging via `logger`, `validateOrigin()` from `src/lib/utils/csrf.ts` (since this is a mutating action), Upstash rate‑limit factory to cap abuse by IP.

```typescript
// client/src/actions/creations/redeem.ts
"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ok, fail, type ActionResult } from "@/lib/action-response";
import { validateOrigin } from "@/lib/utils/csrf";
import { createRateLimiter } from "@/lib/utils/rate-limiter";
import { logger } from "@/lib/utils/logger";

const RedeemSchema = z.object({
  creationId: z.string().uuid(),
  couponId:   z.string().uuid(),
});

// 10 redemptions / minute / IP — generous for a legit recipient, tight for scripted abuse.
const redeemLimiter = createRateLimiter("redeem-coupon", { requests: 10, window: "1 m" });

export interface RedeemedCoupon {
  id: string;
  isRedeemed: true;
  redeemedAt: string;
}

export async function redeemCouponAction(
  creationId: string,
  couponId: string,
): Promise<ActionResult<RedeemedCoupon>> {
  try {
    if (!(await validateOrigin())) return fail("Invalid origin", 403);

    const parsed = RedeemSchema.safeParse({ creationId, couponId });
    if (!parsed.success) return fail("Invalid input", 400);

    const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await redeemLimiter.limit(ip);
    if (!success) return fail("Too many requests", 429);

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("redeem_love_coupon", {
      p_creation_id: parsed.data.creationId,
      p_coupon_id:   parsed.data.couponId,
    });

    if (error) {
      logger.error("[redeemCouponAction] RPC failed", { error: error.message });
      return fail("Failed to redeem coupon", 500);
    }

    // RPC returns NULL on not-found OR already-redeemed. We surface 409 so the
    // client can distinguish from "truly missing" if ever needed — for now both
    // are indistinguishable to the recipient, which is fine.
    if (data === null) return fail("Coupon unavailable", 409);

    return ok(data as RedeemedCoupon);
  } catch (e) {
    logger.error("[redeemCouponAction] Unexpected", { error: e });
    return fail("Failed to redeem coupon", 500);
  }
}
```

**Breaking change**: the old `redeemCoupon(creationId, couponId)` export is renamed to `redeemCouponAction` and the return shape becomes `ActionResult<RedeemedCoupon>` instead of the ad‑hoc `{ success }|{ error, status }`. One caller (`useCoupons.ts`) updates.

---

## 3. Frontend — Confirmation Modal + Optimistic Hook

### 3.1 New component: `CouponRedeemModal`

One shared modal used by both Desktop and Mobile (matches the `SteamyWindow/ConfirmationModal` pattern already in the tree). Framer‑Motion `AnimatePresence`, backdrop fade, panel scale+fade, RTL‑aware layout.

**File**: `client/src/components/templates/LoveCoupons/components/CouponRedeemModal.tsx`

```tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  couponTitle: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  primaryColor?: string;
}

export function CouponRedeemModal({ open, couponTitle, isSubmitting, onConfirm, onCancel, primaryColor }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={isSubmitting ? undefined : onCancel}
          role="dialog" aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-right text-hebrew-body"
          >
            <h2 className="text-lg font-bold mb-2 text-hebrew-heading">מימוש קופון</h2>
            <p className="mb-1 font-semibold">{couponTitle}</p>
            <p className="mb-6 text-sm text-gray-600">
              האם את/ה בטוח/ה? פעולה זו אינה ניתנת לביטול.
            </p>
            <div className="flex gap-3 justify-start">
              <button
                onClick={onConfirm}
                disabled={isSubmitting}
                style={primaryColor ? { backgroundColor: primaryColor } : undefined}
                className="px-5 py-2 rounded-lg text-white bg-rose-500 disabled:opacity-60 inline-flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                ממש
              </button>
              <button onClick={onCancel} disabled={isSubmitting} className="px-5 py-2 rounded-lg bg-gray-100">
                ביטול
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

Barrel‑export from `LoveCoupons/components/index.ts`.

### 3.2 `useCoupons` rewrite — optimistic update + rollback

**File**: `client/src/components/templates/LoveCoupons/hooks/useCoupons.ts`

Responsibilities:
- Hold coupon array state + currently‑pending coupon id + global `isSubmitting` flag.
- `requestRedeem(couponId)` → opens modal (does NOT mutate state yet).
- `confirmRedeem()` → optimistically flip the coupon to redeemed, call server action, roll back on failure, show toast.
- `cancelRedeem()` → closes modal.
- `handleReset()` → edit‑mode only, local only (no persistence: reset is an authoring convenience, not a recipient action).

```ts
// Shape (pseudo-code)
export function useCoupons(initial: LoveCoupon[], creationId?: string) {
  const [coupons, setCoupons] = useState(initial);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setCoupons(initial), [initial]);   // editor live-preview sync

  const requestRedeem = (id: string) => setPendingId(id);
  const cancelRedeem  = () => { if (!isSubmitting) setPendingId(null); };

  const confirmRedeem = async () => {
    if (!pendingId) return;
    const id = pendingId;
    const snapshot = coupons;

    // Optimistic
    setCoupons(prev => prev.map(c =>
      c.id === id ? { ...c, isRedeemed: true, redeemedAt: new Date().toISOString() } : c));

    // Editor mode → no persistence, just close
    if (!creationId) { setPendingId(null); return; }

    setIsSubmitting(true);
    const result = await redeemCouponAction(creationId, id);
    setIsSubmitting(false);
    setPendingId(null);

    if (!result.success) {
      setCoupons(snapshot);                          // rollback
      toast.error(result.code === 409 ? "הקופון כבר מומש" : "שגיאה במימוש");
    }
  };

  const handleReset = () => setCoupons(prev =>
    prev.map(c => ({ ...c, isRedeemed: false, redeemedAt: undefined })));

  const pendingCoupon = coupons.find(c => c.id === pendingId) ?? null;

  return { coupons, pendingCoupon, isSubmitting, requestRedeem, confirmRedeem, cancelRedeem, handleReset };
}
```

### 3.3 Desktop & Mobile wiring

Both layouts need two small changes:

1. **Accept `creationId` prop** — extend `CouponsViewProps` in `types/index.ts`:
   ```ts
   export interface CouponsViewProps {
     data: LoveCouponsData;
     creationId?: string;
   }
   ```
2. **Pass `creationId` from the public viewer.** `LoveCoupons.tsx` forwards it; `TemplateRenderer`/the public `client.tsx` needs to pass it in (see §4).
3. **Hook up modal + change `CouponCard`'s `onRedeem` from direct `handleRedeem` to `requestRedeem`.**
4. **Reset button guard — already correct** (`!isCreateRoute`). The JSX block is DOM‑removed in production, not merely hidden, which meets the requirement.

Rendered structure per layout:
```tsx
const { coupons, pendingCoupon, isSubmitting, requestRedeem, confirmRedeem, cancelRedeem, handleReset }
  = useCoupons(data.coupons, creationId);
// ...
<CouponCard ... onRedeem={requestRedeem} />
<CouponRedeemModal
  open={!!pendingCoupon}
  couponTitle={pendingCoupon?.title ?? ""}
  isSubmitting={isSubmitting}
  onConfirm={confirmRedeem}
  onCancel={cancelRedeem}
  primaryColor={primaryColor}
/>
```

---

## 4. Threading `creationId` through the viewer

`src/app/(public)/p/[slug]/client.tsx` → `UserPageClient` already fetches the creation on the server and has its id. Currently it passes only `templateKey`, `contentData`, `isPaid` to `TemplateRenderer`. Add `creationId` to the props and forward it.

`TemplateRenderer` is generic across templates, so pass `creationId` as an **optional** extra prop that each template may accept. Only `LoveCoupons` will consume it today; other templates ignore it. The `AnyTemplateComponent` signature in `registry.ts` already uses `{ data: any }` — widen to `{ data: any; creationId?: string }`.

Editor route (`/create/[templateId]`) does **not** pass `creationId` → hook stays purely local → reset button remains functional for authoring.

---

## 5. Security Considerations

| Vector | Mitigation |
|---|---|
| Double‑redemption race (two tabs, two taps) | `FOR UPDATE` row lock in the RPC; idempotent "already redeemed → NULL → 409" path. |
| Direct UPDATE from anon client bypassing the action | No permissive anon UPDATE policy on `creations`; all writes go through `SECURITY DEFINER` RPC that only flips `isRedeemed`/`redeemedAt` and nothing else. |
| Metadata clobber (old code did read‑modify‑write of the whole `metadata` column) | RPC uses `jsonb_set` on the specific array index — other fields (`title`, `primaryColor`, unrelated coupons) are never rewritten. |
| Enumeration / scripted mass‑redeem across many cards | Upstash rate‑limit 10/min/IP on the server action + UUID‑only inputs (no guessable integer IDs). |
| CSRF | `validateOrigin()` on the action (matches every other mutating action in the codebase per `CLAUDE.md`). |
| Unauthorized reset in production | `!isCreateRoute` gate *removes the button from the DOM*, and there is no server endpoint for "reset" — even if the button were re‑injected client‑side, the server would reject (RPC only sets to `true`). |
| Invalid/forged coupon IDs | Zod UUID validation in action + RPC verifies the id exists inside the creation's own coupon array. |

---

## Files to Modify / Create

**Create**
- `supabase/migrations/022_love_coupons_redeem_rpc.sql` — the RPC + grants.
- `client/src/components/templates/LoveCoupons/components/CouponRedeemModal.tsx`.

**Modify**
- `client/src/actions/creations/redeem.ts` — rewrite to use RPC, conform to `ActionResult<T>`, add origin check + rate limit.
- `client/src/actions/creations/index.ts` — rename export.
- `client/src/components/templates/LoveCoupons/types/index.ts` — add `creationId?` to `CouponsViewProps`.
- `client/src/components/templates/LoveCoupons/hooks/useCoupons.ts` — optimistic + modal state + rollback.
- `client/src/components/templates/LoveCoupons/LoveCoupons.tsx` — forward `creationId`.
- `client/src/components/templates/LoveCoupons/Desktop/LoveCouponsDesktop.tsx` — wire modal, accept `creationId`.
- `client/src/components/templates/LoveCoupons/Mobile/LoveCouponsMobile.tsx` — same.
- `client/src/components/templates/LoveCoupons/components/index.ts` — export modal.
- `client/src/components/templates/registry.ts` — widen `AnyTemplateComponent` to include optional `creationId`.
- `client/src/app/(public)/p/[slug]/client.tsx` — pass `creationId` into `TemplateRenderer`.
- (If `TemplateRenderer` itself normalises props) `client/src/components/templates/index.ts` — pass through.

**Reuse (do not reinvent)**
- `ok()` / `fail()` / `ActionResult<T>` from `client/src/lib/action-response.ts`.
- `validateOrigin()` from `client/src/lib/utils/csrf.ts`.
- `createRateLimiter` from `client/src/lib/utils/rate-limiter.ts`.
- `logger` from `client/src/lib/utils/logger.ts`.
- Modal animation idioms from `client/src/components/templates/SteamyWindow/components/ConfirmationModal.tsx`.

---

## Verification

1. **DB** — apply migration via Supabase MCP; `select pg_get_functiondef('public.redeem_love_coupon'::regproc);` returns the body. Run `list_migrations` to confirm 022 is present.
2. **RLS audit** — `list advisors` / query `pg_policies` to confirm no anon UPDATE policy leaked onto `creations`.
3. **Happy path** — `cd client && npm run dev`; author a LoveCoupons creation, open the share link in an incognito window, redeem one coupon, refresh — stamp persists. Redeem a second in the original window — stamp still there.
4. **Confirmation modal** — clicking "ממש" opens modal; "ביטול" closes without mutation; confirm shows spinner until RPC resolves.
5. **Double‑redeem** — in DevTools, call `redeemCouponAction(id, id)` twice rapidly; second call returns `{ success:false, code:409 }`; UI shows toast and leaves state redeemed (no rollback flicker on the already‑redeemed coupon).
6. **Edit mode** — in `/create/love-coupons`, reset button renders and works; modal still gates individual redemptions but no network call is made (verify in Network tab); inspect DOM on public `/p/[slug]` and confirm the reset `<button>` is absent entirely.
7. **Rate limit** — script 15 rapid redeem calls; 11th+ returns 429.
8. **Typecheck & lint** — `npm run type-check && npm run lint`.
9. **Tests** — `npx vitest run` (add a hook test: optimistic flip + rollback on `{ success:false }`).
