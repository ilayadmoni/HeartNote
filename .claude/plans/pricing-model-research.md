# Pricing Model Research — Free / Lite / Premium

Read-only investigation, 2026-09-04. All paths relative to `client/` unless prefixed `../`.

Stack note: backend is Prisma + plain Postgres (`prisma/schema.prisma`, `../db/schema.sql`). `supabase/migrations/` is historical only.

---

## 1. Current state (as found in code)

### 1.1 Source of truth for tier limits

| What | Where | Value |
|---|---|---|
| Creation limit + subscription duration per tier | `../db/schema.sql:212-215` (seed of `subscription_policies`, model at `prisma/schema.prisma:133-139`) | `free 5 / NULL`, `lite 2 / 2592000s (30d)`, `premium 6 / 3888000s (45d)` |
| Premium template flag | `templates.is_premium` boolean — `prisma/schema.prisma:102`, seeded per row `../db/schema.sql:219-238` | see §1.5 |
| Per-template link lifetime | `templates.expiration_policy` JSONB `{free_days, paid_days}` — `../db/schema.sql:219-238` | `free_days` 1 (2 for scratch-card, open-when); `paid_days` 14 (30 for interactive-events) |
| Hardcoded fallback free limit | `src/actions/creations/create.ts:105`, `helpers/persistCreation.ts:72`, `src/hooks/usePolicies.ts:24,36`, `src/components/editor/components/CreationConfirmModal.tsx:53`, `src/actions/profile/helpers.ts:22` | `3` (DB says 5) |
| Displayed prices | `src/components/pricing/constants/index.ts:9-51` | free 0, lite 12, premium 29, both paid `isComingSoon: true` |
| Displayed features copy | `src/messages/he/pricing.json` | see §3 drift |
| Add-on slots (unused by any UI/action) | `profiles.additional_creation_free/pro` — `prisma/schema.prisma:79-80` | read in quota math only |

Verdict on "configurable vs hardcoded": limits and durations are DB rows (no deploy needed to change), template gating is a DB boolean, but the 3 fallback and the free-tier expiry behaviour are code.

### 1.2 Enforcement — two duplicated paths

| Path | File | Used by |
|---|---|---|
| JSON action `createCreation` | `src/actions/creations/create.ts:79-127` | nothing in the editor (legacy) |
| FormData action `submitGenericCreation` → `persistCreation` | `src/actions/creations/helpers/persistCreation.ts:51-99` | the real editor flow: `src/components/editor/hooks/helpers/submitCreation.ts:25` |

Both re-implement identical logic (tier resolution, quota, expiry, watermark flag). They already diverge: paid-quota overflow throws `PAID_QUOTA_EXCEEDED` in `create.ts:121` but plain `QUOTA_EXCEEDED` in `persistCreation.ts:84`. `resolveBlockedModalFromCreationResult` (`src/lib/creation-flow/errors.ts:28-56`) maps those to different modals, so on the live path a paid user who hits their cap gets the free-tier "quota" modal, not `PaidQuotaModal`. Only the client pre-check in `src/components/editor/hooks/useEditorValidation.ts:46-58` shows the paid modal.

Shared helpers:
- Premium gate: `src/actions/creations/helpers/quotaCheck.ts:88-95` — 402 if `template.isPremium && tier === "free"`. Client mirrors at `useEditorState.ts:114`, `useEditorValidation.ts:47`; gallery only shows a lock badge `src/components/galleryTemplate/components/TemplateCard.tsx:43-47`.
- Expiry: `src/actions/creations/helpers/expiryCalc.ts:28-57`.
- Auto-downgrade on `premium_expiry < now`: `src/lib/subscription/checkAndDowngradeSubscription.ts:20-27,43-60` (also zeroes `creations_count_pro`).
- Public viewer expiry check: `src/actions/creations/read.ts:74-76` → 410.

### 1.3 How expiry really works

`expiryCalc.ts:34-46`:
- **Paid behaviour**: `expires_at = now + subscription_policies.default_expiry` (30/45 d). Template `paid_days` is ignored whenever a tier policy exists.
- **Free behaviour**: `expires_at = now + template.expiration_policy.free_days` → **24–48 hours**. `subscription_policies.free.default_expiry = NULL` is never consulted for creations.

