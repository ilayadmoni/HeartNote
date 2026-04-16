# How to Add a Supabase Migration

---

## File naming

New migrations use a date-prefixed name:

```
YYYYMMDD_description_of_change.sql
```

Examples:
```
20260416_add_lite_tier_policy.sql
20260501_add_payment_transactions_table.sql
```

The existing migrations use a sequential `NNN_` prefix — do not use that format for new files.

---

## Where migrations live

```
supabase/migrations/
├── 000_init.sql          ← authoritative consolidated schema (read this first)
├── 001_initial_schema.sql
│   ...
└── 021_quota_selection_behavior.sql
```

**Never modify an existing migration file.** Migrations are append-only. To change something that was already migrated, create a new migration that alters or corrects it.

---

## Migration file template

Every migration file must start with a rollback comment block:

```sql
-- =============================================================================
-- Migration: 20260416_add_lite_tier_policy.sql
-- Description: Adds 'lite' tier row to subscription_policies
-- Created: 2026-04-16
--
-- ROLLBACK:
--   DELETE FROM public.subscription_policies WHERE tier_code = 'lite';
-- =============================================================================

-- Your migration SQL here
INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry)
VALUES ('lite', 2, 2592000); -- 30 days in seconds
```

---

## What to include in a migration

### Altering a table

```sql
-- Add a column with a safe default
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS some_new_field TEXT DEFAULT 'value';
```

Always use `IF NOT EXISTS` / `IF EXISTS` guards so re-running is safe.

### New table

```sql
CREATE TABLE IF NOT EXISTS public.new_table (
    id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- ... columns
);

-- Required: indexes for columns used in WHERE clauses
CREATE INDEX IF NOT EXISTS idx_new_table_user_id ON public.new_table (user_id);

-- Required: RLS (see below)
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;
```

### Updating data

```sql
-- Seed new policy row
INSERT INTO public.subscription_policies (tier_code, creation_limit, default_expiry)
VALUES ('lite', 2, 2592000)
ON CONFLICT (tier_code) DO UPDATE
  SET creation_limit = EXCLUDED.creation_limit,
      default_expiry = EXCLUDED.default_expiry;
```

---

## RLS policies for new tables

Every new user-facing table must enable RLS and have explicit policies. Users should only see their own rows.

```sql
ALTER TABLE public.new_table ENABLE ROW LEVEL SECURITY;

-- Users can read their own rows
CREATE POLICY "users_can_select_own" ON public.new_table
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own rows
CREATE POLICY "users_can_insert_own" ON public.new_table
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own rows
CREATE POLICY "users_can_update_own" ON public.new_table
  FOR UPDATE USING (auth.uid() = user_id);

-- No DELETE policy = hard deletes not allowed via client (use is_deleted flag instead)
```

For public read tables (e.g., templates):
```sql
CREATE POLICY "public_can_select_active" ON public.templates
  FOR SELECT USING (is_active = true);
```

The admin/service-role client (`src/lib/supabase/admin.ts`) bypasses RLS entirely — use it only in server-side admin operations, never exposed to the client.

---

## Applying migrations

### Local development (Docker / Supabase CLI)

```bash
# From the project root (d:\HeartNote\)
supabase db push

# Or to reset and re-run all migrations from scratch:
supabase db reset
```

### Production (Supabase hosted)

Migrations are applied via the Supabase dashboard (SQL Editor) or CI/CD:

1. Copy the SQL from your migration file
2. Open the Supabase dashboard → SQL Editor
3. Paste and run
4. Verify in Table Editor that the change is reflected

Or via CLI if project is linked:
```bash
supabase db push --linked
```

---

## Before writing a migration

1. Read `supabase/migrations/000_init.sql` to understand the current schema
2. Check the latest migration number/date so you don't conflict
3. Test the SQL in Supabase's SQL Editor on a dev project before writing the file
4. Show the complete SQL and get explicit approval before running on production

---

## Common mistakes to avoid

- Modifying an existing migration file (breaks reproducibility)
- Forgetting `IF NOT EXISTS` guards (makes re-runs fail)
- Adding a NOT NULL column without a DEFAULT (will fail on existing rows)
- Forgetting to enable RLS on a new user-facing table
- Using `DROP TABLE` or `DELETE FROM` in a forward migration (use `is_active = false` or soft-delete instead)
