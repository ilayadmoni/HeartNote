# Replace Supabase Auth with custom auth (local Postgres)

## STATUS: DONE, verified live
Full auth loop tested end-to-end against the running app (not just type-check):
register → DB row + trigger-created profile (verified via script) → login →
session cookie set → /profile RSC renders real data → logout clears cookie.
Rate limiter (Upstash Redis) removed per user decision — no fallback, just gone.
Fixed a real bug found during verification: node-postgres returns
TIMESTAMP/DATE columns as JS Date objects, not strings like Supabase's
PostgREST did — added type parsers in src/lib/db.ts to normalize to ISO
strings, which is what the rest of the codebase expects everywhere.
Also fixed a real infra issue: a native Postgres install on the host was
already bound to port 5432, colliding with the Docker container — moved
the container to host port 5433 (docker-compose.yml + .env).
Google OAuth: code path implemented (src/lib/auth/google.ts,
app/auth/google/*) but UNTESTED — no real Google Cloud credentials
configured. Verify once GOOGLE_CLIENT_ID/SECRET are set.


## SCOPE UPDATE
supabase-js talks to Supabase's REST API — it cannot point at a plain
Postgres container at all. 32 files use `.from()` queries app-wide, not
just auth. Full scope now: rewrite every one of those 32 files' queries
to raw SQL via `src/lib/db.ts`. Confirmed with user — proceeding with all 32.

Files (from grep, `client/src`):
p/[slug]/page.tsx, actions/password.ts, actions/auth.ts, actions/registration.ts,
actions/creations/helpers/persistCreation.ts, actions/creations/create.ts,
components/auth/completeProfile/CompleteProfileForm.tsx, app/(main)/layout.tsx,
hooks/useProfileQuery.ts, actions/profile/update.ts, actions/profile/get.ts,
hooks/useProfile.ts, actions/draftActions.ts, actions/creations/read.ts,
actions/creations/helpers/quotaCheck.ts, components/auth/hooks/useAuthModalState.ts,
middleware.ts, app/(main)/profile/page.tsx, actions/dashboard.ts, lib/audit-logger.ts,
actions/subscription/upgradeSubscription.ts, actions/profile/delete.ts,
app/auth/callback/helpers.ts, hooks/usePolicies.ts,
lib/subscription/checkAndDowngradeSubscription.ts, app/(main)/pricing/page.tsx,
lib/protectedAction.ts, actions/creations/delete.ts, app/sitemap.ts,
lib/draftServices.ts, actions/profile/helpers.ts, actions/templates.ts

Client-side hooks reading via browser Supabase client (useProfileQuery, useProfile,
usePolicies) must switch to fetching through server actions / API routes — a browser
can't hold a pg connection.

## Decisions (confirmed with user)
- Session: bcrypt password hash + signed httpOnly cookie (JWT via `jose`, edge-compatible — no DB call needed in middleware).
- Email verification / password reset: keep Resend, generate our own tokens.
- RLS audit result: **no gaps** — every `src/actions/**` query already filters by user_id/id explicitly. No app-code authorization rewrite needed beyond what exists.
- Google OAuth: implement for real (authorization-code flow, account linking by email).
- Storage (image uploads): out of scope — no upload feature currently in use, `storage.*` calls left untouched/dead.
- `user_metadata` (currently used for first/last name + profile-complete signal) moves into `profiles` row + a `profileComplete` JWT claim (avoids a DB call inside Edge middleware).

## New dependencies (client/package.json)
`pg`, `@types/pg`, `bcryptjs`, `@types/bcryptjs`, `jose`

## DB schema changes (db/local/*.sql, re-apply to container)
- `auth.users` stub → real users table: add `password_hash TEXT`, `email_verified_at TIMESTAMPTZ`, `google_id TEXT UNIQUE`.
- New `auth.email_verification_tokens (id, user_id, token_hash, expires_at, created_at)`.
- New `auth.password_reset_tokens (id, user_id, token_hash, expires_at, used_at)`.

## New lib files
- `src/lib/db.ts` — `pg` Pool + `query()` helper (replaces supabase/{server,client,admin,middleware}.ts).
- `src/lib/auth/session.ts` — sign/verify JWT, get/set/clear session cookie, `getCurrentUser()`.
- `src/lib/auth/password.ts` — bcrypt hash/compare.
- `src/lib/auth/tokens.ts` — verification/reset token generate+verify (random bytes, sha256 hash at rest).
- `src/lib/auth/google.ts` — authorize URL builder, code exchange, userinfo fetch.

## Rewrite (server)
`protectedAction.ts`, `middleware.ts`, `actions/auth.ts`, `actions/registration.ts`,
`actions/password.ts`, `actions/draftActions.ts` (auth gate only), `actions/profile/delete.ts`,
`app/api/auth/logout/route.ts`, `app/auth/callback/route.ts` → split into
`app/auth/verify-email/route.ts` + `app/auth/google/callback/route.ts`.
New: `actions/verifyEmail.ts`, `app/api/auth/me/route.ts` (session read for client hooks).

## Rewrite (client)
`contexts/AuthContext.tsx`, `contexts/useAuthActions.ts` (or wherever it lives),
`hooks/useUser.ts`, `hooks/useProfile.ts`, `hooks/usePasswordResetModal.ts`,
`components/editor/hooks/useDraftState.ts`,
`components/auth/hooks/useAuthModalState.ts`,
`components/auth/completeProfile/CompleteProfileForm.tsx`,
`components/auth/components/UpdatePasswordForm.tsx`,
`app/(main)/profile/page.tsx`, `app/(main)/pricing/page.tsx`, `app/(main)/layout.tsx`,
`app/(main)/auth/reset-password/page.tsx`.

## Cleanup
Delete `src/lib/supabase/*.ts` once nothing imports them. Remove `@supabase/ssr`,
`@supabase/supabase-js` from package.json if nothing else uses them.

## Env additions (client/.env)
`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`.
Reuse existing `AUTH_SECRET` as the JWT signing key.

## Execution order
1. Install deps.
2. DB schema migration (users columns + 2 new tables).
3. Core lib: db.ts, auth/password.ts, auth/tokens.ts, auth/session.ts, auth/google.ts.
4. protectedAction.ts + middleware.ts (now nothing else broken further than it already is).
5. Server actions: auth.ts, registration.ts, password.ts, verifyEmail.ts (new), draftActions.ts, profile/delete.ts.
6. Routes: api/auth/logout, api/auth/me (new), auth/verify-email (new), auth/google/callback (new). Delete old auth/callback.
7. Client: AuthContext/useAuthActions, then dependent hooks/components/pages one by one.
8. Delete src/lib/supabase/*, prune package.json.
9. `npm run type-check` full pass, fix stragglers.
10. Manual smoke test in browser: register → verify email (check Resend/dev) → login → complete profile → logout → password reset → Google login.