So the documented "Free: no expiry" is false. Migration `../supabase/migrations/20260415_free_tier_no_expiry.sql` nulled the free policy row but no code reads it on the free path. Pricing copy `pricing.json → plans.free.features.5` ("תוקף הקישור: 24 שעות") matches code; CLAUDE.md and `../README.md:281` ("Never") do not.

`default_expiry` is overloaded: it is both the subscription length (`src/actions/subscription/upgradeSubscription.ts:32-38`) and every paid card's link lifetime (`persistCreation.ts:86`). A card made on day 44 of a 45-day Premium sub lives 45 more days.

### 1.4 Branding

- Watermark overlay + "made with" caption only when `!isPaid`: `src/app/[locale]/(public)/p/[slug]/client.tsx:61-70,86-92`.
- `FooterBranding` ("נוצר באמצעות HeartNote") is rendered **unconditionally** in every template, e.g. `src/components/templates/DateInvite/Desktop/DateInviteDesktop.tsx:132`, `LoveCoupons/Desktop/LoveCouponsDesktop.tsx:82`, `shared/InteractiveShell.tsx:36`. Paid tiers do not actually remove branding.
- `metadata.has_watermark` is written (`persistCreation.ts:92`) but never read anywhere.

### 1.5 Quota-preference quirk

Paid users can pick `quotaPreference = "free"` on non-premium templates (`CreationConfirmModal.tsx:38-48,71`, `persistCreation.ts:59-62`). Result: watermark + 1-day link + burns free quota while paying. Adds a decision step to the confirm modal for no user benefit.

### 1.6 Upgrade / payment plumbing

- `src/actions/subscription/upgradeSubscription.ts` flips tier for **any authenticated caller**: no payment, no `validateOrigin()`, no server flag, no rate limit. Only gate is client-side `NEXT_PUBLIC_ENABLE_UPGRADES` (`src/app/[locale]/(main)/pricing/page.tsx:23-24`) and `isComingSoon`.
- Phase A of `../.claude/plans/pre-payment-audit-and-sumit-readiness.md` (validateOrigin + `PAYMENTS_ENABLED`) is **not applied** — the file still lacks both.
- No Sumit code, env vars, webhook route, or payment table exist (`grep -ri sumit src` hits only `messages/*/legal.json:78`). Audit event union has `subscription.purchased` only (`src/lib/audit-logger.ts:14`).
- CLAUDE.md's `NEXT_PUBLIC_SUBSCRIPTIONS_ENABLED` / `src/lib/config/features.ts` do not exist.

### 1.7 AI generation — already shipped, ungated

- Action: `src/actions/ai/generateText.ts` (protectedAction + CSRF + Zod allowlist). Provider: any OpenAI-compatible endpoint via `AI_API_URL/AI_MODEL/AI_API_KEY` (`src/lib/ai/client.ts`, `.env.example:47-57`).
- Allowlist is 3 fields only: `surprise-gift.greeting`, `birthday-candles-interactive.message`, `scratch-card.prizeContent` (`src/lib/validations/ai.ts:12-16`).
- Rate limit 10/hour/user "regardless of subscription tier" (`src/lib/utils/rate-limiters.ts:46-54`). No tier check anywhere. UI button `src/components/editor/components/AiAssistButton.tsx` renders for everyone.
- `../.claude/plans/smart-blessing.md` describes a second, unbuilt Gemini-based feature ("all templates, all tiers") that overlaps this.

### 1.8 Tests

No test file references quota, subscription, or premium (`grep -rl` over `*.test.ts*` → empty).

---

## 2. Problems, ranked by conversion impact

