Read docs/skills/how-to-add-supabase-migration.md before doing anything.

Then create the migration described in: $ARGUMENTS

Steps:
1. Determine the correct filename: `YYYYMMDD_<description>.sql` (today's date, snake_case description)
2. Place the file in `supabase/migrations/`
3. Never modify any existing migration file
4. Include a rollback comment block at the top of the file (see skill doc for format)
5. Include RLS policies for any new table
6. Show the complete SQL and wait for explicit approval before running it
7. Only after approval: apply with `supabase db push` (local) or instruct on production deploy

## Git Rules
- ALWAYS work on the `dev` branch only
- Before starting any task, verify you are on `dev`:
  git checkout dev
  git pull origin dev
- Commit after each logical change with a clear message:
  feat: <description>
  fix: <description>
  chore: <description>
- Push to origin dev when done:
  git push origin dev
- NEVER commit to `main` directly
- NEVER open a PR — the user handles all merges to main
