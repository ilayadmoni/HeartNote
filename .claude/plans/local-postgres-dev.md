# Local Postgres dev container

## Scope
Stand up a plain Postgres 17 container for local dev, loaded with the real
prod schema (introspected live from Supabase project `gdpkvnfmqezniilweefh`
via MCP — local migration files in `supabase/migrations/` have drifted from
prod and can't be trusted as-is). No data to migrate: every public table is
empty (0 rows) in prod. App code / Supabase Auth usage is NOT touched in
this pass — that's separate follow-up work per user decision.

## What ships
- `docker-compose.yml` (repo root) — single `postgres:17` service, named
  volume, exposes 5432, seeded on first boot via `/docker-entrypoint-initdb.d`.
- `db/local/init.sql` — plain-Postgres schema: stub `auth.users` (FK target
  only, no real Supabase Auth behavior locally), the 7 real tables
  (profiles, templates, subscription_policies, creations, banned_users,
  drafts, audit_logs), their functions/triggers/indexes as they exist in
  prod today, minus RLS/storage policies (auth.uid()-based — dead without
  Supabase Auth locally; access control moves to app code later).
- Dead functions referencing tables that don't exist in prod (`user_pages`,
  `user_actions` — from an old/abandoned schema iteration) are skipped.
- `client/.env` `DATABASE_URL` updated to point at the local container.

## Not in scope (explicitly deferred)
- Replacing Supabase Auth with custom auth
- Moving RLS checks into app code
- RDS prod setup