| # | Severity | Problem | Location |
|---|---|---|---|
| P1 | Critical | Any signed-in user can self-grant Premium. Makes every pricing decision moot until fixed. | `src/actions/subscription/upgradeSubscription.ts` (whole file) |
| P2 | Critical | Inverted count ladder: Free 5 lifetime vs Lite 2 per 30 d. Pricing page literally shows "עד 5 יצירות חינמיות לכל החיים" next to "2 יצירות פרימיום". | `../db/schema.sql:212-215`; `pricing.json plans.free.features.4`, `plans.lite.period` |
| P3 | High | Pricing page promises features that don't exist or aren't delivered: image upload (no `image` field type exists in `src/components/editor/configs/*` — types are text/textarea/color/number/select/options/coupons/envelopes/events/questions), "הסרת סימן המים" (footer branding stays, §1.4), link validity "14-30 ימים" (actual 30/45). | `pricing.json plans.lite/premium.features.3-5`; `FooterBranding` call sites |
| P4 | High | Free link dies in 24 h. Recipients open dead links → brand damage; sender never sees the "upgrade" moment because the card already worked once. Docs claim the opposite. | `expiryCalc.ts:44-46`; `../db/schema.sql:219-238 free_days` |
| P5 | High | AI (top conversion lever) given away to Free at same rate as Premium, on only 3 fields. | `rate-limiters.ts:50-54`, `validations/ai.ts:12-16` |
| P6 | Medium | Duplicate enforcement with diverging error codes; paid-quota modal unreachable on live path. | `create.ts:79-127` vs `persistCreation.ts:51-99`, `errors.ts:28-56` |
| P7 | Medium | `default_expiry` conflates subscription length and card lifetime. Cannot tune one without the other. | `upgradeSubscription.ts:32-38`, `persistCreation.ts:86` |
| P8 | Medium | Paid users offered "use free quota" option → watermarked card while paying. | `CreationConfirmModal.tsx:38-48,71-81` |
| P9 | Low | Fallback `3` hardcoded in 5 places vs DB `5`; UI may briefly show wrong numbers. | list in §1.1 |
| P10 | Low | Docs drift: CLAUDE.md/README "no expiry", nonexistent `features.ts`, Supabase references; static gallery `isPremium` flags disagree with DB (`baseTemplatesA.ts:71` surprise-gift true vs DB false; love-coupons/timeline DB true vs client unset) — harmless because DB wins at `useActiveTemplates.ts:56`, but misleading. | as listed |
| P11 | Low | `bar-bat-mitzvah` exists in registry and prod migration but not in `../db/schema.sql` seed → filtered out of local gallery (`useActiveTemplates.ts:51-52`). | `../supabase/migrations/20260419_add_bar_bat_mitzvah.sql` vs `../db/schema.sql:219-238` |
| P12 | Low | Zero automated tests over quota/tier logic. | — |

---

## 3. Recommended target model

Principle: every axis must increase Free → Lite → Premium. Free is a taste, not a lifetime allowance.

| Axis | Free | Lite (₪12) | Premium (₪29) |
|---|---|---|---|
| Creations | **2 lifetime** | **5 per 30-day cycle** | **15 per 45-day cycle** |
| Card link lifetime | **7 days** | **30 days** | **90 days** (independent of sub end) |
| Templates | `min_tier = free` only | free + lite | all |
| Branding | watermark + footer + caption | none | none |
| AI generations | **3 lifetime** (all AI-enabled fields) | **30 / cycle** | **150 / cycle** (fair-use) |
| Custom colours | yes (already) | yes | yes |
| Add-on packs | can buy single-template pass (§4) | +creations pack | +creations pack |

Rationale:
- 2 free creations + 7-day link is enough to experience the product and for the recipient to actually open it; the 3rd card is the conversion moment.
- Lite 5/30 d beats Free on every axis and stays cheap. Premium is ~3× Lite in slots and 3× link life, matching the ~2.4× price.
- AI counts are the primary Lite→Premium differentiator once AI is on more fields.
- 90-day Premium link solves the day-44 problem in §1.3 and matches real usage of `open-when` / `love-coupons` (multi-week redemption).

DB values this maps to: `subscription_policies` rows become `(free, 2, NULL)`, `(lite, 5, 2592000)`, `(premium, 15, 3888000)` plus a new `link_days` column `7 / 30 / 90` (§5).

---

## 4. Per-template pricing table

Complexity = LOC across template dir + motion/confetti usage (`find … | wc -l`). Usage = `templates.uses` in `../db/schema.sql` seed (prod snapshot). Tags `popular` on date-invite, decision-wheel, scratch-card.

