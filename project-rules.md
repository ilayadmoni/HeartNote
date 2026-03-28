# HeartNote — Project Rules

> **Project Mission**: Premium Hebrew digital greeting card platform. Users curate personalized templates, edit in real-time, and share via unique public URLs.  
> **Target Users**: Hebrew speakers creating celebratory cards, event invitations, and personal greetings.

---

## Tech Stack Matrix

| Layer                | Tech                                | Version      | Purpose                          |
| -------------------- | ----------------------------------- | ------------ | -------------------------------- |
| **Framework**        | Next.js (App Router)                | 14.1.0       | SSR, RSC, Server Actions         |
| **Language**         | TypeScript                          | 5.3.0        | Type safety (strict mode)        |
| **Styling**          | Tailwind CSS                        | 3.4.0        | Utility-first CSS                |
| **Animations**       | Framer Motion                       | 11.0.0       | DOM animations, transitions      |
| **State (Server)**   | TanStack React Query                | 5.90.21      | Async server state               |
| **State (Auth)**     | React Context + Supabase            | 2.95.3       | User session, auth methods       |
| **Auth Backend**     | Supabase Auth                       | —            | JWT, password reset, banned list |
| **Database**         | Supabase PostgreSQL                 | —            | Profiles, creations, templates   |
| **Validation**       | Zod                                 | 4.3.6        | Schema validation, type inference|
| **Email**            | Resend                              | 6.9.2        | Transactional emails             |
| **Icons**            | Lucide React                        | 0.563.0      | Icon library                     |
| **UI Feedback**      | Sonner (Toast)                      | 2.0.7        | Client notifications             |
| **Testing**          | Vitest + @testing-library           | 4.0.18       | Unit + component tests           |

---

## Guest-to-Authenticated Flow (Draft Preservation)

This section documents the critical flow for preserving guest user work through the authentication process.

### Overview

When a guest user edits a template and attempts to save/publish, their work must be preserved through the login flow. This is especially important for OAuth (Google) where the user leaves the site temporarily.

### The `drafts` Table Mechanism

| Column       | Type        | Purpose                                          |
| ------------ | ----------- | ------------------------------------------------ |
| `id`         | UUID        | Primary key, generated client-side               |
| `metadata`   | JSONB       | Template data + `_template_id` + `_temp_image_path` |
| `user_id`    | UUID (nullable) | NULL for guest drafts, set after claim        |
| `created_at` | TIMESTAMP   | For cron cleanup                                 |

### Flow Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. GUEST EDITS TEMPLATE                                                    │
│     Location: /create/{templateId}                                          │
│     Components: EditorDesktop.tsx / EditorMobile.tsx                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. GUEST CLICKS "PUBLISH" → DRAFT SAVED                                    │
│     Function: saveGuestDraft() in lib/draftServices.ts                      │
│     Actions:                                                                │
│       - Upload image to `temp_drafts` bucket (if any)                       │
│       - Insert row into `drafts` table with metadata                        │
│       - Return draft UUID                                                   │
│     State: setLoginRedirect(`/create/${templateId}?draft_id=${draftId}`)    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. LOGIN MODAL OPENS                                                       │
│     Component: LoginModal.tsx                                               │
│     Props: redirectTo = "/create/{templateId}?draft_id={uuid}"              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌─────────────────────────────┐         ┌─────────────────────────────────────┐
│  4A. EMAIL/PASSWORD LOGIN   │         │  4B. GOOGLE OAUTH LOGIN             │
│  - Same-origin flow         │         │  - Cross-origin redirect            │
│  - redirectTo used directly │         │  - Supabase → Google → Callback     │
│  - No URL manipulation      │         │  - CRITICAL: See "OAuth Param Rules"│
└─────────────────────────────┘         └─────────────────────────────────────┘
                                                      │
                                                      ▼
                              ┌─────────────────────────────────────────────────┐
                              │  5. AUTH CALLBACK                               │
                              │     Route: /auth/callback/route.ts              │
                              │     Actions:                                    │
                              │       - Exchange PKCE code for session          │
                              │       - Extract `next` param (contains draft_id)│
                              │       - Check profile completeness              │
                              │       - Redirect to `next` or /complete-profile │
                              └─────────────────────────────────────────────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  6. DRAFT RESTORATION                                                       │
