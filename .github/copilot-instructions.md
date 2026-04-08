# HeartNote Project Guidelines

## Read First
- Start with [project-rules.md](../project-rules.md) for authoritative architecture, security, and coding rules.
- Link to existing docs instead of copying long guidance:
  - [README.md](../README.md)
  - [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md)
  - [AUDIT_REPORT.md](../AUDIT_REPORT.md)
  - [DEPLOYMENT_CHECKLIST.md](../DEPLOYMENT_CHECKLIST.md)
  - [TEMPLATE_USAGE_TRACKING_GUIDE.md](../TEMPLATE_USAGE_TRACKING_GUIDE.md)

## Architecture
- App code lives under `client/src` and follows Next.js App Router structure:
  - `app/` for routes/layouts (route groups like `(main)` and `(public)`)
  - `actions/` for Server Actions
  - `components/` feature-organized UI
  - `lib/` for shared utilities, Supabase clients, and Zod validation schemas
  - `hooks/`, `types/`, `constants/`, `providers/` for shared client-side patterns
- Database schema and policy evolution is in `supabase/migrations/` via numbered SQL files.

## Build And Verify
- Run client commands from `client/`.
- Install: `npm install`
- Dev: `npm run dev` (or `npm run dev:lan` for mobile device testing)
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Build: `npm run build`
- Production run: `npm start` (or `npm run start:lan`)
- Vitest is configured (`client/vitest.config.ts`), but no package script is defined. Use `npx vitest run` when tests are needed.

## Conventions
- Use TypeScript strict patterns and keep APIs typed end-to-end.
- Prefer path alias imports (`@/`) in client app code.
- Keep naming consistent with project-rules:
  - files: kebab-case (React component files use PascalCase)
  - functions/variables: camelCase
  - components/types: PascalCase
  - constants: UPPER_SNAKE_CASE
- Keep Server Action signatures and return shapes consistent with existing action files and their paired `*.types.ts` files.

## Security And Data Rules
- Validate all external input with Zod before DB writes.
- Do not leak internal/debug details in user-facing error messages.
- Keep auth checks on protected routes and actions consistent with existing auth flow.
- Do not introduce arbitrary color/user-style values; follow palette constraints defined in the codebase.
- Preserve guest draft and OAuth redirect safety patterns already documented in [project-rules.md](../project-rules.md).

## Agent Working Norms
- Make minimal, targeted changes; avoid broad refactors unless requested.
- Follow existing file/folder patterns before creating new abstractions.
- Update docs when behavior changes, and prefer linking to existing docs over duplicating guidance.
