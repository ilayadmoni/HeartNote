# HeartNote — Client CLAUDE.md

> Inherits all rules from `D:\HeartNote\CLAUDE.md`. This file adds client-specific conventions.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript 5.x (strict mode) |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 11 |
| Auth / DB | Supabase SSR (`@supabase/ssr`) |
| State | TanStack React Query 5 |

---

## Typography

- **Headings / display**: Playfair Display (serif)
- **Body / UI**: Heebo (Hebrew-optimized sans-serif)
- Font loading via `src/lib/fonts.ts` and the `FontReadyGateway` component.

---

## Conventions

- **File length**: Max 150 lines per file. Extract helpers to `utils/` or `helpers/` sub-folders; split large components into sub-modules.
- **Hooks directory**: Custom hooks live in `src/hooks/`. Name files `use<Feature>.ts`.
- **Type files**: Co-locate types in `<feature>.types.ts` files alongside the component or action they describe.
- **RTL support**: The app targets Hebrew (RTL). Use `dir="rtl"` on root layout; prefer logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`) over `left`/`right` in Tailwind.
- **Path aliases**: `@/*` → `src/*`. Always use alias imports, never relative `../` chains beyond one level.
- **Components**: Client components get `"use client"` at top. Default to Server Components unless interactivity or browser APIs are required.
- **Supabase clients**: Browser components → `src/lib/supabase/client.ts`; server actions/components → `src/lib/supabase/server.ts`; admin ops → `src/lib/supabase/admin.ts`.
- **ActionResult**: Every server action returns `ActionResult<T>` from `src/lib/action-response.ts`. Consume via `useServerAction()` hook.
- **Validation**: All inputs validated with Zod schemas in `src/lib/validations/` before hitting the DB.
- **No raw console**: Use `logger.*` from `src/lib/utils/logger.ts` (PII-safe).

---

## Dev Commands

Run from `client/` directory:

```bash
npm run dev          # localhost:3000
npm run dev:lan      # bound to 0.0.0.0 (LAN)
npm run build        # production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
npx vitest           # run tests
```
