# How to Add a Server Action

All server actions live in `client/src/actions/`. All authenticated actions use the `protectedAction` wrapper.

---

## File location and naming

| Type | Location | Example |
|---|---|---|
| Auth-related | `src/actions/auth.ts`, `registration.ts`, `password.ts` | `loginAction` |
| Profile | `src/actions/profile/get.ts`, `update.ts`, `delete.ts` | `getMyProfile`, `updateMyProfile` |
| Creations | `src/actions/creations/create.ts`, `delete.ts`, `read.ts` | `createCreation`, `deleteCreation` |
| Subscription | `src/actions/subscription/upgradeSubscription.ts` | `upgradeSubscription` |
| Public (no auth) | Same directories, but no `protectedAction` wrapper | `getTemplates`, `getCreation` |

Export all actions from `src/actions/index.ts`.

---

## The protectedAction wrapper

Every authenticated action wraps its logic in `protectedAction`. This handles session validation automatically — if the user is not authenticated, it returns `{ success: false, error: "UNAUTHORIZED", code: 401 }` before your callback runs.

```typescript
"use server";

import { protectedAction } from "@/lib/protectedAction";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { MyInputSchema, type MyInput, type MyOutput } from "@/lib/validations";

export async function myAction(input: MyInput): Promise<ActionResult<MyOutput>> {
  return protectedAction(async (user, supabase) => {
    // 1. Validate input
    const parsed = MyInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new ActionError(
        parsed.error.issues.map((i) => i.message).join("; "),
        422,
      );
    }

    // 2. Business logic — user.id is the authenticated user's UUID
    const { data, error } = await supabase
      .from("some_table")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !data) {
      throw new ActionError("Not found", 404);
    }

    // 3. Return data — never return raw DB rows, map to response type
    return { id: data.id, name: data.name };
  });
}
```

**Real example**: `src/actions/creations/delete.ts`

```typescript
export async function deleteCreation(creationId: string): Promise<ActionResult<null>> {
  return protectedAction(async (user, supabase) => {
    const { data, error: findErr } = await supabase
      .from("creations")
      .select("id")
      .eq("id", creationId)
      .eq("user_id", user.id);

    if (findErr || !data?.length) {
      throw new ActionError("Creation not found", 404);
    }

    const { error: updateErr } = await supabase
      .from("creations")
      .update({ is_deleted: true })
      .eq("id", creationId)
      .eq("user_id", user.id);

    if (updateErr) {
      throw new ActionError(`Failed to delete: ${updateErr.message}`, 500);
    }

    revalidatePath("/", "layout");
    return null;
  });
}
```

---

## ActionResult type

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: number }
```

Use `ActionError` to return structured errors from inside the callback:
```typescript
throw new ActionError("Quota exceeded", 403);
throw new ActionError("Not found", 404);
throw new ActionError("Validation failed: ...", 422);
throw new ActionError("Failed to update", 500);
```

`protectedAction` catches these and maps them to `{ success: false, error, code }`. Unexpected errors (not `ActionError`) are caught, logged server-side via `logger.error`, and return a generic 500 to the client.

---

## Zod validation

Add schemas to `src/lib/validations/`. Each file exports both the schema and its inferred types:

```typescript
// src/lib/validations/myFeature.ts
import { z } from "zod";

export const MyInputSchema = z.object({
  name: z.string().min(1).max(100),
  tier: z.enum(["free", "lite", "premium"]),
});

export type MyInput = z.infer<typeof MyInputSchema>;

export const MyOutputSchema = z.object({ id: z.string().uuid() });
export type MyOutput = z.infer<typeof MyOutputSchema>;
```

Parse with `.safeParse()` and throw 422 on failure:
```typescript
const parsed = MyInputSchema.safeParse(input);
if (!parsed.success) {
  throw new ActionError(
    parsed.error.issues.map((i) => i.message).join("; "),
    422,
  );
}
```

---

## Using the admin client

If an action needs to bypass RLS (e.g., checking `banned_users`, updating another user's record), import the admin client separately:

```typescript
import { createAdminClient } from "@/lib/supabase/admin";

// Inside protectedAction callback or at top level:
const admin = createAdminClient();
const { data } = await admin.from("profiles").update(...).eq("id", user.id);
```

**Real example**: `upgradeSubscription.ts` uses `createAdminClient()` to update `profiles` because the subscription update requires bypassing RLS.

---

## CSRF validation for mutating actions

Any action that mutates state (not just reads) must call `validateOrigin()` at the top before any logic:

```typescript
import { validateOrigin, csrfError } from "@/lib/utils/csrf";

export async function myMutatingAction(input: MyInput) {
  if (!await validateOrigin()) {
    return csrfError(); // returns { success: false, error: "...", code: 403 }
  }
  // ... rest of action
}
```

`protectedAction` does NOT call `validateOrigin` automatically — you must call it explicitly. See `src/actions/auth.ts` and `src/actions/registration.ts` for examples.

---

## Calling the action from a client component

Use the `useServerAction` hook, which automatically handles 401 (signs out + redirects):

```typescript
"use client";

import { useServerAction } from "@/hooks/useServerAction";
import { deleteCreation } from "@/actions/creations/delete";

function MyComponent({ creationId }: { creationId: string }) {
  const { execute } = useServerAction();

  const handleDelete = async () => {
    try {
      await execute(deleteCreation(creationId));
      // success — data is typed as the action's return type
    } catch (err) {
      // ActionError with code/message for inline display
      if (err instanceof ActionError) {
        setError(err.message);
      }
    }
  };
}
```

For React Query mutations:
```typescript
const mutation = useMutation({
  mutationFn: (id: string) => execute(deleteCreation(id)),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
  onError: (err) => toast.error(err.message),
});
```

---

## Public actions (no auth)

For actions that don't require authentication (e.g., reading public creations, listing templates), do not use `protectedAction`. Create a server client directly:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("templates").select("*").eq("is_active", true);
  if (error) return { error: error.message, status: 500 };
  return { data };
}
```

Return a plain object with `{ data }` or `{ error, status }` — not `ActionResult<T>`.

**Real examples**: `src/actions/templates.ts`, `src/actions/creations/read.ts` (`getCreation`).

---

## Checklist for new server actions

- [ ] `"use server"` directive at top of file
- [ ] Authenticated: wrapped in `protectedAction`
- [ ] Input validated with Zod `.safeParse()` before any DB call
- [ ] Errors thrown with `new ActionError(message, code)`
- [ ] Mutating actions call `validateOrigin()` first
- [ ] Uses `logger.*` not `console.*` for server-side logging
- [ ] Supabase RLS is the last line of defence — don't rely on it alone; always add `eq("user_id", user.id)` to queries
- [ ] Call `revalidatePath()` after mutations that affect cached pages
