---
name: nextjs-fullstack-slice-scaffold
description: 'Scaffold a complete full-stack slice in HeartNote: generate a Zod schema in client/src/lib, a Next.js Server Action in client/src/actions with standard ActionError/protectedAction handling, and a React client component that consumes the action with strict TypeScript across all layers.'
argument-hint: 'Feature name, slice name, auth required yes/no, input fields, and expected success response'
user-invocable: true
---

# Next.js Full-Stack Slice Scaffold (HeartNote)

## Outcome
Create an end-to-end vertical slice with strict typing from UI input to validated server write and typed response.

The slice includes:
- Zod schema and exported inferred types under client/src/lib.
- Next.js Server Action under client/src/actions.
- React client component under client/src/components that consumes the action safely.

## Use When
- Adding a new feature that needs UI + server + validation in one pass.
- Replacing ad-hoc parsing with typed validation and typed action responses.
- Building a small production-ready flow with minimal boilerplate drift.

## Inputs To Collect First
1. Feature domain and slice name.
2. Auth requirement for the action (default: protected action).
3. Input source: object payload or FormData payload.
4. Required fields, validation rules, and user-facing messages.
5. Expected success payload shape.
6. Where the new client component is mounted.

## Project References
- Global conventions: [project-rules.md](../../../project-rules.md)
- Workspace rules: [.github/copilot-instructions.md](../../../.github/copilot-instructions.md)
- Action result contract: [client/src/lib/action-response.ts](../../../client/src/lib/action-response.ts)
- Auth wrapper: [client/src/lib/protectedAction.ts](../../../client/src/lib/protectedAction.ts)
- Action example: [client/src/actions/creations/create.ts](../../../client/src/actions/creations/create.ts)
- Client component pattern: [client/src/components/contact/components/ContactForm.tsx](../../../client/src/components/contact/components/ContactForm.tsx)

## Target File Layout
Create or update these files:
1. Validation schema and inferred types:
- client/src/lib/validations/<feature>.ts (default location)
- client/src/lib/validations/index.ts (export updates if needed)

2. Server Action:
- client/src/actions/<feature>/<action>.ts or client/src/actions/<feature>.ts
- optional shared types: client/src/actions/<feature>.types.ts

3. Client consumer component:
- client/src/components/<feature>/<ComponentName>.tsx
- optional feature-local types/constants files if required for clarity

## Procedure
1. Define contracts first (schema-driven).
- Build request schema with Zod.
- Export inferred input type from schema.
- Define and export response type/schema when response is structured.

2. Scaffold the server action with branch by auth requirement.
- Default path (auth-required):
  - Use protectedAction callback.
  - Return Promise<ActionResult<T>>.
  - Throw ActionError for validation/business failures (422, 404, 500, etc.).
- Public path:
  - Keep explicit typed result shape.
  - Apply Zod validation and safe error handling.
  - Include CSRF and rate-limiting checks by default for state-changing actions.

3. Implement validation gate before side effects.
- Parse input with safeParse.
- On parse failure in protected action: throw ActionError with joined issue messages and code 422.
- On parse failure in public action: return typed error result with user-safe message.

4. Add business logic and persistence.
- Perform DB/network work only after successful validation.
- Convert expected domain failures into ActionError (or explicit typed failures in public path).
- Log internal errors server-side and avoid leaking implementation details to users.

5. Scaffold the client component consumer.
- Mark with "use client" when interactive.
- Keep local form state strongly typed to schema-derived input.
- Submit via a typed action call path (default: object input flow):
  - object input flow: call action(input)
  - FormData flow: only when explicitly requested, normalize/coerce then validate and submit
- Handle loading, success, and error states with narrow types.

6. Wire slice exports and imports.
- Use @/ aliases in app code.
- Keep naming conventions: kebab-case files, PascalCase components/types, camelCase functions.
- Keep action signatures and return shapes aligned with existing action files.

7. Verify end-to-end correctness.
- From client:
  - npm run type-check
  - npm run lint
- Run focused tests if present for touched behavior.

## Decision Branches
- Auth required?
  - Yes (default): protectedAction + ActionResult + ActionError.
  - No: typed result + Zod validation + CSRF/rate limit for mutations.

- Input shape?
  - Typed object (default): validate directly with schema.
  - FormData: normalize/coerce to typed object before validation.

- Response complexity?
  - Simple success flag: minimal typed response.
  - Structured payload: response schema + inferred type and narrow UI state handling.

- Placement strategy?
  - Feature-local by default.
  - Shared utilities only when reused in multiple features.

## Quality Checks Before Done
1. Zod schema exists and is used before side effects.
2. Action return type is explicit and consistent with project patterns.
3. Client component consumes action with strict typed states.
4. No any introduced across schema, action, or UI layer.
5. User-facing errors are safe and do not expose internal details.
6. Imports follow @/ alias and naming conventions.
7. type-check and lint pass.

## Done Criteria
- Slice compiles end-to-end under strict TypeScript.
- Validation, action, and client layers are aligned by shared types.
- Error handling follows HeartNote security and UX conventions.
- New files are minimal, cohesive, and feature-scoped.

## Example Invocation Prompts
- Scaffold a full-stack slice named reminder-settings under profile: create Zod schema, protected action, and client form component with typed success/error states.
- Create a public full-stack contact-followup slice with FormData normalization, Zod validation, CSRF and rate-limit checks, and typed client submission states.
- Generate a complete slice for template-feedback with feature-local validation, action, and consumer component, then run type-check and lint.
