Read CLAUDE.md and docs/skills/how-to-add-server-action.md before writing any code.

Then implement the feature described in: $ARGUMENTS

Steps:
1. Create a new git branch: `git checkout -b feature/$ARGUMENTS` (use a slug version of the name if the argument is a sentence)
2. Identify all files that will change — list them before writing anything
3. Write the implementation following project conventions:
   - Wrap all authenticated server actions in `protectedAction()` from `@/lib/protectedAction`
   - Validate all input with Zod schemas in `src/lib/validations/`
   - Return `ActionResult<T>` — never throw raw errors to the client
   - Use `throw new ActionError(message, code)` for business-logic failures
   - Use soft deletes (`is_deleted = true`) — never hard-delete creations
   - Call `validateOrigin()` at the top of any mutating action
   - Use `logger.*` instead of `console.*` for any server-side logging
   - New tables need RLS policies — see docs/skills/how-to-add-supabase-migration.md
4. After finishing, report:
   - What files were created or changed (with paths)
   - What was added or modified
   - Any open questions or follow-up tasks

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