│     Location: EditorDesktop/EditorMobile useEffect hook                     │
│     Action: claimGuestDraft(draftId) Server Action                          │
│     Result:                                                                 │
│       - Reads draft metadata from DB                                        │
│       - Moves temp image to permanent bucket                                │
│       - Returns metadata to hydrate editor state                            │
│       - Sets user_id on draft row (ownership claim)                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cron Job Policy

- **Schedule**: Daily at 00:00 UTC
- **Action**: Deletes drafts where `created_at < NOW() - INTERVAL '2 days'`
- **Why no immediate deletion**: Enables idempotent `claimGuestDraft` calls (mobile double-fires simply re-read the same row)

### OAuth Parameter Handling Rules (CRITICAL)

When passing state through OAuth redirects, **nested query parameters are unreliable on mobile browsers**. The following rules MUST be followed:

#### ❌ DO NOT: Nest query strings in redirectTo
```typescript
// BAD: Mobile browsers may truncate at the nested `?`
const redirectUrl = `/auth/callback?next=/create/template?draft_id=${id}`;
```

#### ✅ DO: Use one of these approaches

**Option A: Store in httpOnly cookie before OAuth**
```typescript
// Set cookie client-side or via Server Action
document.cookie = `pending_draft_id=${draftId}; path=/; max-age=3600; SameSite=Lax`;
// Retrieve in callback route
const draftId = cookies().get('pending_draft_id')?.value;
```

