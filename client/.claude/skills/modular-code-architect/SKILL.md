---
name: modular-code-architect
description: "Enforce strict 150-line file length limit across all directories. Auto-applied to all code changes. Promotes modular decomposition, extract helpers, split components into sub-modules, reduce complexity."
---

# Modular Code Architect — 150-Line File Limit

## Core Rule

**Every file must stay under 150 lines of code.** No exceptions.

When a component, hook, utility, or module would exceed 150 lines, immediately decompose it into smaller, logical units.

---

## When This Skill Applies

- ✅ Every time you write or edit code
- ✅ All directories (`src/`, `app/`, `components/`, `lib/`, `hooks/`, `actions/`, etc.)
- ✅ All file types (`.tsx`, `.ts`, `.jsx`, `.js`)
- ✅ Creating new features, fixing bugs, refactoring

---

## Execution Protocol

### Step 1: Pre-Analysis (Before Writing)

Before writing any code:
1. **Estimate total line count** for the entire module
2. If expected to exceed 150 lines → plan decomposition upfront
3. Identify logical split points (hooks, sub-components, helpers, utils)

### Step 2: Modular Decomposition

When splitting a file, follow these patterns:

| Pattern | Use When | Example |
|---------|----------|---------|
| **Extract Hook** | Logic is reusable across components | `useFormValidation()` from form component |
| **Sub-component** | Part of UI is complex/nested | `<CardHeader>`, `<CardBody>` from card |
| **Utility/Helper** | Pure functions, calculations | `calculateExpiry()`, `sanitizeInput()` |
| **Context Provider** | Shared state across tree | `<ThemeProvider>` split from main layout |
| **Server Action** | Mutation logic in `actions/` folder | Move `createCard` to `actions/creations/create.ts` |

### Step 3: File Organization

**Folder structure for split modules:**

```
src/components/Card/
├── index.tsx          ← exports <Card>
├── CardHeader.tsx     ← sub-component
├── CardBody.tsx       ← sub-component
├── useCardState.ts    ← hook (if needed)
└── types.ts           ← types/interfaces
```

### Step 4: Validation

After decomposition:
- [ ] No file exceeds 150 lines
- [ ] Each file has single responsibility
- [ ] Exports are clean (`export default` or named)
- [ ] Related files grouped in same folder
- [ ] No circular imports

---

## Refactoring Patterns

### Long Component → Extract Sub-components

```typescript
// Before: 200+ lines
export function Dashboard() {
  // ... render header (40 lines)
  // ... render sidebar (50 lines)
  // ... render main content (80 lines)
  // ... render footer (30 lines)
}

// After: Split into files
export function Dashboard() {
  return (
    <>
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <DashboardContent />
      </div>
      <DashboardFooter />
    </>
  );
}
```

### Logic-Heavy Component → Extract Hook

```typescript
// Before: form component with validation logic
export function UserForm() {
  const [formData, setFormData] = useState(...);
  const [errors, setErrors] = useState(...);
  // ... 100 lines of validation logic
}

// After: extract hook
function useUserFormValidation() { /* 60 lines */ }
export function UserForm() {
  const { formData, errors, handleChange } = useUserFormValidation();
  // ... 40 lines of UI
}
```

### Multiple Concerns → Extract Helpers

```typescript
// Before: utilities.ts (200+ lines)
export function validateEmail() { }
export function calculateExpiry() { }
export function sanitizeInput() { }

// After: split by domain
// lib/validations/email.ts
export function validateEmail() { }

// lib/utils/expiry.ts
export function calculateExpiry() { }

// lib/utils/sanitize.ts
export function sanitizeInput() { }
```

---

## Common Anti-patterns (Don't Do This)

- ❌ Shoving everything in a single large file
- ❌ Creating a "utils.ts" dumping ground with 300+ lines
- ❌ Extracting one-liner helper functions (keep together)
- ❌ Over-fragmenting related logic into 10 micro-files
- ❌ Lazy refactoring ("I'll split it later")

---

## Quick Checklist

Before completing any task:

- [ ] Ran line count estimation
- [ ] No file exceeds 150 lines
- [ ] Each file has one clear responsibility
- [ ] Imports are explicit and organized
- [ ] Exports are intuitive (`index.tsx` re-exports if needed)
- [ ] Type definitions are co-located
- [ ] No circular dependencies
- [ ] Folder structure reflects logical grouping

---

## Examples from HeartNote

✅ **Good:** `src/actions/creations/` folder with separate files:
- `create.ts` — creation logic only
- `submit.ts` — submission logic only
- `delete.ts` — deletion logic only
- `helpers/quotaCheck.ts` — utility function

✅ **Good:** Components with sub-files:
- `CardEditor/` → `index.tsx`, `Form.tsx`, `Preview.tsx`, `useEditorState.ts`

❌ **Bad:** Single 300-line file doing form + validation + submission + preview

---

## How to Trigger

This skill is **automatically applied** whenever you work on code. Mention it explicitly if you want me to prioritize refactoring:

> "Create the onboarding flow, apply modular code architect"

Or use the skill name in requests to enforce stricter decomposition.
