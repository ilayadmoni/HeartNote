Read CLAUDE.md before starting.

Review the code changed on the current branch (or the files/diff in: $ARGUMENTS).

## What to check

### Correctness
- Logic bugs, off-by-one errors, incorrect conditions
- Unhandled edge cases (null/undefined, empty arrays, expired tokens, etc.)
- Race conditions or stale state in React hooks/server actions

### Security (HeartNote-specific)
- All mutating server actions call `validateOrigin()` from `@/lib/utils/csrf.ts`
- No service-role key or secrets exposed to the client
- User input validated with Zod before use
- RLS is not bypassed unless intentional and going through `admin.ts`
- PII logged only via `logger.*` (never raw `console.*`)

### Architecture & Conventions
- Server actions return `ActionResult<T>` — never throw raw errors to the client
- Supabase client variant is correct for context (browser/server/admin/middleware)
- Soft deletes used (`is_deleted = true`), not hard deletes on `creations`
- Subscription tier values are only `'free'`, `'lite'`, or `'premium'`
- Path aliases used correctly (`@/lib/...`, `@/components/...`, etc.)

### Code quality
- No dead code, unused variables, or speculative abstractions
- No hardcoded values that should come from the DB or env
- No duplicate logic that already exists elsewhere in the codebase
- Error handling only at system boundaries (user input, external APIs)

### TypeScript
- No unsafe `any` casts where a proper type is available
- Zod schemas kept in `src/lib/validations/` — not inline

## Output format

For each issue found, report:
- **File + line**: where the issue is
- **Severity**: `critical` / `major` / `minor` / `suggestion`
- **Issue**: what is wrong or risky
- **Fix**: concrete suggestion (code snippet if helpful)

If nothing is wrong, say so clearly. Do not invent issues.
