# Supabase Change Protocol

Read this file before making ANY Supabase-related change.

---

## The Golden Rule

Every change to the database MUST have a corresponding migration file in `supabase/migrations/`.  
No exceptions — even small data updates like changing a single value.

## Why

This project has two Supabase instances:
- **Dev** — used for development
- **Prod** — live users, separate account

Migration files are the only way to keep them in sync.

---

## File Naming Convention

```
YYYYMMDD_short_description.sql
```

Examples:
- `20260415_add_lite_tier_check.sql`
- `20260415_free_tier_no_expiry.sql`
- `20260416_add_premium_column.sql`

---

## Before Any Supabase Change — Checklist

1. Write the migration SQL file first in `supabase/migrations/`
2. Add a rollback comment at the top of the file
3. Show the SQL to the user and wait for approval
4. Only then apply it to the database

---

## Migration File Format

```sql
-- Migration: short_description
-- Date: YYYY-MM-DD
-- Rollback: <SQL to undo this migration>

<your SQL here>
```

---

## Changes That Require a Migration File

- DDL: `CREATE`, `ALTER`, `DROP` (tables, columns, constraints, indexes)
- Data updates that affect business logic (e.g. updating `subscription_policies`)
- RLS policy changes
- New triggers or functions

## Changes That Do NOT Need a Migration File

- `SELECT` queries (read only)
- Temporary debugging queries

---

## Related skill

For detailed guidance on new tables, RLS policies, and applying migrations locally vs production, see [how-to-add-supabase-migration.md](how-to-add-supabase-migration.md).
