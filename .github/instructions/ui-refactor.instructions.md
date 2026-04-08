---
description: "Use when refactoring or splitting large Next.js UI files in HeartNote. Applies strict App Router server/client boundaries, cohesive component extraction, and TypeScript-safe modularization patterns."
name: "HeartNote UI Refactor Guidelines"
applyTo:
  - "client/src/components/**/*.tsx"
  - "client/src/app/**/*.tsx"
---

# HeartNote UI Refactor Guidelines

## Scope
Use this instruction when restructuring UI-heavy files, especially files around or above 150 lines that mix rendering, state, effects, and helpers.

## Refactor Goals
- Keep behavior unchanged.
- Reduce cognitive load by separating responsibilities.
- Preserve strict typing and existing feature boundaries.

## Extraction Defaults
- Treat 150 lines as a heuristic trigger, not a hard rule.
- For files under a feature folder in client/src/components, extract into sibling subfolders:
  - components/ for independent visual sections
  - hooks/ for reusable state and side-effect logic
  - utils/ for pure helper logic
- Keep route files in client/src/app as orchestration shells; extract internals instead of moving route entry files.

## Boundary Rules (Next.js App Router)
- Do not import client-only modules into server components.
- Add "use client" only where interactivity is required.
- Preserve route semantics for page.tsx, layout.tsx, and route.ts files.

## Type Safety Rules
- Export explicit prop types for extracted components.
- Export explicit return types for extracted hooks when it improves readability and stability.
- Avoid any and unsafe casts unless unavoidable and documented inline.
- Prefer existing shared types from client/src/types and feature-local types where appropriate.

## Practical Workflow
1. Identify independent UI sections, logical state blocks, and pure helper blocks.
2. Extract utilities first, hooks second, UI sections last.
3. Keep exports stable unless a breaking change is explicitly requested.
4. Update imports using @/ aliases where applicable.
5. Run validation from client:
   - npm run type-check
   - npm run lint

## Completion Criteria
- The original file is smaller and orchestration-focused.
- Extracted files have one clear responsibility each.
- No server/client boundary violations were introduced.
- Type-check and lint pass after the refactor.