| Slug | Name | Today | Uses | Complexity | Recommended tier | Justification | Standalone add-on? |
|---|---|---|---|---|---|---|---|
| date-invite | הזמנה לדייט | free | 27 | 450 LOC, confetti | **Free** | Top funnel entry, casual, most used | No — keep as acquisition bait |
| scratch-card | גרד וגלה | free | 20 | 502, confetti | **Free** | 2nd most used, has AI field → showcases AI teaser | No |
| decision-wheel | גלגל ההחלטות | free | 6 | 557, confetti | **Free** | Popular tag, low-stakes game | No |
| surprise-gift | מתנה בהפתעה | free | 6 | 475, confetti | **Free** | Casual, AI field, recipient shares it onward | No |
| punching-bag | שק האיגרוף | free | 0 | 411 | **Free** | Novelty, zero-stakes | No |
| excuse-generator | מכונת התירוצים | free | 0 | 330 | **Free** | Novelty | No |
| slot-machine | מכונת ההבטחות | free | 1 | 392 | **Lite** | Animated, romantic promise; mid-value | No |
| apology-search | חיפוש סליחה | free | 0 | 387 | **Lite** | Typing animation, emotional but casual | No |
| relationship-quiz | חידון חברות | premium | 4 | 455, 6 motion files | **Lite** | Interactive logic, replayable, not occasion-critical | No |
| timeline | ציר זמן | premium | 6 | 341 | **Lite** | Anniversary use; personal but simple render | Yes — anniversary one-off buyers |
| birthday-candles-interactive | עוגת יום הולדת | premium | 0 | 341 | **Lite** | Recurring occasion drives repeat; AI field | Yes — cheap single pass (₪9) |
| holiday-rosh-hashanah / passover / purim / shavuot / sukkot / hanukkah | חגים אינטראקטיביים | premium | 0 | 44 each on 656-LOC shared engine | **Lite**, with the in-season one temporarily **Free** | Seasonal, near-zero marginal cost; free rotation creates acquisition spikes before each holiday | No (seasonal bundle at most) |
| love-coupons | קופונים מיוחדים | premium | 8 | 623, redeem action + verification code | **Premium** | Most complex; multi-week redemption needs 90-day link | Yes — gift-occasion buyers |
| open-when | מכתבים מיוחדים | premium | 3 | 653, date-locked envelopes | **Premium** | Date locks require long link life; high emotional stakes | Yes |
| bar-bat-mitzvah | בר/בת מצווה | premium (prod only) | — | 513 | **Premium** | Occasion-critical family event | **Yes** — one-off event buyers will never subscribe |
| wedding-glass-interactive | חתונה אינטראקטיבית | premium | 0 | 204 (+ shared) | **Premium** | Occasion-critical | **Yes** |

Add-on rule of thumb: sell standalone only where the buyer has a single dated event (mitzvah, wedding, anniversary, birthday gift). Casual/game templates stay subscription-only so they keep pulling users up the ladder.

Gating mechanics (uses real structures): replace `templates.is_premium` boolean with `templates.min_tier TEXT CHECK IN ('free','lite','premium')` + nullable `templates.addon_price_agorot INT`. Rank map `{free:0, lite:1, premium:2}` in one helper; `checkPremiumAccess(template.minTier, userTier)` in `quotaCheck.ts` throws 402 when `rank(user) < rank(template)` unless a row exists in a new `template_entitlements` table (§5). Client: `useActiveTemplates.ts` exposes `minTier`, `TemplateCard.tsx` badge text keyed by tier, `useEditorState.ts:114` / `useEditorValidation.ts:47` compare ranks.

---

## 5. Implementation plan sketch (not implemented)

Ordered; each step is a separate PR-sized chunk.

