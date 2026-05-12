# HeartNote — Technical Debt & Evolution Report

**Audit scope:** `d:\HeartNote\client\src` + `supabase\migrations`
**Architecture:** Next.js 14 App Router + Supabase + TanStack Query
**Date:** 2026-05-04

---

## Context

HeartNote is a Hebrew-language SaaS card-creation platform with three subscription tiers and ~17 interactive templates. The codebase is functional and ships — auth, RLS, server-action ergonomics (`ActionResult`/`protectedAction`), CSRF, rate limiting, and PII-safe logging are all in place. This audit is forward-looking: the goal is to flag debt that will compound as templates and the billing surface grow, before it becomes load-bearing.

---

## 1. Executive Summary

**Overall health: B-.** The foundations (auth, RLS, validation primitives, rate limiting, logging hygiene) are well-built. The pain is concentrated in three places:

1. **Component sprawl.** 80+ files exceed 150 lines; the worst offenders ([LoginModal.tsx](client/src/components/auth/components/LoginModal.tsx) at 1047 lines, [configs.ts](client/src/components/editor/configs.ts) at 657, [MorePreviews.tsx](client/src/components/galleryTemplate/components/MorePreviews.tsx) at 550) bundle unrelated concerns and are the main risk to maintainability.
2. **Data-layer fragmentation.** The `profiles` table is fetched through three independent hooks ([useProfile](client/src/hooks/useProfile.ts), [useProfileQuery](client/src/hooks/useProfileQuery.ts), [useUser](client/src/hooks/useUser.ts)) plus [useDashboard](client/src/hooks/useDashboard.ts). Caches don't share keys; initial render makes redundant round-trips.
3. **Billing is a stub.** [upgradeSubscription.ts](client/src/actions/subscription/upgradeSubscription.ts) flips `subscription_tier` directly with no payment processor, no webhook, no external subscription ID, no SDK in `package.json`. This is fine for an MVP but is a hard blocker for monetization.

Accessibility motion-control is 70% complete — the toggle and `prefers-reduced-motion` listeners exist in [AccessibilityProvider.tsx](client/src/components/accessibility/) but most Framer Motion components don't subscribe. Error handling is functional but inconsistent (mix of `console.*` and `logger.*` in the same actions). Validation is solid for typed RPCs but FormData paths in `auth.ts`/`registration.ts`/`contact.ts` bypass Zod in favor of inline regex.

---

## 2. Actionable Checklist

### Domain 1 — Modularization (150-line rule)

- [x] Split [LoginModal.tsx:1047](client/src/components/auth/components/LoginModal.tsx) — extracted `useAuthModalState` hook + `LoginForm.tsx`, `CompleteProfileStep.tsx` siblings. ✅ 2026-05-04
- [x] Split [configs.ts:657](client/src/components/editor/configs.ts) into `configs/<templateFamily>.ts` files, re-export from index. ✅ 2026-05-04
- [x] Break [MorePreviews.tsx:550](client/src/components/galleryTemplate/components/MorePreviews.tsx) into one file per preview under `galleryTemplate/previews/`. ✅ 2026-05-04
- [x] Extract `useBrandCalendar` + `MonthYearSelector` + `CalendarDayGrid` + `MobileNativeDateInput` from [BrandCalendar.tsx:497](client/src/components/ui/BrandCalendar.tsx). ✅ 2026-05-04
- [x] Merge near-duplicate EditorMobile/EditorDesktop — extracted `useEditorState`, `useEditorModals`, `FieldRenderer`; device files keep only layout. ✅ 2026-05-04
- [x] Extract `useWheelAnimation` and `wheelDrawing.ts` canvas utility from [WheelCanvas.tsx:409](client/src/components/templates/DecisionWheel/components/WheelCanvas.tsx). ✅ 2026-05-04
- [x] Move 79 remaining 150+ line files to tracked refactor backlog (`REFACTOR_BACKLOG.md`). ✅ 2026-05-05

### Domain 2 — Dead code & magic values

- [x] Confirm and delete unused [LiveRegion.tsx](client/src/components/accessibility/components/LiveRegion.tsx) (exported but never rendered). ✅ 2026-05-09
- [x] Remove hardcoded fallback `tierCode === "free" ? 3 : null` in [quotaCheck.ts](client/src/actions/creations/helpers/quotaCheck.ts) — now throws `ActionError(500)` if policy row is missing. ✅ 2026-05-09
- [x] Remove default expiry fallbacks (`free=1`, `paid=14`) from [expiryCalc.ts](client/src/actions/creations/helpers/expiryCalc.ts) — now throws if `free_days`/`paid_days` is missing from policy. ✅ 2026-05-09
- [x] Hardcoded `10000` redemption code range extracted to `REDEMPTION_CODE_MAX` env var in `create.ts` and `helpers/persistCreation.ts`. ✅ 2026-05-09
- [x] Hardcoded `1` free-day fallback in [EditorDesktop.tsx](client/src/components/editor/Desktop/EditorDesktop.tsx) — removed, now reads from policy. ✅ 2026-05-09

