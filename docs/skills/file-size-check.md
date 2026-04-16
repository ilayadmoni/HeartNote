# File Size Check & Modular Split Protocol

## The Rule
No file in this project should exceed 150 lines.
This applies to: components, server actions, services, utilities, hooks, and API routes.

## When to Apply This Skill
- After writing or editing any file
- Before marking a task as complete
- When reading existing files that seem long

## Step-by-Step Process

### Step 1 — Count lines
After writing or editing a file, count its lines.
If the file is 150 lines or fewer → done, continue normally.
If the file exceeds 150 lines → proceed to Step 2.

### Step 2 — Analyze and plan the split
Before splitting, identify natural boundaries:
- Groups of related functions
- Distinct responsibilities (e.g. validation logic vs DB logic vs response formatting)
- Reusable utilities that can live in a separate helper file
- Types and interfaces that can move to a dedicated types file

Write a short plan and show it to the user before making any changes.

### Step 3 — Split into modules
Follow these conventions when splitting:

| Original File | Suggested Split Pattern |
|---|---|
| `actions/featureActions.ts` | `actions/feature/validateFeature.ts`, `actions/feature/createFeature.ts` |
| `services/featureServices.ts` | `services/feature/featureQueries.ts`, `services/feature/featureHelpers.ts` |
| `components/BigComponent.tsx` | Extract sub-components into `components/feature/` folder |
| Any file with types | Move types to `types/feature.ts` |

### Step 4 — Update all imports
After splitting, update every file that imports from the original file.
Never leave broken imports.

### Step 5 — Verify
After splitting:
- Confirm every new file is under 150 lines
- Confirm all imports resolve correctly
- Confirm no logic was lost or duplicated

## Important Rules
- Never split arbitrarily — split only along logical boundaries
- Keep related logic together — do not over-fragment
- Always show the split plan to the user before executing
- Never delete the original file before confirming all imports are updated
- If a file is long but splitting would harm readability, explain why and ask the user to decide