1. **Lock the upgrade action** (P1) — `upgradeSubscription.ts`: add `validateOrigin()`, `PAYMENTS_ENABLED` server gate, rate limit; document env in `.env.example`. ~20 lines.
2. **Single enforcement path** (P6) — delete `createCreation` JSON path or make it call `persistCreation`; move tier/quota/expiry math into `src/lib/subscription/entitlements.ts` (rank map, `resolveAppliedQuota`, `resolveLinkLifetime`). Update `errors.ts` mapping. Files: `create.ts`, `persistCreation.ts`, `quotaCheck.ts`, `expiryCalc.ts`.
3. **Split expiry semantics** (P4, P7) — `prisma/schema.prisma` `SubscriptionPolicy`: add `linkDays Int` (`link_days`), keep `default_expiry` as subscription length only. Migration in `../db/` (+ mirror in `supabase/migrations/` if prod still runs there). `expiryCalc.ts` reads `linkDays` for all tiers; drop `expiration_policy.free_days/paid_days` from templates or keep as per-template override. Remove the `templateFreeDays` throw at `useEditorState.ts:39-44` and `CreationConfirmModal` expiry preview to read policy.
4. **Update seed values** (P2) — `../db/schema.sql:212-215` + migration: `(free,2,NULL,7)`, `(lite,5,2592000,30)`, `(premium,15,3888000,90)`. Replace `?? 3` fallbacks (5 sites) with a shared `DEFAULT_FREE_LIMIT` constant or a 500 on missing policy (`fetchPolicyLimit` already does this in `quotaCheck.ts:70-81`).
5. **Per-template tier** (§4) — schema: `min_tier`, `addon_price_agorot`; `mapTemplateRow` in `src/actions/templates.ts:14-26`; `TemplateResponse` in `src/lib/validations/template.ts`; `useActiveTemplates.ts`; `TemplateCard.tsx`; `getPopularTemplates` orderBy; static `isPremium` flags in `galleryTemplate/data/*.ts` removed. New `template_entitlements(user_id, template_slug, granted_at, expires_at, payment_event_id)` for add-ons.
6. **Branding truly off for paid** (P3) — pass `isPaid` from `p/[slug]/page.tsx:118` through `TemplateRenderer` → every template conditionally renders `FooterBranding` (21 call sites; or wrap in `InteractiveShell`/a `BrandingGate` context). Delete unused `has_watermark` metadata writes.
7. **AI tier gating** (P5) — `rate-limiters.ts`: per-tier limiter config; `generateText.ts`: read tier via `fetchProfileForQuota`, pick limiter, count lifetime uses for Free (new `profiles.ai_generations_used` or Redis key); `AiAssistButton.tsx` shows remaining / upgrade CTA; extend `AI_ASSISTABLE_FIELDS` to all `textarea` fields. Retire or merge `smart-blessing.md` plan.
8. **Remove free-quota option for paid users** (P8) — `CreationConfirmModal.tsx` + `ConfirmModalHeader.tsx`: drop tier selector; `validateSubmit.ts` ignores `quotaPreference`.
9. **Pricing page truth** (P3) — `pricing.json` (he + en) features rewritten from the §3 table; remove image-upload line until the field type exists; `constants/index.ts` feature keys.
10. **Sumit** — per existing plan Phase C: `app/api/webhooks/sumit/route.ts`, `lib/sumit/verifySignature.ts`, `actions/subscription/initiateCheckout.ts`, `payment_events` table, audit events `subscription.payment_received/failed`, `usePricingUpgrade.ts` redirect flow. Add-on purchases reuse the same webhook with `product_type = 'template_pass' | 'creation_pack'`.
11. **Tests** — Vitest for `entitlements.ts` (rank gating, quota math, link lifetime per tier), `resolveBlockedModalFromCreationResult`.
12. **Docs** — CLAUDE.md tier table, env var list, drop `features.ts` reference; README tier table; add `bar-bat-mitzvah` to `../db/schema.sql` seed.

Rough scope: steps 1–4 ≈ 1 day; 5–9 ≈ 2 days; 10 ≈ 1.5–2 days; 11–12 ≈ 0.5 day.

---

## 6. Open questions (product decisions needed first)

1. Billing model: is Lite/Premium a **recurring monthly** subscription or a **one-time pass** for 30/45 days? Current code (`upgradeSubscription`) and copy ("תוקף הכרטיסייה") behave like a pass. Sumit flow and the "cycle" wording in §3 depend on this.
2. Confirm ₪ price points: 12 / 29 are placeholders in code. Add-on template pass price (suggested ₪9–15) and creation-pack price.
3. Should Premium be **unlimited** creations with fair-use rate limit instead of 15? `quotaCheck.ts:10` comment says premium is unlimited; code enforces 6.
4. Free link lifetime: 7 days (recommended) vs keep 24 h as a hard conversion lever.
5. Do existing paid users (if any) keep grandfathered limits when `subscription_policies` rows change? `checkAndDowngradeSubscription` zeroes counters on downgrade, but a live sub would silently gain slots.
6. Holiday templates: rotate the in-season one to Free automatically (needs a date-driven `min_tier` override) or manual DB flip before each holiday?
7. AI: unify on the existing OpenAI-compatible `generateAiText` or proceed with the Gemini `smart-blessing` design? Two parallel AI features would split the quota model.
8. Image upload is advertised on the pricing page but does not exist. Build it (needs storage + `image` field type) or remove the line?
9. Is the "paid user spends free quota" option intentional for any reason (e.g. keeping premium slots for premium templates)? If yes, it needs clearer UX; if no, remove.