### Domain 3 — Folder structure

- [x] Promote 9 component-local `hooks/` folders into the global [src/hooks/](client/src/hooks/): ✅ 2026-05-09
  - `useCookieConsent.ts`
  - `useHeader.ts`
  - `usePasswordResetModal.ts`
  - `usePricingUpgrade.ts`
  - `useDeleteCreation.ts`
  - `useCoupons.ts`
  - `useQuiz.ts`
  - `useTheme.ts`
  - `useWelcomeSplash.ts`
- [x] Import paths updated across all callers. ✅ 2026-05-09

### Domain 4 — Validation & error handling

- [x] Standardize on `logger.*` only — `console.log`/`console.error` removed from `create.ts`, `redeem.ts`, `submit.ts`, `read.ts`, `auth.ts`, `contact.ts`, `registration.ts`. ✅ 2026-05-09
- [x] `console.warn` in [InitialLoader.tsx](client/src/components/initialLoader/InitialLoader.tsx) is intentional and correct — the call lives inside an inline `<script>` string executed in the browser before React loads; `logger.ts` is a server/Node module that cannot be imported there. ✅ 2026-05-09
- [x] Migrate [getCreation()](client/src/actions/creations/read.ts) to `protectedAction` — return shape matches `ActionResult` and `useServerAction`'s 401 handler triggers correctly. ✅ 2026-05-09
- [x] Replace `as Record<string, any>` in [draftActions.ts](client/src/actions/draftActions.ts) with Zod-validated draft schema (`GuestDraftMetadataSchema`). ✅ 2026-05-09
- [x] Move FormData validation from inline regex in [auth.ts](client/src/actions/auth.ts), [contact.ts](client/src/actions/contact.ts), [registration.ts](client/src/actions/registration.ts) into Zod schemas under `lib/validations/`. ✅ 2026-05-09

### Domain 5 — Performance & data strategy

- [x] Consolidate the three profile hooks — [useProfile](client/src/hooks/useProfile.ts) and [useUser](client/src/hooks/useUser.ts) rewritten as thin selectors over `useProfileQuery`. ✅ 2026-05-09
- [x] Configure [QueryProvider.tsx](client/src/providers/QueryProvider.tsx): `gcTime: 30 * 60 * 1000`, `refetchOnWindowFocus: false`, `refetchOnReconnect: true`. ✅ 2026-05-09
- [x] Combine `subscription_policies` queries into a single `.in('tier_code', tierCodes)` call in [create.ts](client/src/actions/creations/create.ts). ✅ 2026-05-09
- [x] Prefetch profile + active templates in `(main)/layout.tsx` with `dehydrate`/`HydrationBoundary` — eliminates login-render waterfall. ✅ 2026-05-09

### Domain 6 — Accessibility & motion

- [x] Created `MotionGuard` wrapper using `MotionConfig` + `useReducedMotion()`; added at root in `app/layout.tsx` — all Framer Motion components now honor the toggle globally. ✅ 2026-05-09
- [x] Wrap `ActiveSubscriptionWarningModal` in `FocusTrap`. ✅ 2026-05-09
- [x] Add programmatic initial focus to all `role="dialog"` modals: `TemplateInfoModal` (close button ref), `UpgradeSlideOver` (close button ref), `CouponRedeemModal` (cancel button ref), `ImageCropperModal` (`autoFocus` on cancel button), `BrandCalendar` (focuses first button in popup). Cookie banners (`aria-modal="false"`) and `WelcomeSplash` (auto-dismissing, no interactive content) are intentionally excluded. ✅ 2026-05-09
- [x] Add `aria-label` on `WheelCanvas` canvas element (Hebrew description of wheel options). ✅ 2026-05-09
- [x] Strengthen stop-animations CSS rule — now covers Framer Motion inline styles, CSS variables, and `will-change` (`accessibility.css` updated). ✅ 2026-05-09

### Domain 7 — Billing readiness

This is a **net-new build**, not a refactor. Provider-agnostic outline below; concrete Stripe gaps:

- [ ] Add deps: `stripe`, `@stripe/stripe-js`.
- [ ] DB migration: add `stripe_customer_id`, `stripe_subscription_id`, `billing_email`, `next_billing_date`, `payment_status` columns to `profiles`; add `webhook_events` table with `event_id` UNIQUE for idempotency.
- [ ] Route `/api/checkout/route.ts` — server action creates Checkout Session, returns `session.url`.
- [ ] Route `/api/webhooks/stripe/route.ts` — verify signature with `stripe.webhooks.constructEvent`, handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Use service-role client (`lib/supabase/admin.ts`).
- [ ] Replace [upgradeSubscription.ts](client/src/actions/subscription/upgradeSubscription.ts) — keep the function, but it now redirects to a Checkout session instead of mutating the tier directly. Tier mutation moves into the webhook handler.
- [ ] Add billing portal action (`stripe.billingPortal.sessions.create`) and link from profile.
- [ ] Loading + error UI on `PricingCard.tsx` (replace text-only `isPending`).
- [ ] Failed-renewal grace period: read `payment_status='past_due'` and show banner before downgrade.

