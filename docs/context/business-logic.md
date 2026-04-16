# HeartNote Business Logic

---

## Subscription Tiers

`lite` and `premium` are both paid tiers with identical benefits but different limits.

| Tier | Creations | Expiry | HeartNote Branding | Premium Templates |
|---|---|---|---|---|
| `free` | 5 | None (no expiry) | Shown | No |
| `lite` | 2 | 30 days | Hidden | Yes |
| `premium` | 6 | 45 days | Hidden | Yes |

**Tracked in**: `profiles.subscription_tier` (CHECK constraint: `'free'`, `'lite'`, `'premium'`).

**Quota config**: stored in `subscription_policies` table keyed by `tier_code`. `creation_limit` = max creations, `default_expiry` = seconds until a paid creation expires.

**Bonus quotas**: `profiles.additional_creation_free` and `profiles.additional_creation_pro` can be set manually to grant extra slots beyond the tier limit.

---

## Creation Flow

How a greeting card is created (`src/actions/creations/create.ts`):

1. **Input validation** — Zod parses `{ template_id, metadata, quotaPreference? }`
2. **Template lookup** — fetch `templates` row by `template_id` where `is_active = true`; 404 if missing
3. **Metadata validation** — validate `metadata` fields against the template's `config_schema`
4. **Subscription expiry check** — if `profiles.premium_expiry` < now and the user is trying to use a paid feature, throw 403 `SUBSCRIPTION_EXPIRED`
5. **Premium access guard** — if `template.is_premium = true` and `subscription_tier = 'free'`, throw 402 `PREMIUM_REQUIRED`
6. **Quota selection** — determine `appliedQuota`:
   - If template is premium → `"pro"` quota
   - If user is free tier → `"free"` quota
   - Otherwise → use `quotaPreference` from input (defaults to `"pro"`)
7. **Quota limit check** — if `appliedQuota = "free"` and `creations_count_free ≥ (free limit + additional_creation_free)`, throw 403; same check for `"pro"` against paid limit
8. **Expiry calculation** (`src/actions/creations/helpers/expiryCalc.ts`):
   - Paid creation: `now + subscription_policies.default_expiry` seconds
   - Free creation: uses `template.expiration_policy.free_days` (fallback: 1 day)
9. **Watermark flag** — `metadata.has_watermark = !isPremiumBehavior` written into the stored metadata
10. **INSERT** into `creations` — DB trigger `trg_handle_new_creation_quota` decrements `creations_count_free` or `creations_count_pro` atomically (prevents race conditions)
11. **Response** — returns `{ creationId, expires_at }`

---

## What happens when a user hits their creation limit

- The DB trigger validates quota on INSERT and will reject the row if the limit is exceeded
- Before that, `createCreation` does a fast-fail application-level check (step 7 above) to return a readable error: `ActionError(CREATION_ACTION_ERRORS.QUOTA_EXCEEDED, 403)`
- The client receives `{ success: false, error: "QUOTA_EXCEEDED", code: 403 }`
- The UI should redirect or prompt the user to upgrade their plan

Free users who hit the free quota can still create premium creations if they upgrade. Paid users who hit the paid quota are blocked until their subscription renews (or they receive a bonus via `additional_creation_pro`).

---

## Subscription Upgrade Flow

`src/actions/subscription/upgradeSubscription.ts`:

1. Input: `{ tierCode: "lite" | "premium" }`
2. Fetch `subscription_policies` row for `tierCode` to get `default_expiry` seconds
3. Calculate `premium_start = now`, `premium_expiry = now + default_expiry seconds`
4. Update `profiles` via admin client (bypasses RLS):
   - `subscription_tier = tierCode`
   - `premium_start`, `premium_expiry`
   - `creations_count_pro = 0` (reset counter on new subscription period)
5. Return `{ tierCode, premium_start, premium_expiry }`

**No payment processing** is currently wired into `upgradeSubscription`. The action directly writes to the DB. Payment integration (Stripe, etc.) must call `upgradeSubscription` after a successful payment event.

---

## Branding removal logic

The watermark flag is written into creation metadata at creation time:

```
metadata.has_watermark = !isPremiumBehavior
```

Where `isPremiumBehavior = (subscription_tier !== 'free') && (appliedQuota === 'pro')`.

- **Free creation** → `has_watermark: true` → HeartNote branding shown in the card renderer
- **Paid creation** → `has_watermark: false` → branding hidden

This flag is stored in the `creations.metadata` JSONB column and is read by the card renderer at display time. Changing a user's tier does not retroactively update existing cards — the watermark is fixed at creation time.

---

## Auto-downgrade on expiry

At the start of `createCreation`, if `profiles.premium_expiry < now` and the user is attempting a paid action, the action throws 403 `SUBSCRIPTION_EXPIRED`. The subscription is **not** automatically downgraded in the DB at this point — downgrade logic lives in `src/actions/creations/helpers/quotaCheck.ts` (`checkAndDowngradeSubscription`), which sets `subscription_tier = 'free'` if the expiry has passed.

---

## Registration & banned users

1. `registerUser` checks `banned_users` table first via admin client
2. Banned email → explicit error `"מייל לא חוקי"` (the only case that returns a specific error)
3. Existing non-banned email → generic success + "already have account" email via Resend (no enumeration)
4. New email → Supabase `auth.signUp()` → `handle_new_user()` trigger auto-creates `profiles` row
5. Account deletion adds the email to `banned_users` with `reason = 'self_deletion'`

---

## Public card access

`getCreation(id)` (`src/actions/creations/read.ts`) is a public endpoint (no auth):

1. Fetch creation row including joined template slug/name
2. If `is_deleted = true` → 410 Gone
3. If `expires_at` is set and in the past → 410 Gone
4. Return creation metadata to the card renderer at `/p/[slug]`

Free cards (`has_watermark: true`) show HeartNote branding in the renderer. Paid cards do not.
