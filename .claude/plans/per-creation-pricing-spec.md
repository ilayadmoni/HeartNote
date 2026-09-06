# Per-Creation Pricing — Build-Ready Spec

Date: 2026-09-04 (revised same day). Read-only audit; no files modified.

Builds on `.claude/plans/pricing-model-research.md` (cited as **[PMR §x]**). Paths relative to `client/` unless prefixed `../`.

## Revision log

Applied three product decisions after review of the first version:

1. **Photo-upload add-on dropped entirely** — no storage infra exists and none is planned. Removed from price table, data model, checkout flow, migration steps. Moved to §8 non-goals with reason.
2. **No paying users ever existed** — confirmed by fresh audit (§1.4). Migration strategy changed from "backfill + `NOT VALID` CHECK to protect legacy rows" to **full removal, no grandfathering, no dual-read period**. Added a first-ship-only reason this was even considered: the prior version didn't verify there were zero live subscribers before designing a backfill path — that verification is now done and the backfill step is deleted.
3. **"Pay before creation" locked in, with free preview** — resolves the single open/load-bearing assumption from v1 (previously: "money charged at publish"). This is an architecture change, not a copy edit: `Creation` rows no longer exist pre-payment, so §5 (data model) and §6 (checkout flow) are rewritten, not patched. Preview reuses an **existing, already-shipped** component (`TemplatePreview`, `src/components/galleryTemplate/components/TemplatePreview.tsx`) rather than a new one — found during this session's audit, not in v1.

Also: v1's subscription-surface file list (**[§1.4 old]**) was incomplete — this revision re-ran the grep and found 3 more files, and did a second, broader sweep (identifiers, i18n copy, env vars, analytics events) per the new instructions. See §1.5.

All dollar/₪ figures, tier assignments, and file:line citations not touched by the three decisions above are **unchanged from v1** and were spot-re-verified, not re-derived from scratch.

---

## 1. Code audit

### 1.1 Slug generation — unchanged from v1, re-confirmed

There is no slug. The public route parameter named `slug` is the **creation UUID**.

| Fact | Evidence |
|---|---|
| Route param used as primary-key lookup | `src/app/[locale]/(public)/p/[slug]/page.tsx:22,35-40` — `params: { slug: string }` → `prisma.creation.findFirst({ where: { id, isDeleted: false } })` |
| Same in the server action | `src/actions/creations/read.ts:54` — `getCreation(creationId)` |
| ID is a DB-generated UUID v4 | `prisma/schema.prisma:114` — `id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid` |
| Share URL built from it client-side | `src/components/editor/hooks/useEditorState.ts:125` — `` `${window.location.origin}/p/${result.data.creationId}` `` — **this call site is deleted in the new flow**, see §6 |

Custom-slug add-on still requires a new `Creation.customSlug` column, unique index, and two-branch resolver. Unchanged from v1 — see §5.3.

### 1.2 Branding, AI allowlist, expiry — unchanged from v1, re-confirmed

All file:line claims from v1 hold. Table not reproduced here in full; see v1 content, which is superseded only where §3/§5/§6/§7 below explicitly say so (AI entitlement gating, expiry model, branding removal).

Key facts still load-bearing: AI allowlist is 3 fields (`src/lib/validations/ai.ts:12-16`), rate limit 10/hour/user regardless of tier (`src/lib/utils/rate-limiters.ts:46-54`), `FooterBranding` renders unconditionally at 21 call sites (`src/components/templates/components/FooterBranding.tsx`).

### 1.3 Image handling — **N/A, add-on dropped**

v1 §1.3 confirmed zero image infrastructure (no storage client, no bucket env keys, no S3 in Terraform, avatars are external DiceBear URLs, `react-easy-crop` unused). That finding is now moot — the photo-upload add-on is out of scope (§8) and no infrastructure work is scheduled for it. Nothing further to audit here.

### 1.4 The prior premium attempt — what exists, and confirmation nothing was ever sold

**Confirmed: no premium/paid tier was ever fully shipped or sold.** Evidence:

- `NEXT_PUBLIC_ENABLE_UPGRADES` — the only gate in front of `upgradeSubscription.ts` — is read at `src/app/[locale]/(main)/pricing/page.tsx:24` but **is not documented in `.env.example`** (`grep -n "ENABLE_UPGRADES" .env.example` → no match). An env var with no documented default and no example entry was, at best, manually flipped on a preview deploy for internal testing, never something a real production checkout depended on.
- `src/components/pricing/constants/index.ts:26,41` — both `lite` and `premium` plans carry `isComingSoon: true` in the plan definition itself. The pricing page has never presented either paid plan as purchasable to a real visitor.
- `upgradeSubscription.ts` (`src/actions/subscription/upgradeSubscription.ts:13-70`) has no Sumit call, no payment reference, no invoice — it only ever flips DB columns. There is no code path anywhere that could have produced a real charge.
- `grep -ri sumit src` → only `src/messages/{he,en}/legal.json:78`, boilerplate privacy-policy prose naming Sumit as a processor "if" payments are taken. No SDK import, no API key reference, no webhook route.

**What the unfinished attempt actually consists of** (so the execution agent knows exactly what to delete, not adapt):

| Layer | What exists | Completeness |
|---|---|---|
| Schema | `SubscriptionPolicy` model, `Profile.{subscriptionTier,premiumStart,premiumExpiry,creationsCount*,additionalCreation*}`, `Template.isPremium` | Fully wired to app logic, never wired to a payment provider |
| Self-serve "upgrade" action | `src/actions/subscription/upgradeSubscription.ts` | Functionally complete as a **free** tier-flip; zero payment integration — this is the P1 vulnerability, not a WIP payment feature |
| Pricing page | `src/app/[locale]/(main)/pricing/page.tsx`, `src/components/pricing/**` | Fully built UI, both paid plans hardcoded `isComingSoon: true` |
| Editor tier-selection UI | `CreationConfirmModal.tsx`, `ConfirmModalHeader.tsx`, `TierCard.tsx`, `PaidQuotaModal.tsx`/`PaidQuotaBody.tsx`, `QuotaModal.tsx`, `PremiumTemplateUpgradeModal.tsx` | Fully built and live — this is the real, functioning **free**-tier quota UI; "premium" branch of it has never been reachable by a paying user |
| Profile "your plan" UI | `SubscriptionCard.tsx`, `SubscriptionPlanCard.tsx`, `TemplateUsageCard.tsx` | Fully built, renders whatever `subscriptionTier` the free self-serve flip produced |
| Copy describing paid plans | `src/messages/{he,en}/{pricing,faq,home,editor,profile,gallery,meta,nav}.json` (full list §1.5) | Extensively drafted, including a full FAQ entry (`faq.json:11`) with ₪12/₪29 pricing and feature claims, and one stray reference to a **"one-time plan"** at `faq.json:27` (`he`: "מסלול החד-פעמי", `en`: "one-time plan") — the only trace anywhere in the repo of an earlier one-time-purchase idea. It is one sentence, unconnected to any code, and pre-dates this spec. |

**Go-ahead, stated plainly:** the execution agent is authorized to **delete this entire surface wholesale** — schema, actions, hooks, components, copy — and build the per-creation model from scratch. There is nothing to adapt or incrementally migrate, because nothing in it was ever connected to real money. Treat every item in the table above, plus the full file list in §1.5, as delete-and-replace, not refactor-in-place.

### 1.5 Full-repo sweep — exact commands, exact counts

Run from `client/` unless noted. Counts are `grep -rn <pattern> <paths> | wc -l` (line matches, not file counts) as of this audit; **re-run before executing the migration**, they will change as this spec's own file gets edited.

**Command A — the old file list, re-verified and corrected.** v1 used a single combined regex and found 47 files. Re-running it this session:

```
grep -rlnE "subscription_policies|subscriptionPolicy|SubscriptionPolicy|premium_expiry|premiumExpiry|subscription_tier|subscriptionTier|creations_count|creationsCount|additional_creation|additionalCreation|is_premium|isPremium|SubscriptionTier" src ../db ../supabase ../README.md ../CLAUDE.md
```