---

## 3. Refactoring Table

| Current File | Suggested Action | Reasoning |
|---|---|---|
| [LoginModal.tsx](client/src/components/auth/components/LoginModal.tsx) (1047) | Split into `useAuthModalState` hook + sibling sub-forms | One file mixes 4 flows (login, register, reset, complete-profile); diff-blast radius is huge |
| [configs.ts](client/src/components/editor/configs.ts) (657) | Split per template family under `editor/configs/` | New templates currently force a 657-line file edit |
| [MorePreviews.tsx](client/src/components/galleryTemplate/components/MorePreviews.tsx) (550) | One file per preview | Preview components are independent; co-location is accidental |
| [BrandCalendar.tsx](client/src/components/ui/BrandCalendar.tsx) (497) | Extract `useBrandCalendar` + `<MonthYearSelector>` sub-component | Date logic is mechanically separable from rendering |
| [EditorDesktop.tsx](client/src/components/editor/Desktop/EditorDesktop.tsx) + [EditorMobile.tsx](client/src/components/editor/Mobile/EditorMobile.tsx) | Extract shared `useEditorState`/`useEditorModals` + `FieldRenderer`; device files keep only layout | Files are ~80% identical; bug-fixes need duplicate edits today |
| [useProfile.ts](client/src/hooks/useProfile.ts), [useUser.ts](client/src/hooks/useUser.ts) | Rewrite as selectors over `useProfileQuery` | Three independent fetches of the same row on every page |
| [QueryProvider.tsx](client/src/providers/QueryProvider.tsx) | Set `gcTime: 30min`, add `refetchOnReconnect: true` | Default 5min `gcTime` evicts data during normal navigation, defeating React Query |
| [create.ts](client/src/actions/creations/create.ts) + [submit.ts](client/src/actions/creations/submit.ts) | Single `.in('tier_code', [...])` query for policies | Two sequential queries where one suffices |
| [getCreation()](client/src/actions/creations/read.ts) | Wrap in `protectedAction` | Custom error shape breaks the `useServerAction` 401 contract |
| [upgradeSubscription.ts](client/src/actions/subscription/upgradeSubscription.ts) | Replace direct DB mutation with Stripe Checkout redirect; tier flip moves to webhook | Current code grants premium without payment |
| [LiveRegion.tsx](client/src/components/accessibility/components/LiveRegion.tsx) | Delete (or wire up) | Exported, never rendered |
| 8 component-local `hooks/` folders | Move to global `src/hooks/` | Inconsistent placement; violates the documented `@/hooks/*` convention |

---

## 4. Code Snippets

### 4.1 Selector pattern — collapse 3 profile hooks into 1 cache key

```ts
// src/hooks/useProfileQuery.ts (canonical)
export function useProfileQuery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['profile', user?.id],
    enabled: !!user,
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, subscription_policies!inner(*)')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

// src/hooks/useProfile.ts — was a duplicate fetch, now a selector
export function useProfile() {
  return useProfileQuery();
}

// src/hooks/useUser.ts — selector for the trimmed shape
export function useUser() {
  const { data } = useProfileQuery();
  return data
    ? { id: data.id, email: data.email, firstName: data.first_name }
    : null;
}
```

### 4.2 Motion-respecting wrapper — global a11y opt-out

```tsx
// src/components/accessibility/MotionGuard.tsx
'use client';
import { useReducedMotion } from '@/components/accessibility/AccessibilityProvider';
import { MotionConfig } from 'framer-motion';

export function MotionGuard({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <MotionConfig
      reducedMotion={reduced ? 'always' : 'user'}
      transition={reduced ? { duration: 0 } : undefined}
    >
      {children}
    </MotionConfig>
  );
}

// Wrap once at root:
// app/layout.tsx → <AccessibilityProvider><MotionGuard>{children}</MotionGuard></AccessibilityProvider>
```

This single wrapper makes every `motion.*` element in the tree honor the toggle without per-component refactors.

### 4.3 Stripe webhook handler skeleton

