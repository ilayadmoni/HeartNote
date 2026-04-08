---
name: nextjs-modular-file-split
description: 'Refactor and split large Next.js TypeScript files (typically over 150 lines) into modular components, hooks, and utils while preserving behavior, strict typing, and App Router boundaries. Use when a file is hard to maintain due to mixed UI, state, and helper logic.'
argument-hint: 'Target file path, split threshold, and whether to prioritize components, hooks, or utility extraction first'
user-invocable: true
---

# Next.js Modular File Split (HeartNote)

## Outcome
Transform an oversized file into smaller focused modules that are easier to test and maintain, without behavior regressions.

This skill preserves:
- TypeScript strict typing.
- Next.js App Router server/client boundaries.
- Existing public APIs and behavior.
- Project naming and folder conventions.

## Use When
- A single file exceeds about 150 lines and mixes multiple concerns (heuristic trigger, not a hard rule).
- A page or component contains independent UI sections that can be isolated.
- State and side-effects can be moved to dedicated hooks.
- Pure logic can be moved into reusable utilities.

## Default Placement Policy
- For files under `client/src/components/<feature>`, extract into same-feature subfolders by responsibility:
  - `components/` for visual sections
  - `hooks/` for reusable state/effect logic
  - `utils/` for pure helpers
- Keep extracted modules close to their parent feature unless true cross-feature reuse is needed.

## Inputs To Collect First
1. Target file path.
2. Current role of file: page, layout, server component, client component, action, hook, or utility.
3. Known constraints: exports that must remain stable, route segment behavior, or SSR requirements.
4. Preferred split order: UI first, then hooks, then utils (default).
5. Acceptance checks: lint, type-check, and any relevant tests.

## Project References
- Primary standards: [project-rules.md](../../../project-rules.md)
- Workspace instructions: [.github/copilot-instructions.md](../../../.github/copilot-instructions.md)
- App structure root: [client/src](../../../client/src)

## Procedure
1. Analyze the file before editing.
- Map top-level exports and default export.
- Identify whether the file is server or client (`"use client"` boundary).
- Mark independent UI sections, state clusters, effects, and pure helpers.

2. Partition candidates into extraction buckets.
- Components: visual sections with clear props and minimal side-effects.
- Hooks: reusable state/effect logic with stable typed return values.
- Utils: pure functions with no React or framework side-effects.

3. Define extraction plan with safe order.
- Extract leaf utilities first (lowest coupling).
- Extract hooks next (state logic).
- Extract UI sections last (component wiring).
- Keep one compatibility pass in original file to preserve current exports.

4. Apply Next.js boundary rules.
- Do not import client-only hooks/components into server components.
- Add `"use client"` only where interactivity is required.
- Keep route files in place (`app/**/page.tsx`, `layout.tsx`, `route.ts`) and move internals to sibling folders.

5. Preserve strict typing end-to-end.
- Export explicit prop and return types for new modules.
- Keep generics and discriminated unions intact.
- Avoid `any`; prefer inferred types from Zod or existing domain types where available.

6. Update imports and barrel files carefully.
- Prefer path aliases (`@/`) for app code.
- Keep naming consistent: kebab-case files, PascalCase components, camelCase functions.
- Avoid broad re-exports that create circular dependencies.

7. Run quality verification.
- From [client](../../../client):
  - `npm run type-check`
  - `npm run lint`
- Run focused tests when available for touched behavior.

8. Final regression scan.
- Verify unchanged behavior at call sites.
- Ensure no route-level semantics changed.
- Confirm no accidental prop drilling regressions or stale state closures.

## Decision Branches
- File type?
  - App Router route file (`page.tsx`, `layout.tsx`, `route.ts`): keep file as orchestration shell; extract internals.
  - Shared component: split by independent visual sections and hooks.
  - Hook/utility file: split only when independent cohesive groups exist.

- Boundary conflict found?
  - If extracted code needs browser APIs or React state: move to client module and import only from client parents.
  - If extracted code is pure and serializable: keep server-safe utility module.

- Reuse potential?
  - If logic is reused in 2+ places: favor hook/util extraction.
  - If logic is local and tightly coupled: keep local to avoid over-abstraction.

## Quality Checks Before Done
1. No behavior changes in user-visible flow.
2. Public exports remain compatible unless change is intentional.
3. New modules each have one primary responsibility.
4. No server/client boundary violations.
5. No `any` introduced; strict TypeScript remains clean.
6. `npm run type-check` and `npm run lint` pass in [client](../../../client).

## Done Criteria
- Original file is reduced and primarily orchestration-focused.
- Extracted modules are named and placed by responsibility.
- All changed files compile and lint cleanly.
- Refactor is minimal and targeted, with no unrelated churn.
- Splitting stops when each extracted module has a single responsibility and verification checks pass.

## Anti-Patterns To Avoid
- Splitting by arbitrary line count without cohesive boundaries.
- Creating too many tiny files with no reuse or clarity gains.
- Moving route files instead of extracting internals.
- Introducing circular imports through barrels.
- Changing behavior while claiming pure refactor.

## Example Invocation Prompts
- Refactor [client/src/components/editor/EditorDesktop.tsx](../../../client/src/components/editor/EditorDesktop.tsx) using this skill; split independent UI sections and move shared logic to hooks/utils.
- Analyze [client/src/app/(main)/dashboard/page.tsx](../../../client/src/app/(main)/dashboard/page.tsx), keep the route file thin, and extract modular sections while preserving App Router conventions.
- Split a 220-line client component into cohesive child components and a typed hook, then run type-check and lint.