**50 files** (up from 47 — v1's list missed 3): `src/actions/creations/helpers/validateSubmit.ts`, `src/components/editor/hooks/helpers/submitCreation.ts`, `src/lib/validations/creation.ts`. All three carry `quotaPreference`, which the combined regex above does not include as a term (v1 also never grepped for `quotaPreference` specifically). Corrected, full list:

*Schema (2):* `prisma/schema.prisma`, `../db/schema.sql`

*Server actions / lib (17):* `src/actions/creations/create.ts`, `.../helpers/expiryCalc.ts`, `.../helpers/persistCreation.ts`, `.../helpers/quotaCheck.ts`, `.../helpers/validateSubmit.ts` *(new)*, `src/actions/dashboard.ts`, `src/actions/profile/helpers.ts`, `src/actions/subscription/getPolicies.ts`, `src/actions/subscription/upgradeSubscription.ts`, `src/actions/templates.ts`, `src/lib/auth/onboarding.ts`, `src/lib/creation-flow/errors.ts`, `src/lib/profileQueryData.ts`, `src/lib/subscription/checkAndDowngradeSubscription.ts`, `src/lib/validations/creation.ts` *(new)*, `src/types/index.ts`

*Validations (5):* `src/lib/validations/{dashboard,index,profile,subscription,template}.ts`

*Hooks (5):* `src/hooks/{useActiveTemplates,useDashboard,usePolicies,useProfile,usePricingUpgrade}.ts`

*Editor hooks/UI (9):* `src/components/editor/hooks/helpers/submitCreation.ts` *(new)*, `useEditorState.ts`, `useEditorValidation.ts`, `ConfirmModalHeader.tsx`, `CreationConfirmModal.tsx`, `FieldRenderer.tsx`, `PaidQuotaModal.tsx`

*Pages (2):* `src/app/[locale]/(main)/pricing/page.tsx`, `src/app/[locale]/(main)/profile/page.tsx`

*Gallery/home UI (7):* `TemplateCard.tsx`, `galleryTemplate/data/{baseTemplatesA,baseTemplatesB,interactiveEventTemplates}.ts`, `galleryTemplate/types/index.ts`, `home/components/{GalleryTeaser,GalleryTeaserCard}.tsx`, `home/hooks/usePopularTemplates.ts`

*Profile UI (6):* `profile/components/{SubscriptionCard,SubscriptionPlanCard,TemplateUsageCard}.tsx`, `profile/constants/index.ts`, `profile/hooks/useProfileViewModel.ts`, `profile/types/index.ts`

*Pricing UI (folder):* `src/components/pricing/**`, `src/components/ui/UpgradeSlideOver*.tsx`

**Command B — per-identifier counts, `src/` + `../db` + `../README.md` + `../CLAUDE.md` only** (historical `../supabase/migrations/*.sql` excluded — those are frozen history, never edited, no action item):

| Identifier | `grep -rn` line-match count |
|---|---|
| `is_premium` | 31 |
| `isPremium` | 76 |
| `subscription_tier` | 27 |
| `subscriptionTier` | 21 |
| `SubscriptionTier` | 18 |
| `premium_expiry` | 29 |
| `premiumExpiry` | 26 |
| `subscription_policies` | 12 |
| `subscriptionPolicy` | 8 |
| `SubscriptionPolicy` | 2 |
| `quotaPreference` | 18 |
| `creations_count_free` | 24 |
| `creations_count_pro` | 32 |
| `creationsCountFree` | 11 |
| `creationsCountPro` | 10 |
| `additional_creation_free` | 24 |
| `additional_creation_pro` | 25 |
| `additionalCreationFree` | 6 |
| `additionalCreationPro` | 6 |
| `NEXT_PUBLIC_ENABLE_UPGRADES` | 1 |

None of these should have a nonzero count in `src/` after migration step 12 (§7). Re-run Command A and this table as the literal completion check for the sweep step.

**Command C — locale files with old tier copy.** `grep -rn "פרימיום\|לייט\|premium\|Premium\|tier" src/messages/{he,en}/*.json`. Files with real hits (not incidental English word "premium" in an unrelated sentence — all of these are genuine old-model copy):

| File | What's there |
|---|---|
| `src/messages/{he,en}/pricing.json` | Whole file is the old 3-plan structure (v1 §2.2 already covers replacing this) |
| `src/messages/{he,en}/faq.json:7,10-11,27` | Free-tier FAQ answer ("5 יצירות חינמיות לכל החיים... 24 שעות"), full Lite/Premium comparison table with ₪12/₪29 prices, and the one **"one-time plan"** sentence at `:27` noted in §1.4 |
| `src/messages/{he,en}/home.json:32,35-36` | Home page pricing teaser: "מחשבון חינמי... כרטיסיית פרימיום", plus `lite`/`premium` objects with old quotas |
| `src/messages/{he,en}/editor.json:389-441,525-557` | `tierSectionTitle`, `premiumBadge`, `tier.*`, `premiumUpgrade.*` blocks — this is the copy for `CreationConfirmModal`/`PremiumTemplateUpgradeModal`/`PaidQuotaModal`, all deleted in §7 |
| `src/messages/{he,en}/gallery.json:25` | `"premium": "פרימיום"` badge label — feeds `TemplateCard.tsx`'s premium lock badge |
| `src/messages/{he,en}/profile.json:32-35,50,61` | `tier.*` block, `upgradeToPremium`, `planLabel` — feeds `SubscriptionCard`/`SubscriptionPlanCard` |
| `src/messages/{he,en}/meta.json:12-13` | `/pricing` page `<title>`/description, still describes "plans" |
| `src/messages/{he,en}/nav.json:3` | Nav label "תוכניות ומחירים" ("Plans & Pricing") — becomes a plain price list, label can stay or change to "תמחור" ("Pricing"), execution agent's call |
| `src/messages/{he,en}/legal.json:78,148` | Privacy-policy Sumit mention (**keep** — still accurate) and a T&C clause about digital-goods cancellation rights for "premium content" (**keep and generalize wording** — still legally relevant for one-time paid creations, just reword away from "premium") |

**Command D — client-side tier/rank checks outside server actions**, beyond what v1 already listed in its editor-UI file group: confirmed to be exactly `useEditorState.ts:38` (`isPremiumTemplate = Boolean(cachedTemplate?.is_premium)`), `useEditorState.ts:114` (`if (isPremiumTemplate && isEffectivelyFreeUser)`), `useEditorValidation.ts:47` (`if (isPremiumTemplate && isEffectivelyFreeUser) return "upgrade"`), `TemplateCard.tsx:43-47` (lock badge), and `isSubscriptionEffectivelyFree()` in `src/lib/creation-flow/errors.ts:59-70`. No additional client-side rank checks found beyond v1's list; the account/nav "current plan" surface is `SubscriptionCard.tsx`/`SubscriptionPlanCard.tsx` (already listed).

**Command E — analytics/telemetry tied to the old model.** `grep -rln "pushToDataLayer" src` → 8 files. None fire a `subscription`/`premium`/`purchase`-named GA4 event today — the only purchase-adjacent event is `generate_link` at `src/components/editor/components/CreationConfirmModal.tsx:73`, fired on free-tier "confirm creation," not on any payment. `src/lib/audit-logger.ts:8-14` has `"subscription.purchased"` in its type union but it is only ever emitted by `upgradeSubscription.ts:56` (the free self-flip) — never a real purchase event. Both `generate_link` and `subscription.purchased` are replaced, not extended — see §5.6 and §7 step 9's checklist.

**Sweep checklist for the execution agent** (tick each before considering the migration done):

- [ ] Command A returns 0 files under `src/`
- [ ] Command B's 20 identifiers all return 0 in `src/` (`../db/schema.sql` will show the *new* schema with no old columns, not 0 — check by re-reading, not grepping, once the new schema is authored)
- [ ] Every file in Command C's table edited or removed; `en` and `he` versions kept in sync
- [ ] `legal.json` T&C clause (`:148`) reworded, not deleted — the cancellation-rights nuance still applies
- [ ] `.env.example` has no `NEXT_PUBLIC_ENABLE_UPGRADES`, `NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED`, or any subscription-era key; new Sumit keys present (§7 step 9)
- [ ] `CLAUDE.md` and `../README.md` tier tables replaced with the per-creation model description (§7 step 15) — not merely deleted
- [ ] `audit-logger.ts` type union has no `subscription.purchased`; new events present (§5.6)
- [ ] `generate_link` GTM event replaced by a payment-stage event (§7 step 9)

---

## 2. Base price table

*(Unchanged from v1 except: the photo-upload cost aside is removed from §2.1, and the ceiling reference now says "three add-ons.")*

### 2.1 Pricing method and anchors

Judgment call, not code-derived:

- **Charm pricing at ₪X.90.** Israeli e-commerce convention; a ₪9.90 base reads as "under ten" against a ₪15–25 physical greeting card or a ₪30–50 small gift.
- **Anchor is the physical card, not cost-plus.** Marginal cost is effectively zero, so cost-plus would price this at agorot.
- **Ceiling math drives the top.** Event-critical base + all **three** add-ons must land ≤ ₪20 (§4). That fixes the highest base at ₪12.90.

**Marginal AI cost, computed from code:** `src/lib/ai/client.ts:56` sets `max_tokens = ceil(100/2)+20 = 70`. Input ≈ 160–200 tokens (system prompt `client.ts:12-15` + user prompt capped at 200 chars, `src/lib/validations/ai.ts:25`). At the `.env.example:48` reference model `gpt-4o-mini` ($0.15/1M in, $0.60/1M out): **≈ $0.00007 ≈ 0.026 agorot per generation.** AI pricing is pure value-capture, not cost recovery.

### 2.2 Tiers

| Tier | Base price | Rationale |
|---|---|---|
| **Casual** | **₪6.90** | Impulse buy. Volume driver. |
| **Medium** | **₪9.90** | Sub-₪10 anchor; buyer has invested editing effort. |
| **Event-critical** | **₪12.90** | Dated, one-shot, socially visible. Highest base that keeps base + all add-ons ≤ ₪20 (§4). |

### 2.3 Per-template assignment (all 21) — unchanged from v1

| # | Slug | Name | uses | **Tier** | **Base ₪** |
|---|---|---|---|---|---|
| 1 | `date-invite` | הזמנה לדייט | 27 | Casual | 6.90 |
| 2 | `scratch-card` | גרד וגלה | 20 | Casual | 6.90 |
| 3 | `decision-wheel` | גלגל ההחלטות | 6 | Casual | 6.90 |
| 4 | `surprise-gift` | מתנה בהפתעה | 6 | Casual | 6.90 |
| 5 | `punching-bag` | שק האיגרוף | 0 | Casual | 6.90 |
| 6 | `excuse-generator` | מכונת התירוצים | 0 | Casual | 6.90 |
| 7 | `apology-search` | חיפוש סליחה | 0 | Casual | 6.90 |
| 8 | `slot-machine` | מכונת ההבטחות | 1 | Medium | 9.90 |
| 9 | `relationship-quiz` | חידון חברות | 4 | Medium | 9.90 |
| 10 | `timeline` | ציר זמן | 6 | Medium | 9.90 |
| 11 | `birthday-candles-interactive` | עוגת יום הולדת | 0 | Medium | 9.90 |
| 12 | `holiday-rosh-hashanah-interactive` | ראש השנה | 0 | Medium | 9.90 |
| 13 | `holiday-passover-interactive` | פסח | 0 | Medium | 9.90 |
| 14 | `holiday-purim-interactive` | פורים | 0 | Medium | 9.90 |
| 15 | `holiday-shavuot-interactive` | שבועות | 0 | Medium | 9.90 |
| 16 | `holiday-sukkot-interactive` | סוכות | 0 | Medium | 9.90 |
| 17 | `holiday-hanukkah-interactive` | חנוכה | 0 | Medium | 9.90 |
| 18 | `love-coupons` | קופונים מיוחדים | 8 | Event-critical | 12.90 |
| 19 | `open-when` | מכתבים מיוחדים | 3 | Event-critical | 12.90 |
| 20 | `bar-bat-mitzvah` | בר/בת מצווה | — | Event-critical | 12.90 |
| 21 | `wedding-glass-interactive` | חתונה אינטראקטיבית | 0 | Event-critical | 12.90 |

Distribution: 7 casual / 10 medium / 4 event-critical. Full per-row justification unchanged from v1 (complexity/usage-anchored, not repeated here to avoid duplicating unedited content).

**Seasonal override** (optional, judgment call, unchanged from v1): in-season holiday template may flip to casual for its two-week window by editing `basePriceAgorot` (§5.1).

---

## 3. Add-on price table — **photo-upload removed**

| Add-on | **Price** | Availability | Notes |
|---|---|---|---|
| **AI message** (`ai_message`) | **₪2.90** | **All 21 templates.** Expand the allowlist. | Unchanged reasoning from v1: replace the hardcoded 3-field allowlist (`src/lib/validations/ai.ts:12-16`) with every `textarea` field + long `text` fields across all 21 templates' configs. Marginal cost 0.026 agorot (§2.1). |
| **Custom link slug** (`custom_slug`) | **₪2.90** | **All 21 templates.** | Pure vanity; zero marginal cost. |
| **Extended lifetime** (`extended_lifetime`) | **₪2.90** | **All 21 templates.** | See §3.1. |

Total of all three add-ons: **₪8.70** (was ₪12.60 with photo).

### 3.1 Link lifetime — unchanged from v1

| | Duration | Price |
|---|---|---|
| **Included with every paid creation** | **90 days** | ₪0 |
| **Extended lifetime add-on** | **+275 days → 365 days total** | **₪2.90** |

Reasoning unchanged from v1: 90 days replaces the old free 24–48h and old paid 30/45-day windows; the extension is framed and sold as "a full year" ("שנה שלמה"), not "+275 days."

---

## 4. Price-ceiling enforcement — **recomputed for three add-ons, matrix simplified**

### 4.1 Does the flat structure now fit without tier-scaling?

Proof, all three add-ons at the flat §3 price (₪2.90 each = ₪8.70 total add-ons):

| Tier | Base | + all 3 add-ons | **Max total** | ≤ ₪20 |
|---|---|---|---|---|
| Casual | 6.90 | 8.70 | **₪15.60** | ✅ |
| Medium | 9.90 | 8.70 | **₪18.60** | ✅ |
| Event-critical | 12.90 | 8.70 | **₪21.60** | ❌ |

Dropping the photo add-on (which was ₪3.90/₪2.90/₪1.90 across tiers in v1, the single largest line item) gets casual and medium under the ceiling on a flat price — but event-critical still overshoots by ₪1.60 at ₪21.60.

### 4.2 Mechanism chosen: minimal tier-scaling, one exception instead of a full matrix

v1 built a full 4×3 tier-scaled matrix because four add-ons broke the ceiling on every tier. With three add-ons and flat pricing breaking the ceiling on **only one tier**, a full matrix is no longer justified — it would be solving a problem that exists in one cell. Simplified rule:

**AI message and custom slug stay flat at ₪2.90 on every tier. Extended lifetime alone scales down on event-critical, from ₪2.90 to ₪1.90.**

| Add-on | Casual | Medium | Event-critical |
|---|---|---|---|
| `ai_message` | ₪2.90 | ₪2.90 | ₪2.90 |
| `custom_slug` | ₪2.90 | ₪2.90 | ₪2.90 |
| `extended_lifetime` | ₪2.90 | ₪2.90 | **₪1.90** |
| **Add-on subtotal (all three)** | **₪8.70** | **₪8.70** | **₪7.70** |
| **Base** | ₪6.90 | ₪9.90 | ₪12.90 |
| **Max cart** | **₪15.60** | **₪18.60** | **₪20.60** |

₪20.60 still overshoots by 60 agorot. Two ways to close it: drop event-critical's `extended_lifetime` further to ₪1.30, or drop the event-critical base from ₪12.90 to ₪12.50 (breaks the charm-pricing convention). **Chosen: drop `extended_lifetime` on event-critical to ₪1.30.** It is the smallest, least-visible change — a buyer comparing add-on prices across tiers sees two of three identical and the third close, rather than an odd base price that breaks the ₪X.90 pattern everywhere else.

**Final add-on price matrix:**

| Add-on | Casual | Medium | Event-critical |
|---|---|---|---|
| `ai_message` | ₪2.90 | ₪2.90 | ₪2.90 |
| `custom_slug` | ₪2.90 | ₪2.90 | ₪2.90 |
| `extended_lifetime` | ₪2.90 | ₪2.90 | ₪1.30 |
| **Add-on subtotal (all three)** | **₪8.70** | **₪8.70** | **₪7.10** |
| **Base** | ₪6.90 | ₪9.90 | ₪12.90 |
| **Max cart** | **₪15.60** | **₪18.60** | **₪20.00** |
| **Min cart (base only)** | ₪6.90 | ₪9.90 | ₪12.90 |

Every tier's maximum lands at or under ₪20.00, casual and medium with headroom. Still one seeded lookup table (`AddOnPrice`, §5.2) keyed by `(code, complexityTier)`, not a special-cased conditional — the data shape from v1 survives even though only one cell actually deviates from flat.

### 4.3 Implementation rule — unchanged mechanism from v1

Server builds the cart from `add_on_prices` joined on the template's `complexityTier`; client never sends prices. Server-side assertion in the cart builder: `assert(total <= CEILING_AGOROT)` with `CEILING_AGOROT = 2000`. Guard rail on data entry, not a runtime discount — no discount engine, no add-on count cap.

---

## 5. Target data model — **restructured: payment precedes the `Creation` record**

> **Architecture change, not a field rename.** v1 modeled `Creation.status: pending` as "checkout opened, creation exists, awaiting webhook." That state no longer exists. With pay-before-create, there is nothing to be `pending` — the `Creation` row is born already paid, created by the webhook handler itself. `CreationOrder`/`OrderItem` now reference `templateId` + a `selectedAddOns` payload directly, not a pre-existing `creationId`.

Conventions unchanged from v1: models `PascalCase`/`@@map(snake_case)`, fields `camelCase`/`@map(snake_case)`, ids `dbgenerated("gen_random_uuid()")`, money in integer agorot, new tables use `@db.Timestamptz(6)`.

### 5.1 Removals and repurposing — unchanged from v1

Same table as v1 §5.1: `SubscriptionPolicy` dropped, `Profile.{subscriptionTier,creationsCount*,additionalCreation*,premiumStart,premiumExpiry}` dropped, `Template.isPremium` replaced by `complexityTier`+`basePriceAgorot`, `Template.expirationPolicy` dropped, `metadata.has_watermark` writes removed. `Creation.isPaid` is now moot rather than replaced — see §5.3, there is no unpaid `Creation` to distinguish.

### 5.2 `Template` and `AddOnPrice` — unchanged from v1

```prisma
enum ComplexityTier {
  casual
  medium
  event_critical

  @@map("complexity_tier")
}

model Template {
  // ... id, slug, name, category, tags, configSchema, isActive, uses unchanged
  complexityTier   ComplexityTier @default(casual) @map("complexity_tier")
  basePriceAgorot  Int            @map("base_price_agorot")

  @@index([complexityTier], map: "idx_templates_complexity_tier")
}

enum AddOnCode {
  ai_message
  custom_slug
  extended_lifetime

  @@map("add_on_code")
}

model AddOnPrice {
  code           AddOnCode
  complexityTier ComplexityTier @map("complexity_tier")
  priceAgorot    Int            @map("price_agorot")
  isActive       Boolean        @default(true) @map("is_active")

  @@id([code, complexityTier])
  @@map("add_on_prices")
}
```

9 seeded rows (3 codes × 3 tiers, was 12 with photo), values from §4.2.

### 5.3 `Creation` — no `pending` state, no photo fields, `paid_editing` → `active` split

```prisma
enum CreationStatus {
  paid_editing  // webhook created it; owner can personalize; NOT publicly viewable
  active        // owner hit "Get Link"; expiresAt clock started; publicly viewable
  refunded      // refund webhook received; link disabled

  @@map("creation_status")
}

model Creation {
  id                String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId            String         @map("user_id") @db.Uuid
  templateId        String         @map("template_id") @db.Uuid
  orderId           String         @unique @map("order_id") @db.Uuid   // NOT NULL — see below
  metadata          Json           @default("{}")
  status            CreationStatus @default(paid_editing)
  aiGenerationsUsed  Int           @default(0) @map("ai_generations_used")
  expiresAt         DateTime?      @map("expires_at") @db.Timestamptz(6)   // set only at finalize, see §6.6
  finalizedAt       DateTime?      @map("finalized_at") @db.Timestamptz(6)
  isDeleted         Boolean        @default(false) @map("is_deleted")
  createdAt         DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
  verificationCode  String         @map("verification_code")

  // ── custom_slug add-on — present at creation time if purchased ────
  customSlug        String?        @unique(map: "idx_creations_custom_slug") @map("custom_slug") @db.VarChar(48)

  profile  Profile       @relation(fields: [userId], references: [id], onDelete: Cascade)
  template Template      @relation(fields: [templateId], references: [id], onDelete: Cascade)
  order    CreationOrder @relation(fields: [orderId], references: [id], onDelete: Restrict)

  @@index([userId],     map: "idx_creations_user_id")
  @@index([templateId], map: "idx_creations_template_id")
  @@index([expiresAt],  map: "idx_creations_expires_at")
  @@index([status],     map: "idx_creations_status")
  @@map("creations")
}
```

Changes from v1's `Creation` model, each deliberate:

- **`orderId` is `String` (required) + `@unique`, not `String?`.** In v1, order was optional because a `Creation` could exist unpaid. Now a `Creation` row is only ever inserted by `applyPaidOrder` (§6.4) inside the same transaction that marks the order paid — there is no code path that creates one without an order. `onDelete: Restrict` (not `SetNull` as in v1) because an order-less creation is now a data-integrity bug, not a valid state.
- **No `pending` status.** Removed the v1 `chk_active_requires_order` CHECK entirely — it existed to guard against a `pending`/`active` creation with no order; that state is now structurally impossible (see previous point), so the constraint is redundant, not just unneeded.
- **`status` values are `paid_editing` / `active` / `refunded`**, replacing v1's `draft` / `pending` / `active` / `refunded` / `expired`. `draft` and `pending` had no `Creation` row to attach to any more. `expired` is dropped as a stored status (unchanged reasoning from v1: derive it from `expiresAt < now()` at read time rather than materializing it — simpler, and now doubly true since `expiresAt` is null until finalize anyway, see §6.6).
- **`expiresAt` is nullable and stays null until finalize.** This is the mechanism for "the clock starts at Get Link, not at payment" — see §6.6 for the full reasoning.
- **New `finalizedAt`** — timestamp of the "Get Link" action, separate from `createdAt` (which is now payment time). Useful for analytics (time-to-finalize) and support ("your card was paid on X, published on Y").
- **New `aiGenerationsUsed`** — replaces the free-trial-counter idea from v1's open question. Since AI is now purchasable per-creation as part of the same paid order (not a mid-editing upsell — payment happens before any editing at all, see §6), there is no "free generations before purchase" problem to solve: either the order included `ai_message` or it didn't, checked once via the order's `OrderItem` rows (§5.4). This column exists only to enforce the existing 10/hour abuse rate limit's cousin — a **per-creation** cap (recommend 20 lifetime generations per creation, generous relative to the 9-textarea-field ceiling) so a single ₪2.90 purchase can't be scripted into unlimited API spend. This resolves v1's open question 2 outright, no longer open.
- **Photo fields removed** (`photoUrl`, `photoStorageKey`) — add-on dropped.
- **`metadata` defaults to `{}` not nullable** — at creation time (webhook), there is no user content yet; the real editor (§6.5) fills it via `PATCH`-style updates. v1's `metadata Json?` assumed content existed at insert time from the old submit-then-charge flow.

Custom-slug constraints (length, character set, Hebrew transliteration, reserved words, profanity, collision-reject-don't-retry, case, immutability) are **unchanged from v1 §5.4** — the rules don't depend on when the `Creation` row is created, only on the fact that it's user-chosen and paid-for. Not reproduced here to avoid duplicating unedited content; see v1 for the full table if needed, or treat this paragraph as the pointer.

One rule tightened by the new flow: since `customSlug` is now set by the webhook **before** the owner has entered the real editor, the availability check (§6.1 step 3) happens **before payment**, at add-on selection time — a slug reserved-then-paid can no longer collide at webhook time under normal operation, but the webhook still re-checks under a transaction (a second browser tab race is still possible) and on collision falls back to **no slug, refund that one line item, keep the rest of the order intact** — see §6.4.

### 5.4 `CreationOrder` and `OrderItem` — now the *first* record created, not a companion to an existing `Creation`

```prisma
enum OrderStatus {
  pending     // cart built, Sumit not yet confirmed — Creation does NOT exist yet
  paid        // webhook verified — Creation was created in the same transaction
  failed      // Sumit reported failure, or timeout
  refunded

  @@map("order_status")
}

model CreationOrder {
  id                String      @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId            String      @map("user_id") @db.Uuid
  templateId        String      @map("template_id") @db.Uuid   // was creationId in v1 — no Creation exists yet
  status            OrderStatus @default(pending)
  totalAgorot       Int         @map("total_agorot")
  currency          String      @default("ILS") @db.Char(3)

  // ── add-on selection, captured at cart build, before any Creation exists ──
  requestedCustomSlug String?   @map("requested_custom_slug") @db.VarChar(48)

  // ── Sumit ─────────────────────────────────────────────────────────
  sumitPaymentId    String?     @unique(map: "idx_orders_sumit_payment_id") @map("sumit_payment_id")
  sumitDocumentId   String?     @map("sumit_document_id")
  sumitCustomerId   String?     @map("sumit_customer_id")
  idempotencyKey    String      @unique(map: "idx_orders_idempotency_key") @map("idempotency_key")

  createdAt         DateTime    @default(now())  @map("created_at") @db.Timestamptz(6)
  paidAt            DateTime?   @map("paid_at")     @db.Timestamptz(6)
  refundedAt        DateTime?   @map("refunded_at") @db.Timestamptz(6)

  profile  Profile    @relation(fields: [userId], references: [id], onDelete: Cascade)
  template Template   @relation(fields: [templateId], references: [id], onDelete: Restrict)
  items    OrderItem[]
  creation Creation?              // back-relation only; FK lives on Creation.orderId

  @@index([userId, createdAt(sort: Desc)], map: "idx_orders_user_created")
  @@index([status], map: "idx_orders_status")
  @@map("creation_orders")
}

model OrderItem {
  id            String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  orderId       String     @map("order_id") @db.Uuid
  kind          String     // 'base' | 'addon'
  addOnCode     AddOnCode? @map("add_on_code")
  description   String     // Hebrew line-item text, sent to Sumit and printed on the invoice
  unitAgorot    Int        @map("unit_agorot")
  quantity      Int        @default(1)
  totalAgorot   Int        @map("total_agorot")

  order CreationOrder @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId], map: "idx_order_items_order_id")
  @@map("order_items")
}
```

```sql
ALTER TABLE order_items ADD CONSTRAINT chk_item_kind
  CHECK ((kind = 'base' AND add_on_code IS NULL)
      OR (kind = 'addon' AND add_on_code IS NOT NULL));
CREATE UNIQUE INDEX idx_order_items_one_base
  ON order_items (order_id) WHERE kind = 'base';
CREATE UNIQUE INDEX idx_order_items_addon_once
  ON order_items (order_id, add_on_code) WHERE add_on_code IS NOT NULL;
```

Changes from v1's `CreationOrder`, each deliberate:

- **`templateId` replaces `creationId`.** The order is placed against a template + add-on selection, not an existing creation — there isn't one yet.
- **`requestedCustomSlug`** captures the buyer's chosen slug at cart-build time (after the pre-payment availability check, §6.1 step 3), so the webhook has it available to write onto the new `Creation` row without needing a second round-trip to the client.
- **`creation Creation?`** is a back-relation only — the FK direction is `Creation.orderId → CreationOrder.id`, not the reverse, because exactly one `Creation` is ever produced per order (not a list) and it's produced *by* the order, not attached after the fact.
- **`template Template @relation(... onDelete: Restrict)`** — an order must always be traceable to what was bought even if a template is later deactivated (`isActive: false` already exists for that; hard-deleting a template with completed orders should be blocked).

`OrderItem` is otherwise **structurally unchanged from v1** — still one `base` line + one line per selected add-on, still price-snapshotted, still Sumit's itemized-cart model.

### 5.5 New audit events — updated for the new lifecycle

Extend `src/lib/audit-logger.ts:8-14`, dropping `subscription.purchased` (per §1.5 sweep, this event was never fired by a real purchase — safe to drop outright, nothing downstream depends on its history being preserved going forward):

```
"order.created" | "order.paid" | "order.failed" | "order.refunded"
| "creation.created" | "creation.finalized" | "addon.granted"
```

`creation.created` fires inside `applyPaidOrder` (payment confirmed, editor unlocked). `creation.finalized` fires at the "Get Link" action (§6.6) — this is the new event GA4/GTM should track as the purchase-completion-equivalent signal, replacing `generate_link` (§1.5 Command E).

---

## 6. Checkout flow — **rewritten: preview → paywall → webhook creates `Creation` → editor → finalize**

### 6.1 Preview architecture — reusing an existing component, not building a new one

**Decision: reuse `TemplatePreview` (`src/components/galleryTemplate/components/TemplatePreview.tsx`), promoted to a dedicated public route. Do not add a `previewMode` flag to `TemplateEditor`/`useEditorState`.**

Audit finding that drives this (not present in v1 — found this session): `TemplatePreview` already exists, is already shipped, and already does exactly what "free preview, no personalization" requires:

- It is a pure `switch (componentKey)` over 21 per-template `*Preview` components (`src/components/galleryTemplate/previews/*.tsx`, aggregated via `MorePreviews.tsx`), each rendering the real template component with **hardcoded sample data** (`src/components/galleryTemplate/data/previewData.ts`'s `buildPreviewData()`, or literal objects inline per preview component). Zero editable fields — there is no field-input surface to disable, because none exists.
- It is already live in production, used at three call sites: `src/components/galleryTemplate/components/TemplateCard.tsx` (gallery card), `src/components/home/components/GalleryTeaserCard.tsx` (home page teaser), and an internal QA route at `src/app/[locale]/(main)/preview/page.tsx` (only 6 of 21 templates wired there, gated out of search engines via `src/app/robots.ts:8`, and not linked from anywhere in the site nav — confirmed via `grep -rn "\"/preview\"" src` matching nothing outside that page itself).
- No auth check anywhere in this component tree — it's already effectively public, just not routed to.

**Rejected alternative — `previewMode` flag on `TemplateEditor`:** `useEditorState.ts` is entangled with `useAuth()`, `useProfile()`, `useProfileComplete()`, draft-save-and-redirect, and (after §7's cleanup) order/entitlement checks. Threading a `previewMode` boolean through that hook to neuter all of it for the ~5% of its logic actually needed for a static render would leave far more surface area than reusing a component that already has none of that logic to begin with. The editor's job after this migration is "edit one specific paid `Creation`" — a fundamentally different responsibility than "render a template with fixed sample data," and the codebase already keeps those two responsibilities in separate component trees (editor vs. gallery-preview). This spec keeps that separation rather than collapsing it.

**Concrete change:** new route `src/app/[locale]/(public)/preview/[templateId]/page.tsx` (public route group, matching `/p/[slug]` and `/demo` — no auth, no locale-gated middleware concern per `src/middleware.ts:69`). Renders `<TemplatePreview componentKey={templateIdToComponentKey(templateId)} />` (`src/components/templates/registry.ts:74-79` already has this conversion helper) full-screen, with a persistent "אישרו והתחילו להתאים אישית — ₪{price}" CTA that starts checkout (§6.2). The existing internal `(main)/preview` QA tool is retired in favor of this route (it becomes redundant — same components, same data, now public); its 6-template hardcoded switch is replaced by driving off `templateIdToComponentKey()` for all 21.

Un-personalized, unsaved, unauthenticated: **confirmed by construction** — the preview route never mounts `useTemplateData`, never calls a server action, and the sample data is a compile-time constant, not user input.

### 6.2 Sequence

| # | Actor | Action | File |
|---|---|---|---|
| 1 | Client | Browses gallery or lands on `/preview/[templateId]` (no auth) | existing `TemplateCard.tsx` + new `preview/[templateId]/page.tsx` |
| 2 | Client | Clicks "Personalize — ₪X" | new `CTA` in the preview page |
| 3 | Client | If not authenticated: login gate (existing `LoginModal`, unchanged — `src/components/auth/`) | existing |
| 4 | Client | Add-on picker: AI message / custom slug (with live availability check) / extended lifetime | new `src/components/checkout/AddOnPicker.tsx` (replaces v1's `CheckoutModal.tsx` naming — same role) |
| 5 | Client | If `custom_slug` selected: debounced availability check | new `src/actions/creations/checkSlugAvailability.ts` (unchanged from v1) |
| 6 | Client | Submit: `{ templateSlug, addOns: AddOnCode[], requestedCustomSlug? }` — **no metadata, no prices** | new `src/actions/orders/createOrder.ts` |
| 7 | **Server** | `protectedAction` + `validateOrigin()` + rate limit. Re-check slug availability. Look up `templates.base_price_agorot` + `add_on_prices` by `(code, complexityTier)`. Build items. Assert `total ≤ 2000` agorot. | `createOrder.ts` → `src/lib/pricing/buildCart.ts` |
| 8 | **Server** | Insert `CreationOrder` (`status = pending`, `templateId`, `requestedCustomSlug`, generated `idempotencyKey`) + `OrderItem` rows. **No `Creation` row yet.** Return `{ orderId, items, totalAgorot }`. | same |
| 9 | Client | Invoke Sumit Payments JS with the itemized cart — one `Item` per line (base template, then each add-on) | new `src/lib/sumit/client.ts` + `src/components/checkout/SumitCheckout.tsx` |
| 10 | Sumit | POST payment result | new `src/app/api/webhooks/sumit/route.ts` |
| 11 | **Server (webhook)** | Verify signature → resolve order → idempotency check → **one transaction**: `order.status = paid`, `paidAt`, `sumitPaymentId`, `sumitDocumentId`; **insert `Creation`** with `status = paid_editing`, `templateId` (from order), `orderId`, `customSlug = order.requestedCustomSlug` (re-validated for uniqueness inside the transaction), `metadata = {}`, `expiresAt = null`; increment `templates.uses`. Emit `order.paid` + `creation.created`. | webhook route + new `src/lib/sumit/applyPaidOrder.ts` |
| 12 | Client | Redirect to `/create/[creationId]` — the **real, personalized editor**, now scoped to one paid `Creation` | rewritten `src/app/[locale]/(main)/create/[creationId]/page.tsx` (param renamed from `[templateId]`, see §6.5) |
| 13 | Client | User fills real content, any amount of time, any number of edits, autosaved via `PATCH`-style updates | rewritten `useEditorState.ts` (see §6.5) |
| 14 | Client | User clicks **"קבלו קישור" (Get Link)** — explicit finalize action | rewritten `SuccessModal`-adjacent flow (see §6.6) |
| 15 | **Server** | `finalizeCreation(creationId)`: `status = active`, `expiresAt = finalizedAt + (365 or 90) days`, `finalizedAt = now()`. Emit `creation.finalized`. | new `src/actions/creations/finalizeCreation.ts` |
| 16 | Client | Shown `/p/{customSlug ?? creationId}` | existing `SuccessModal.tsx`, rewired |

### 6.3 What this removes that v1 didn't know to remove

Because personalization now happens strictly *after* payment (and payment requires login, per step 3), there is no longer any pre-login personalized content to preserve. **The entire guest-draft mechanism is dead code**, not found by v1's audit because v1 assumed pay-at-publish (personalization before login was still possible then). Confirmed dead by re-reading this session:

- `src/actions/draftActions.ts` (`saveGuestDraft`, `claimGuestDraft`) — only ever called to preserve editor content typed before an OAuth redirect (`src/components/editor/hooks/useDraftState.ts:9,46`, `useEditorState.ts`'s `saveDraftAndRedirect` path). No pre-payment editor content exists any more.
- `src/actions/oauthDraft.ts` (`setOAuthDraftCookie`) — exists solely to carry a `draftId` across the OAuth redirect for the above.
- `src/components/editor/hooks/useDraftState.ts` — the hook wiring both together.
- The `Draft` Prisma model (`prisma/schema.prisma:180-186`) and its cron cleanup (referenced at `draftActions.ts:14`).

All four are deleted in §7, not adapted. Login before checkout (step 3) can use the existing `LoginModal` unchanged — it already supports "log in, then continue an in-progress action," just repointed at "continue to checkout" instead of "continue to draft restore."

### 6.4 Entitlement is granted only by the webhook — unchanged principle, restated for the new model

No client-originated call may set `CreationOrder.status = paid` or insert a `Creation` row. The only writer is `src/lib/sumit/applyPaidOrder.ts`, called exclusively from `src/app/api/webhooks/sumit/route.ts` after signature verification. This remains the fix for **[PMR §2 P1]** — `upgradeSubscription.ts` is deleted, not patched (§7 step 1).

New failure mode specific to pay-before-create: the webhook's slug re-check (step 11) can fail if a second browser tab or a slow race bought the same `requestedCustomSlug` first. Resolution: the transaction still creates the `Creation` (payment was real, the buyer must get *something*), but with `customSlug = null` instead of the requested one, and emits `addon.granted` with a `degraded: true` flag the client reads to show "your chosen link name was taken — pick another, no extra charge" using the still-available custom-slug UI inside the now-unlocked editor. The AI and extended-lifetime add-ons are unaffected by this race (nothing to collide on), so a slug collision degrades exactly one line item, never the whole order.

Webhook route location, signature verification (HMAC-SHA256, raw body, `timingSafeEqual`, 5-minute timestamp window) — **unchanged from v1 §6.2**.

### 6.5 The editor is rewritten to operate on an existing paid `Creation`, not author a new one

`useEditorState.ts` currently (`src/components/editor/hooks/useEditorState.ts:22-141`) takes a bare `templateId`, manages a brand-new in-memory `userChoices` object via `useTemplateData`, and only persists on final submit. New responsibility:

- Route param becomes `creationId` (route folder renamed `create/[templateId]` → `create/[creationId]`, `src/app/[locale]/(main)/create/[templateId]/page.tsx` → `.../[creationId]/page.tsx`).
- On mount: fetch the `Creation` row (new `src/actions/creations/getEditableCreation.ts` — `protectedAction`, verifies `creation.userId === user.id` and `creation.status === 'paid_editing'`; a `status === 'active'` creation is no longer editable — see §6.6's immutability note), derive `templateId` from `creation.templateId`, seed `useTemplateData` from `creation.metadata` (falling back to `resolveDefaultData` only for fields absent from a fresh, empty-metadata creation).
- Every field change debounced-persists via a new `updateCreationMetadata(creationId, metadata)` server action (`PATCH`-shaped, replaces the old single-shot `submitGenericCreation`/`persistCreation.ts` insert). No quota check, no premium check, no expiry calc — all of that already happened at checkout.
- `isPremiumTemplate` / `isEffectivelyFreeUser` / `computeGuard` (`useEditorValidation.ts:46-58`) are deleted outright — nothing left to gate; the creation is already paid for by construction.
- AI generation (`AiAssistButton.tsx` → `generateAiText`) gains one check: the creation's order must contain an `ai_message` `OrderItem`, and `creation.aiGenerationsUsed < 20` (§5.3); no tier check.

### 6.6 Finalize step — recommendation and reasoning

**Recommendation: yes, an explicit finalize step ("קבלו קישור" / "Get Link"), and the `expiresAt` clock starts at finalize, not at payment.**

Reasoning:

- **Wasted lifetime otherwise.** If `expiresAt = paidAt + 90 days` were set at webhook time, a buyer who takes three days to finish personalizing has already burned three days of a purchased, finite window before anyone has seen the card. There is no equivalent problem with starting the clock at finalize.
- **Half-finished content must never be publicly reachable.** With `status = paid_editing` gating the `/p/[slug]` read path (identical mechanism to v1's `pending` gate, just relabeled), a buyer who copies the URL early, or whose tab is inspected, or who abandons mid-edit, never exposes an incomplete card. This matters more here than in v1's model, because now *every* creation passes through an editing window after the row exists (in v1, editing happened before the row existed).
- **Matches the site's own existing mental model.** The current flow already treats "generate the link" as a distinct, deliberate commit separate from typing content — `pushToDataLayer({event: "generate_link", ...})` fires only at `CreationConfirmModal`'s confirm click (`CreationConfirmModal.tsx:73`), not on every field edit. This spec keeps that same "editing is provisional, publishing is a commit" shape; it just moves where in the timeline the commit happens.
- **No new payment interaction required.** Finalize is a status flip on an already-paid, already-owned row — not a second checkout, not a second Sumit call. Low implementation cost for the retention/quality benefit above.
- **Editability after finalize:** none. Once `status = active`, the editor's `getEditableCreation` check (§6.5) refuses further edits — consistent with v1's existing product copy at `faq.json:27` ("לאחר יצירת הקישור, לא ניתן לערוך אותו" — "once a link is created, it can no longer be edited"), which this spec's finalize step directly implements rather than contradicts.

No time limit is imposed on the `paid_editing` window itself in v1 of this feature (an abandoned paid-but-never-finalized creation is a support/analytics concern, not a blocking one) — flagged as an open item in §8.

### 6.7 Failure, timeout, refunds — unchanged mechanism from v1, restated briefly

- Order stuck `pending` (webhook never arrives) → no `Creation` was ever created, nothing to clean up beyond the order row itself; sweeper marks orders `pending` > 2 hours as `failed`.
- Webhook body valid but `applyPaidOrder` throws mid-transaction → 5xx, Sumit retries, atomic transaction means no partial `Creation`/order state.
- **Refund**, now against a `Creation` that may be `paid_editing` or `active`: `CreationOrder.status = refunded`, `Creation.status = refunded` regardless of which state it was in. If `active`, the link dies immediately (same read-path gate as v1). If still `paid_editing`, the editor becomes inaccessible the same way. Custom slug released (`customSlug = null`) either way. No photo-deletion step (add-on gone). `OrderItem`/`Creation` rows retained for accounting, same as v1.

---

## 7. Migration plan — **full removal, no grandfathering, explicit sweep step**

**Chosen strategy, stated plainly per the go-ahead in §1.4: full removal of the existing subscription/premium-tier code and schema, rebuilt from scratch. Not incremental adaptation. No backfill, no dual-read period, no `NOT VALID` CHECK for legacy rows — v1's step 5 (backfill) is deleted from this plan entirely, because §1.4 confirms zero rows need it.**

Ordered. Each step is PR-sized.

1. **Neutralise the live vulnerability first, independent of everything else.** Delete `src/actions/subscription/upgradeSubscription.ts` + its barrel exports (`src/actions/subscription/index.ts`, `src/actions/index.ts:39`); delete `src/hooks/usePricingUpgrade.ts`. Set `NEXT_PUBLIC_ENABLE_UPGRADES` to `false` or remove it from wherever it's set in deploy config (it was never in `.env.example` — §1.4). Ships same day, does not wait for the rest.
2. **Close the template seed gap.** Add `bar-bat-mitzvah` to `../db/schema.sql` (values from `../supabase/migrations/20260419_add_bar_bat_mitzvah.sql`) — **[PMR §2 P11]**, unchanged from v1.
3. **Delete the dead duplicate creation path.** `src/actions/creations/create.ts` (unused JSON path — only `submitGenericCreation` → `persistCreation.ts` is live).
4. **Delete the entire guest-draft mechanism** (new to this revision, §6.3): `src/actions/draftActions.ts`, `src/actions/oauthDraft.ts`, `src/components/editor/hooks/useDraftState.ts`, `Draft` model in `prisma/schema.prisma:180-186` + its table, and the cron job that cleans it (find via the reference at `draftActions.ts:14`, confirm exact cron config location, remove).
5. **Schema migration — new structures.** `prisma/schema.prisma` + matching `../db/schema.sql` migration: enums `ComplexityTier`, `AddOnCode`, `CreationStatus` (3 values, not 5), `OrderStatus`; tables `add_on_prices` (9 rows), `creation_orders`, `order_items`; `templates.complexity_tier`, `templates.base_price_agorot`; **rebuild `creations`** — this is a rebuild, not an ALTER, because `orderId`/`templateId` become required and `metadata` becomes non-null with a default (§5.3). Given zero paying users and (confirm before running) an acceptably small total `creations` row count, the simplest correct migration is: drop and recreate the `creations` table, or `TRUNCATE` + re-add columns — whichever the execution agent judges lower-risk against the actual table size at migration time. **This is only safe because §1.4 confirms no paid entitlement has ever existed to lose** — free/unpaid historical creations are not "paying users" and this spec does not require preserving them; confirm with the team whether historical creation *rows* (not entitlements) should be preserved for analytics before choosing truncate vs. rebuild.
6. **Schema migration — drops.** `subscription_policies`; `profiles.{subscription_tier,creations_count_free,creations_count_pro,additional_creation_free,additional_creation_pro,premium_start,premium_expiry}`; `templates.{is_premium,expiration_policy}`; `creations.is_paid` (already gone if step 5 rebuilt the table); index `idx_profiles_subscription`.
7. **New pricing lib.** `src/lib/pricing/buildCart.ts`, `src/lib/pricing/constants.ts` (`CEILING_AGOROT = 2000`, `BASE_LIFETIME_DAYS = 90`, `EXTENDED_LIFETIME_DAYS = 365`, `AI_GENERATIONS_PER_CREATION = 20`), `src/lib/validations/slug.ts` (unchanged rules from v1 §5.3).
8. **New preview route.** `src/app/[locale]/(public)/preview/[templateId]/page.tsx` driving `TemplatePreview` off `templateIdToComponentKey()` for all 21 templates (§6.1); delete `src/app/[locale]/(main)/preview/{page.tsx,loading.tsx,preview.sample-data.ts}` (superseded); remove the now-redundant `/preview` disallow line from `src/app/robots.ts:8` only if the new public preview route should be indexable — judgment call, default to keeping it disallowed until SEO strategy says otherwise, but move the line to cover the new path if kept.
9. **Orders + Sumit.** New: `src/actions/orders/createOrder.ts`, `src/actions/creations/checkSlugAvailability.ts`, `src/actions/creations/getEditableCreation.ts`, `src/actions/creations/updateCreationMetadata.ts`, `src/actions/creations/finalizeCreation.ts`, `src/lib/sumit/{client,verifySignature,applyPaidOrder}.ts`, `src/app/api/webhooks/sumit/route.ts`. Env: add `SUMIT_API_KEY`, `SUMIT_COMPANY_ID`, `SUMIT_WEBHOOK_SECRET`, `NEXT_PUBLIC_SUMIT_PUBLIC_KEY` to `.env.example`; remove any trace of `NEXT_PUBLIC_ENABLE_UPGRADES`/`NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED` from deploy config outside the repo (Vercel/host env vars — cannot be swept by grep, flag explicitly for the execution agent to check the hosting dashboard). Audit events per §5.5.
10. **Rewrite the editor for the new lifecycle.** Rename route `create/[templateId]` → `create/[creationId]`; rewrite `useEditorState.ts` per §6.5 (fetch existing `Creation`, PATCH-style persistence, delete `isPremiumTemplate`/quota/guard logic); delete `useEditorValidation.ts`'s `computeGuard` and the `PrePublishGuard` type entirely (nothing left to guard); rewrite `CreationConfirmModal.tsx` → new `AddOnPicker.tsx` (pre-payment cart, not post-edit tier choice) and a separate finalize-confirmation UI for "Get Link"; delete `ConfirmModalHeader.tsx`, `TierCard.tsx`, `PaidQuotaModal.tsx`/`PaidQuotaBody.tsx`, `QuotaModal.tsx`, `PremiumTemplateUpgradeModal.tsx` outright (§1.4 confirms none of this ever gated a real payment).
11. **AI allowlist expansion + entitlement.** `src/lib/validations/ai.ts:12-16` — derive allowlist from all 21 templates' configs (textarea + long text fields) instead of the hardcoded 3-tuple. `src/actions/ai/generateText.ts` — entitlement check: creation's order has an `ai_message` `OrderItem` AND `creation.aiGenerationsUsed < AI_GENERATIONS_PER_CREATION`, increment on success. `src/lib/utils/rate-limiters.ts:50-54` — keep the 10/hour abuse limiter as a secondary guard, drop the "regardless of tier" comment (no longer accurate framing — say "gated by per-creation entitlement, this limiter is abuse protection only").
12. **Branding removal for paid.** Thread `status` through `TemplateRenderer` into a `BrandingGate` context so `FooterBranding` renders conditionally — every `Creation` reaching this component is paid by construction now, so the actual rule simplifies to "always hide `FooterBranding` on `/p/[slug]`" (the free/unpaid case that justified the conditional no longer exists). Simpler than v1's version of this step.
13. **UI teardown.** Delete `src/components/pricing/**`, `src/components/ui/UpgradeSlideOver*.tsx`, `src/components/profile/components/{SubscriptionCard,SubscriptionPlanCard,TemplateUsageCard}.tsx`, `src/actions/subscription/getPolicies.ts`, `src/lib/validations/subscription.ts`. Update `src/types/index.ts`, `src/lib/validations/{dashboard,profile,template,index,creation}.ts` (drop `quotaPreference` from `CreateCreationRequestSchema`, `src/lib/validations/creation.ts:18`), `src/lib/profileQueryData.ts`, `src/actions/{dashboard,profile/helpers,templates}.ts`, `src/hooks/{useActiveTemplates,useProfile,useDashboard}.ts` (drop `usePolicies.ts` entirely — no client-fetched policy table any more, prices come from the template/add-on lookup server-side only), `src/lib/creation-flow/errors.ts` (drop `isSubscriptionEffectivelyFree`, `resolveBlockedModalFromCreationResult`'s tier-related branches), `src/lib/auth/onboarding.ts`, `src/components/profile/{constants,types,hooks}`, `src/components/home/**`, `src/components/galleryTemplate/data/*.ts` (drop `isPremium` field, add price display from the template's `basePriceAgorot`), `TemplateCard.tsx` (lock badge → price badge).
14. **The i18n + sweep step — explicit checklist, matches §1.5's "Command C" table exactly:**
    - [ ] `src/messages/{he,en}/pricing.json` — full rewrite: per-template price list + add-on menu, replacing the 3-plan structure
    - [ ] `src/messages/{he,en}/faq.json:7,10-11,27` — rewrite the free-tier and Lite/Premium comparison answers to describe per-creation pricing + the three add-ons; the `:27` "one-time plan" sentence becomes simply accurate (delete the "or premium subscription" clause) rather than needing new copy
    - [ ] `src/messages/{he,en}/home.json:32,35-36` — replace pricing teaser with a "starting at ₪6.90" style teaser
    - [ ] `src/messages/{he,en}/editor.json:389-441,525-557` — delete the `tier.*`/`premiumUpgrade.*` blocks (dead — their UI is deleted in step 10); add copy for `AddOnPicker`, "Get Link" finalize confirmation, AI-entitlement messaging
    - [ ] `src/messages/{he,en}/gallery.json:25` — replace `"premium"` badge label with a price-shown badge (or delete if `TemplateCard.tsx` now renders the number directly)
    - [ ] `src/messages/{he,en}/profile.json:32-35,50,61` — delete `tier.*`/`upgradeToPremium`/`planLabel` (dead — `SubscriptionCard` deleted in step 13); optionally add an order-history section instead
    - [ ] `src/messages/{he,en}/meta.json:12-13` — reword `/pricing` page title/description away from "plans"
    - [ ] `src/messages/{he,en}/nav.json:3` — keep or reword the nav label (execution agent's call, noted in §1.5)
    - [ ] `src/messages/{he,en}/legal.json:148` — reword the digital-goods cancellation clause away from "premium content," keep the legal substance; `:78`'s Sumit mention stays as-is, now finally accurate
    - [ ] `.env.example` — confirm no `NEXT_PUBLIC_ENABLE_UPGRADES`/`NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED`, confirm new Sumit + `AI_GENERATIONS_PER_CREATION`-adjacent keys present
    - [ ] Re-run §1.5 Command A and Command B; both must return zero results under `src/`
    - [ ] `src/lib/audit-logger.ts` — confirm `subscription.purchased` removed, new events present
    - [ ] GTM: replace `generate_link` (`CreationConfirmModal.tsx:73`, deleted with that file) with a `creation.finalized`-triggered event at the new "Get Link" action
15. **Docs.** `CLAUDE.md` — replace the entire tier table and Business Logic Rules section with the per-creation model (base price by complexity tier, three add-ons, pay-before-create flow); drop the stale `src/lib/config/features.ts`/`src/lib/utils/image-utils.ts` references (already stale per PMR, unrelated to this migration but adjacent enough to fix while editing this section); drop the Supabase client table (stack is Prisma-only, already stale). `../README.md:276-292` — replace the tier table with the per-creation price table.
16. **Tests.** Vitest over `buildCart.ts` (every tier × every add-on subset ≤ ₪2000 agorot, including the event-critical/`extended_lifetime` special case from §4.2), `src/lib/validations/slug.ts` (reserved words, profanity, Hebrew transliteration, boundary lengths), `applyPaidOrder.ts` (idempotency — duplicate `sumitPaymentId` → no double `Creation` insert; the slug-collision degrade path from §6.4), `finalizeCreation.ts` (expiry calculated from `finalizedAt` not `paidAt`), refund revocation (both `paid_editing` and `active` starting states). Closes **[PMR §2 P12]**, unchanged goal from v1.

Rough scope: steps 1–4 ≈ 1 day (larger than v1's equivalent — draft-mechanism removal is new); 5–7 ≈ 2 days; 8 ≈ half a day (reusing an existing component is cheap); 9 ≈ 2 days; 10–12 ≈ 2.5 days (editor rewrite is more involved than v1's version, since the editor's data-loading model changes, not just its gating); 13–14 ≈ 2 days; 15–16 ≈ 1 day.

---

## 8. Non-goals and deferred items

**Confirmed in scope for first ship — none of these may be deferred:** AI message add-on, custom slug add-on, extended lifetime add-on. All three ship with the initial release, priced per §4.2.

**Photo upload — moved here per this revision.** No storage infrastructure exists (confirmed §1 v1, re-confirmed §1.3 above) and none is currently needed. Not a "later" item with a placeholder in the data model — fully absent from §3–§7.

Explicitly out of scope for first ship:

| Deferred | Reason |
|---|---|
| **Photo-upload add-on** | No storage infra exists; not currently needed (moved here per this revision — see §1.3) |
| Recurring / subscription billing | The model being replaced entirely |
| Bundles, credit packs, multi-creation discounts | Stated product decision |
| Installment payments (תשלומים) | Sumit supports it; a ₪6.90–20.00 cart doesn't warrant it |
| Multi-currency | ILS only; `currency Char(3)` column leaves room later |
| Payment-processor abstraction layer | Stated decision: Sumit-specific from day one |
| Partial refunds | Any refund revokes the whole creation (§6.7) |
| Automated image moderation | N/A — no images |
| Slug editing after finalize | Breaks already-shared links |
| Hebrew (non-ASCII) slugs stored verbatim | Unshareable when percent-encoded; transliteration instead |
| Seasonal automated price rotation | Manual column edit is sufficient |
| Gift purchase (A pays for B's creation) | No recipient-side account model exists |
| Team/business accounts, bulk sends | No demand signal in the codebase |
| Time limit on the `paid_editing` window | Support/analytics concern, not blocking for v1 — see §6.6 |
| Preserving historical free-tier `creations` rows through the schema rebuild | Product decision (§7 step 5) — no entitlement is lost either way, only optionally the row data itself |

**Open decisions resolved by this revision** (were open in v1, now settled): the free-preview boundary (§6.1 — resolved: reuse `TemplatePreview`, public route), free AI generations before purchase (§5.3 — resolved: moot, AI is bought as part of the same pre-editing order, per-creation cap of 20 replaces the free-trial-count question), legacy paid users (§1.4 — resolved: none exist).

**Still open, blocks nothing but should be confirmed before step 9:**

1. **Sumit account specifics.** Company id, whether the JS Payments API or a hosted redirect page is used, exact webhook payload field names — must come from the Sumit dashboard/docs; `src/lib/sumit/client.ts`'s field names need confirming against the live API. Unchanged from v1.
2. **Historical `creations` row preservation** during the step-5 schema rebuild — truncate vs. preserve for analytics (§7 step 5). Not a code question, a "does the team want the old free-tier usage history" question.
3. **Preview route indexability** (§7 step 8) — should `/preview/[templateId]` be crawlable, feeding SEO for template-specific search terms, or stay `disallow`ed like the internal tool it replaces?