```ts
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { logger } from '@/lib/utils/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency: insert event_id; ignore if duplicate
  const { error: dupErr } = await supabase
    .from('webhook_events')
    .insert({ event_id: event.id, type: event.type });
  if (dupErr?.code === '23505') return new Response('OK', { status: 200 });

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object as Stripe.Checkout.Session;
      await supabase
        .from('profiles')
        .update({
          subscription_tier: s.metadata!.tier,
          stripe_customer_id: s.customer as string,
          stripe_subscription_id: s.subscription as string,
          premium_start: new Date().toISOString(),
          premium_expiry: new Date(Date.now() + 30 * 86_400_000).toISOString(),
          payment_status: 'active',
        })
        .eq('id', s.metadata!.user_id);
      break;
    }
    case 'invoice.payment_failed': {
      const inv = event.data.object as Stripe.Invoice;
      await supabase
        .from('profiles')
        .update({ payment_status: 'past_due' })
        .eq('stripe_customer_id', inv.customer as string);
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free', payment_status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return new Response('OK', { status: 200 });
}
```

### 4.4 Layout-level prefetch — kill the login waterfall

```ts
// app/(main)/layout.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { createServerClient } from '@/lib/supabase/server';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const qc = new QueryClient();

  if (user) {
    await Promise.all([
      qc.prefetchQuery({ queryKey: ['profile', user.id], queryFn: () => fetchProfile(user.id) }),
      qc.prefetchQuery({ queryKey: ['templates', 'active'], queryFn: fetchActiveTemplates }),
    ]);
  }

  return <HydrationBoundary state={dehydrate(qc)}>{children}</HydrationBoundary>;
}
```

---

## 5. Verification

- **Build/type:** `cd client && npm run type-check && npm run lint && npm run build` — must pass after each refactor batch.
- **Unit tests:** `cd client && npx vitest` — extend coverage on new hooks/selectors.
- **Manual smoke:** golden path = signup → complete profile → pick free template → create → share link → upgrade flow → create premium template → expiry countdown.
- **Performance:** Chrome DevTools "Network" + "Performance" on initial login. Confirm `profiles` is fetched once (not 3x), `templates` once, `subscription_policies` once.
- **A11y:** macOS System Settings → Reduce Motion ON, reload — confirm all Framer Motion components are static. Toggle in-app A11y panel — same result.
- **Billing (when implemented):** Stripe CLI → `stripe listen --forward-to localhost:3000/api/webhooks/stripe`, run `stripe trigger checkout.session.completed` with metadata, verify DB update + idempotency (re-trigger same event ID, confirm no double-update).

---

## 6. Critical Files

- [client/src/components/auth/components/LoginModal.tsx](client/src/components/auth/components/LoginModal.tsx)
- [client/src/components/editor/configs.ts](client/src/components/editor/configs.ts)
- [client/src/components/editor/Desktop/EditorDesktop.tsx](client/src/components/editor/Desktop/EditorDesktop.tsx)
- [client/src/components/editor/Mobile/EditorMobile.tsx](client/src/components/editor/Mobile/EditorMobile.tsx)
- [client/src/hooks/useProfile.ts](client/src/hooks/useProfile.ts) + [useProfileQuery.ts](client/src/hooks/useProfileQuery.ts) + [useUser.ts](client/src/hooks/useUser.ts) + [useDashboard.ts](client/src/hooks/useDashboard.ts)
- [client/src/providers/QueryProvider.tsx](client/src/providers/QueryProvider.tsx)
- [client/src/actions/creations/create.ts](client/src/actions/creations/create.ts) + [submit.ts](client/src/actions/creations/submit.ts) + [read.ts](client/src/actions/creations/read.ts)
- [client/src/actions/creations/helpers/quotaCheck.ts](client/src/actions/creations/helpers/quotaCheck.ts)
- [client/src/actions/subscription/upgradeSubscription.ts](client/src/actions/subscription/upgradeSubscription.ts)
- [client/src/components/accessibility/AccessibilityProvider.tsx](client/src/components/accessibility/) (reuse — already implements `useReducedMotion`)
- [client/src/lib/utils/logger.ts](client/src/lib/utils/logger.ts) (reuse)
- [client/src/lib/protectedAction.ts](client/src/lib/protectedAction.ts) (reuse — apply to `getCreation`)

---

## 7. Recommended Sequencing

1. **Week 1 — low-risk wins:** dead code deletion, magic-number extraction, hook folder consolidation, logger/console cleanup, `QueryProvider` config.
2. **Week 2 — data layer:** profile-hook consolidation + layout prefetch + subscription-policy query merge. Measurable perf win on login.
3. **Week 3 — accessibility:** `MotionGuard` wrapper + focus-trap gaps. One global commit.
4. **Week 4-6 — Stripe integration:** schema migration, checkout route, webhook handler, billing portal, UI states. Highest blast radius — schedule when no other tier-touching work is in flight.
5. **Ongoing — modularization:** refactor 150+ line files on-touch rather than in a big-bang. Top-3 (`LoginModal`, `configs.ts`, `MorePreviews`) are exceptions worth a dedicated PR each.