**Option B: Use Supabase's built-in state parameter**
```typescript
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${origin}/auth/callback`,
    // State survives OAuth redirects by design
    queryParams: { state: JSON.stringify({ draftId, returnPath }) },
  },
});
```

**Option C: Double-encode and explicitly decode**
```typescript
// Encode the entire path including its query string
const safePath = encodeURIComponent(`/create/template?draft_id=${id}`);
const redirectUrl = `${origin}/auth/callback?next=${safePath}`;
// In callback: const next = decodeURIComponent(searchParams.get('next'));
```

### Mobile-Specific Considerations

1. **Safari ITP (Intelligent Tracking Prevention)**
   - May delay third-party cookie operations
   - Workaround: `await supabase.auth.getSession()` before Server Actions

2. **In-App Browsers (Instagram, Facebook)**
   - URL handling is unpredictable
   - Consider detecting in-app browser and showing "Open in Safari/Chrome" prompt

3. **Session Cookie Attributes**
   - Always use `sameSite: 'lax'` for auth cookies
   - Use `secure: true` in production only (see `middleware.ts`)

### Key Files

| File                                    | Role                                      |
| --------------------------------------- | ----------------------------------------- |
| `lib/draftServices.ts`                  | `saveGuestDraft()` — create guest draft   |
| `actions/draftActions.ts`               | `claimGuestDraft()` — restore after login |
| `components/auth/LoginModal.tsx`        | OAuth initiation with redirectTo          |
| `app/auth/callback/route.ts`            | OAuth callback handler                    |
| `app/auth/callback/helpers.ts`          | Cookie client + profile check             |
| `components/editor/*/Editor*.tsx`       | Draft restoration useEffect               |
| `components/auth/completeProfile/*.tsx` | Profile completion (OAuth users)          |

---

## Directory Map

| Path                | Role                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `/app`              | **Page Routes (RSC)**: `(main)/`, `(public)/`, `auth/` route groups       |
| `/actions`          | **Server Actions**: Auth, profile, dashboard, templates, creations        |
| `/components`       | **UI Components**: Organized by feature (auth/, editor/, templates/, etc) |
| `/contexts`         | **React Contexts**: AuthContext, auth-helpers, useAuthActions hook       |
| `/hooks`            | **Custom Hooks**: useMediaQuery, useDashboard, useImageUpload, etc        |
| `/lib`              | **Utilities**: Supabase clients, protectedAction, validations, helpers   |
| `/lib/supabase`     | **Supabase Clients**: server.ts (admin), browser.ts (client-side)         |
| `/lib/validations`  | **Zod Schemas**: Input validation for actions, forms, API payloads        |
| `/types`            | **Global Types**: index.ts exports shared TypeScript types               |
| `/constants`        | **Constants**: colors.ts (single source of truth for palette)            |
| `/providers`        | **Providers**: QueryProvider (React Query), AuthProvider, ThemeProvider   |
| `/public/assets`    | **Static Files**: fonts, images, logo                                     |
| `/supabase/migrations` | **DB Migrations**: Numbered .sql files (001_, 002_, etc)                  |

---

## Engineering Standards

### **Naming Conventions**

| Category          | Pattern                    | Example                                   |
| ----------------- | -------------------------- | ----------------------------------------- |
| **Files**         | kebab-case (components PascalCase) | `auth.ts`, `AuthContext.tsx`, `use-media-query.ts` |
| **Functions**     | camelCase                  | `loginAction`, `generateSlug`, `isAllowedColor` |
| **Components**    | PascalCase                 | `Header`, `TemplateEditor`, `AuthForm`   |
| **Types/Interfaces** | PascalCase               | `User`, `LoginState`, `ActionResult<T>` |
| **Constants**     | UPPER_SNAKE_CASE (arrays/objects) | `COLOR_PALETTE`, `ALLOWED_HEX_VALUES`   |
| **Server Actions** | `<subject>Action` suffix   | `loginAction`, `uploadImageAction`, `updateProfileAction` |
| **Types File**    | `<subject>.types.ts`       | `auth.types.ts`, `actions.types.ts`    |

### **State Management**

- **Auth State**: React Context (`AuthContext`) + Supabase Session  
- **Server State**: TanStack Query (React Query) for async data fetching  
- **Form State**: useFormState (Next.js Server Actions) for form submission  
- **Client State**: useState for UI-only toggles (theme, modals, filters)  
- **No Redux/Zustand**: Explicit context + query clients are sufficient

### **Server Actions Pattern**

```typescript
// 1. Define types separately
export type MyActionState = { error: string | null; success: boolean };

// 2. Create "use server" action with proper error handling
export async function myAction(
  prevState: MyActionState,
  formData: FormData,
): Promise<MyActionState> {
  // Validation → Supabase call → Error handling
  if (!email) return { error: "Email required", success: false };
  const { error } = await supabase.from("table").select("*");
  if (error) return { error: error.message, success: false };
  return { error: null, success: true };
}

// 3. For protected actions (auth required), use protectedAction wrapper
import { protectedAction } from "@/lib/protectedAction";
export async function protectedMyAction(input: Input) {
  return protectedAction<Output>(async (user, supabase) => {
    const data = await supabase.from("creations").select("*");
    if (!data) throw new ActionError("Not found", 404);
    return data;
  });
}
```

### **Error Handling**

- **ActionError Class**: Throw inside Server Actions with message + code  
- **ActionResult<T>**: Standardized response `{ success: true; data: T }` or `{ success: false; error: string; code: number }`  
- **Type Guards**: Use `isUnauthorized(result)` for 401 checks  
- **User Feedback**: Toast via Sonner; validate input with Zod before submission  
- **Security**: No data enumeration (generic error messages for auth failures)

### **Validation**

- **All inputs**: Validate with Zod schemas in `/lib/validations`  
- **Colors**: Restricted to `COLOR_PALETTE` (12 approved colors only), checked via `isAllowedColor(hex)`  
- **Email**: Lowercase + trim before Supabase auth calls  
- **Banned users**: Check `banned_users` table before login (same generic error as wrong password)

### **TypeScript**

- **Strict Mode**: tsconfig.json enforces strict=true  
- **Path Aliases**: `@/*`, `@/components/*`, `@/hooks/*`, etc (defined in tsconfig.json)  
- **Type Exports**: Use `import type` for type-only imports  
- **Generics**: Prefer `<T>` over `any`; use `unknown` for unsafe types

### **Supabase Patterns**

- **Server Client**: `createClient()` via Server Actions (auth token from request)  
- **Admin Client**: `createAdminClient()` for privilege escalation (ban users, etc)  
- **Subscriptions**: Listen to real-time changes via `.on('*')` in client components  
- **RLS**: Every table must have Row-Level Security policies; verify `auth.uid()`

---

## Agent Protocol

⚡ **For AI agents working on this codebase**:

1. **Speed First**: Don't explain basic Next.js/React concepts; assume expertise.  
2. **Type Safety**: Always check `@types/*` and existing `.types.ts` files before creating new types.  
3. **Imports**: Use path aliases (`@/`) instead of relative imports.  
4. **Error Responses**: Return `ActionResult<T>` from Server Actions; use `ActionError` for business logic failures.  
5. **Validation**: Check Zod schemas in `/lib/validations` before writing new ones.  
6. **Colors**: Query `COLOR_PALETTE` constant; never accept arbitrary hex input.  
7. **Banned Users**: Always check `banned_users` table in auth flows (generic error message).  
8. **Component Organization**: Group by feature folder (auth/, editor/, templates/) not by type.  
9. **No Comments on Obvious Code**: Only document non-obvious logic, security checks, or business rules.  
10. **Test**: Add Vitest tests for utils, hooks, and critical Server Actions.

---

## Critical Files Index

| File                           | Purpose                                                     |
| ------------------------------ | ----------------------------------------------------------- |
| **src/lib/action-response.ts** | ActionResult<T>, ActionError, `ok()`, `fail()` typedef     |
| **src/lib/protectedAction.ts** | Wrapper for auth-required Server Actions (user + supabase) |
| **src/constants/colors.ts**    | Single source of truth for color palette + validation      |
| **src/app/layout.tsx**         | Root layout: metadata, theme/auth/query providers          |
| **src/actions/auth.ts**        | Auth Server Actions (login, signup, password reset)        |
| **src/contexts/AuthContext.tsx** | Auth state provider + session management                   |
| **src/lib/supabase/server.ts** | Server-side Supabase client factory                        |
| **supabase/migrations/001_initial_schema.sql** | Core tables: profiles, creations, templates, subscriptions |
| **src/types/index.ts**         | Global TypeScript exports (User, Subscription, etc)        |
| **tailwind.config.ts**         | Theme config: coral/navy brand colors, dark mode          |

---

## Quick Reference: Common Patterns

### Add a New Server Action
1. Define types in `src/actions/<feature>.types.ts`  
2. Create `src/actions/<feature>.ts` with `"use server"` directive  
3. Use `protectedAction` if auth-required; return `ActionResult<T>`  
4. Add Zod schema to `src/lib/validations/<feature>.ts`

### Add a New Component
1. Create folder under `src/components/<feature>/`  
2. Name component PascalCase (e.g., `UserCard.tsx`)  
3. Mark with `"use client"` if interactive  
4. Extract custom hooks to `/hooks/use<Feature>.ts`

### Add a Database Table
1. Create a new migration: `supabase/migrations/<NUMBER>_<description>.sql`  
2. Define RLS policies for all tables  
3. Run `supabase db push` locally to test  
4. Document table schema in comments

### Validate User Input
1. Write Zod schema in `src/lib/validations/<feature>.ts`  
2. Call `.parse()` in Server Action before database operations  
3. Return generic error messages on validation failure  
4. Example: `EMAIL_SCHEMA.parse(email.toLowerCase().trim())`

---

## Development Workflow

- **Dev Server**: `npm run dev` (port 3000)  
- **Type Check**: `npm run type-check` (validate TypeScript without emit)  
- **Build**: `npm run build` (Next.js production build)  
- **Test**: `npm run test` (Vitest)  
- **Lint**: `npm run lint` (ESLint)

---

## Security Checklist

- ✅ **Auth**: All `/app/(main)` routes wrap with `useAuth()` context check  
- ✅ **RLS**: Every table has Supabase RLS policies (check `auth.uid()`)  
- ✅ **Secrets**: Env vars in `.env.local` (Supabase keys, API tokens)  
- ✅ **Banned Users**: Check before login; use generic error messages  
- ✅ **Password Reset**: Hash tokens via pgcrypto; set expiry  
- ✅ **CORS**: Supabase handles CORS for browser + Server Actions  
- ✅ **Colors**: Restrict to palette; no user-provided hex input  

---

**Last Updated**: 2026-03-12 | **Curated for**: HeartNote Team + AI Agents
