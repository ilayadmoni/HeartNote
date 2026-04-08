---
name: nextjs-server-action-scaffold
description: 'Scaffold a new Next.js Server Action in HeartNote with Zod input validation, ActionResult response typing, and standard ActionError/protectedAction handling. Use when adding actions under client/src/actions, creating matching .types.ts files, and adding schemas under client/src/lib/validations.'
argument-hint: 'Feature name, action name, auth required yes/no, input source formData or typed object, and expected success payload'
user-invocable: true
---

# Next.js Server Action Scaffold (HeartNote)

## Outcome
Produce a consistent Server Action implementation that matches HeartNote conventions:
- Typed request and response contracts.
- Zod validation before business logic or DB writes.
- Standard success and error shape.
- Safe user-facing errors and server-side logging.
- Correct file placement and naming.

## Use When
- Adding a new action in client/src/actions.
- Replacing ad-hoc validation with Zod.
- Migrating action return values to ActionResult pattern.
- Creating a new feature flow that writes to Supabase.

## Inputs To Collect First
1. Feature folder and action name.
2. Whether auth is required.
3. Input shape: FormData or typed object.
4. Required DB reads/writes.
5. Desired success payload.
6. User-facing error language requirements.

## Project References
- Primary rules: [project-rules.md](../../../project-rules.md)
- Existing action pattern: [client/src/actions/creations/create.ts](../../../client/src/actions/creations/create.ts)
- Response and error contract: [client/src/lib/action-response.ts](../../../client/src/lib/action-response.ts)
- Auth wrapper: [client/src/lib/protectedAction.ts](../../../client/src/lib/protectedAction.ts)
- Validation examples: [client/src/lib/validations/creation.ts](../../../client/src/lib/validations/creation.ts)

## File Scaffold
Create or update the following:
1. Action file in client/src/actions/<feature>/<action>.ts or client/src/actions/<feature>.ts
2. Types file in client/src/actions/<feature>.types.ts when action state/types are feature-level
3. Validation schema in client/src/lib/validations/<feature>.ts
4. Export updates in validation index files when needed

## Procedure
1. Define Zod schema first.
- Add request schema and inferred input type.
- Add response schema and inferred output type when response is structured.

2. Decide action wrapper.
- If auth required: use protectedAction and return Promise<ActionResult<T>>.
- If auth not required: return a typed state/result object, but still validate with Zod and keep safe error messages.

3. Implement validation gate.
- Use safeParse on incoming payload.
- On failure inside protectedAction callback: throw ActionError with code 422 and joined issue messages.
- On failure in non-protected action: return a typed error result without internal details.

4. Add business logic.
- Perform Supabase queries after successful validation only.
- Convert expected domain failures into ActionError with explicit status code.
- Keep server logs detailed, client errors generic.

5. Return standardized success payload.
- protectedAction path: return data only from callback; wrapper emits ActionResult.
- non-protected path: keep a predictable success and error shape used by caller.

6. Align naming and imports.
- Use path aliases with @/.
- Keep file names kebab-case and symbols camelCase/PascalCase per project-rules.

## Decision Branches
- Auth required?
  - Yes: protectedAction + ActionResult + ActionError.
  - No: direct action with typed state/result, optional CSRF/rate-limit checks depending on endpoint risk.

- Input source?
  - FormData: normalize and coerce values first, then validate normalized object with Zod.
  - Typed object: validate object directly with safeParse.

- Error visibility?
  - Business/domain errors: short user-safe messages.
  - Unexpected errors: log server-side and return generic message.

## Quality Checks Before Done
1. Validation exists and runs before DB writes.
2. Return type is explicit and consistent with project patterns.
3. No internal debug details leak to user-facing errors.
4. Action and schema files follow naming and folder conventions.
5. Imports use @/ aliases where applicable.
6. Run from client folder:
   - npm run type-check
   - npm run lint

## Done Criteria
- Action compiles under strict TypeScript.
- Input and output are typed end-to-end.
- Error handling matches HeartNote safety conventions.
- Any new schema/types are discoverable by existing feature structure.

## Example Invocation Prompts
- Create a protected Server Action named updateReminderSettings under client/src/actions/profile with Zod validation and ActionResult response.
- Scaffold a public contact-style Server Action using FormData normalization, Zod validation, and safe user-facing error handling.
- Convert this existing action to protectedAction plus ActionError and add matching schema types in lib/validations.
