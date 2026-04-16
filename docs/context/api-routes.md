# HeartNote API Routes & Server Actions

---

## Next.js API Routes

These are true HTTP endpoints under `client/src/app/api/`.

| Method | Path | File | Description |
|---|---|---|---|
| `POST` | `/api/auth/logout` | `app/api/auth/logout/route.ts` | Server-side logout. Clears SSR httpOnly auth cookies. Client-side `signOut()` alone does not clear these. |

---

## Server Actions

Server actions are TypeScript functions called directly from client components (not via fetch). They live in `client/src/actions/`.

### Authentication

| Function | File | Auth | Description |
|---|---|---|---|
| `loginAction(prevState, formData)` | `actions/auth.ts` | Public | Email/password login. Checks banned_users, rate-limits by IP (5/15min). Returns `LoginState`. |
| `registerUser(firstName, lastName, email, password, dob?, redirectTo?)` | `actions/registration.ts` | Public | 3-step registration: banned check → existing user notify → create account. Rate-limits by IP (3/hr). |
| `requestPasswordReset(email)` | `actions/password.ts` | Public | Sends password reset email via Supabase. Rate-limited. |
| `updatePassword(password)` | `actions/password.ts` | Protected | Updates the authenticated user's password. |

### Profile

| Function | File | Auth | Description |
|---|---|---|---|
| `getMyProfile()` | `actions/profile/get.ts` | Protected | Returns full profile + subscription info. Builds from `profiles` + `subscription_policies`. |
| `getAvatarOptions()` | `actions/profile/get.ts` | Public | Returns list of preset avatar URLs. No auth needed. |
| `updateMyProfile(input)` | `actions/profile/update.ts` | Protected | Partial update: `first_name`, `last_name`, `date_of_birth`, `avatar_url`. Zod-validated. Calls `revalidatePath`. |
| `deleteAccount()` | `actions/profile/delete.ts` | Protected | Deletes auth user + profile, adds email to `banned_users` with reason `'self_deletion'`. |

### Templates

All template actions are **public** (no auth required). Templates use the anon-key RLS `SELECT` policy.

| Function | File | Auth | Description |
|---|---|---|---|
| `getTemplates()` | `actions/templates.ts` | Public | All active templates (`is_active = true`). |
| `getPopularTemplates()` | `actions/templates.ts` | Public | Up to 4 templates with `tags = 'popular'`, free-first order. |
| `getTemplateBySlug(slug)` | `actions/templates.ts` | Public | Single active template by slug. |

### Creations

| Function | File | Auth | Description |
|---|---|---|---|
| `createCreation(input)` | `actions/creations/create.ts` | Protected | Full creation flow: validate → quota guard → expiry calc → insert. Quota decrement handled by DB trigger. |
| `submitGenericCreation(formData)` | `actions/creations/submit.ts` | Protected | FormData-based variant supporting optional file upload. |
| `deleteCreation(creationId)` | `actions/creations/delete.ts` | Protected | Soft-delete: sets `is_deleted = true`. Verifies ownership. |
| `getMyCreations()` | `actions/creations/read.ts` | Protected | User's non-deleted creations with joined template slug/name. |
| `getCreation(id)` | `actions/creations/read.ts` | **Public** | Single creation for shared links. Checks `is_deleted` and `expires_at`. Returns 410 for deleted/expired. |
| `redeemCreation(id)` | `actions/creations/redeem.ts` | Protected | Marks a creation as redeemed (recipient action). |

### Dashboard

| Function | File | Auth | Description |
|---|---|---|---|
| `getDashboard()` | `actions/dashboard.ts` | Protected | Returns quota stats from `profiles` + full creation history (including soft-deleted). |

### Subscription

| Function | File | Auth | Description |
|---|---|---|---|
| `upgradeSubscription(input)` | `actions/subscription/upgradeSubscription.ts` | Protected | Sets `subscription_tier`, `premium_start`, `premium_expiry`, resets `creations_count_pro = 0`. Uses admin client to bypass RLS. |

### Contact

| Function | File | Auth | Description |
|---|---|---|---|
| `sendContactEmail(formData)` | `actions/contact.ts` | Public | Sends contact form via Resend to `MAIL_HEART_NOTE`. Rate-limited (5/min/IP). HTML-escaped. |

### Drafts (internal)

| Function | File | Auth | Description |
|---|---|---|---|
| `saveDraft(...)` | `actions/draftActions.ts` | Protected | Saves an in-progress creation as a draft. |
| Various draft ops | `actions/draftActions.ts` | Protected | Get/update/delete drafts. |
| `saveOAuthDraft(...)` | `actions/oauthDraft.ts` | Public | Persists draft state during OAuth redirect flow. |

---

## Page Routes

### `(main)` group — public browsing + authenticated features

| Route | File | Notes |
|---|---|---|
| `/` | `app/(main)/page.tsx` | Home page |
| `/gallery` | `app/(main)/gallery/` | Template gallery (public) |
| `/create/[templateId]` | `app/(main)/create/[templateId]/` | Card editor. Auth guard at action level, not route level |
| `/preview` | `app/(main)/preview/` | Creation preview |
| `/preview-frame` | `app/(main)/preview-frame/` | Embeddable preview frame |
| `/profile` | `app/(main)/profile/` | User profile (middleware redirects incomplete profiles to `/complete-profile`) |
| `/complete-profile` | `app/(main)/complete-profile/` | Onboarding (middleware redirects complete profiles away) |
| `/pricing` | `app/(main)/pricing/` | Subscription/upgrade page |
| `/auth/reset-password` | `app/(main)/auth/reset-password/` | Password reset form |
| `/contact` | `app/(main)/contact/` | Contact form |
| `/faq` | `app/(main)/faq/` | FAQ |
| `/accessibility` | `app/(main)/accessibility/` | Accessibility statement |
| `/privacy` | `app/(main)/privacy/` | Privacy policy |
| `/terms` | `app/(main)/terms/` | Terms of service |

### `(public)` group — fully unauthenticated

| Route | File | Notes |
|---|---|---|
| `/p/[slug]` | `app/(public)/p/[slug]/` | Shared card viewer. Checks expiry + is_deleted via `getCreation()` |
| `/demo` | `app/(public)/demo/` | Template demo (no account needed) |

---

## Middleware route protection

`src/middleware.ts` has only two redirect rules. Everything else passes through:

| Condition | Action |
|---|---|
| Authenticated + incomplete profile + visiting `/profile` | Redirect → `/complete-profile?returnTo=/profile` |
| Authenticated + complete profile + visiting `/complete-profile` | Redirect → `?next` param, or `?returnTo` param, or `/` |

Auth infra routes are always bypassed: `/auth/callback`, `/auth/confirm`, `/auth/auth-code-error`, `/api/auth/*`.

The middleware does **not** block unauthenticated users from `/create/*`, `/gallery`, or any other route — auth is enforced at the server action level when the user actually tries to save.
