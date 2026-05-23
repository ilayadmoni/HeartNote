# Design Spec: Gallery Smart Search Bar
**Date:** 2026-05-23
**Status:** Approved

---

## Overview

Add a real-time smart search bar to `/gallery` that filters displayed templates as the user types. Filtering combines `activeTab` (category) + `searchQuery` (text) into a single source of truth via a new `useGallerySearch` hook.

---

## Architecture

### New files

```
client/src/components/GallerySearchBar/
├── index.ts                      # barrel export
├── GallerySearchBar.types.ts     # Props + internal types
├── GallerySearchBar.tsx          # Controlled input UI (<150 lines)
└── useGallerySearch.ts           # Debounce + combined filter logic (<150 lines)
```

### Modified files

| File | Change |
|---|---|
| `app/(main)/gallery/page.tsx` | Add `searchQuery` state; pass `filteredTemplates` to Desktop/Mobile |
| `components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx` | Accept `templates` prop; remove inline filter logic |
| `components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx` | Accept `templates` prop; remove inline filter logic |

---

## Data Flow

```
useActiveTemplates() → enrichedTemplates (Template[])
                              ↓
useGallerySearch(enrichedTemplates, activeTab, searchQuery) → filteredTemplates
                              ↓
GalleryTemplateDesktop / GalleryTemplateMobile(templates={filteredTemplates})
```

The page component owns `activeTab` and `searchQuery` state. Desktop/Mobile components become pure display components — they receive a pre-filtered `templates` prop and render it directly.

---

## `useGallerySearch` Hook

**Signature:**
```typescript
function useGallerySearch(
  templates: Template[],
  activeTab: string,
  searchQuery: string
): { filteredTemplates: Template[] }
```

**Logic (applied in order):**
1. Filter by `activeTab`: if `activeTab !== 'all'`, keep only templates where `categories?.includes(activeTab)`
2. Filter by `searchQuery` (debounced 200ms): if non-empty, case-insensitive match against `title`, `description`, and `categories` joined as string
3. Return combined result

**Search fields** (from gallery-specific `Template` type in `components/galleryTemplate/types/index.ts`):
- `title: string`
- `description: string`
- `categories?: string[]` — joined to string for matching

**Note:** Global `Template` type (`types/index.ts`) uses `tags: string | null` (DB field), but the gallery UI type does not expose `tags`. Search scope is `title + description + categories` only.

---

## `GallerySearchBar` Component

**Props** (`GallerySearchBar.types.ts`):
```typescript
interface GallerySearchBarProps {
  value: string
  onChange: (value: string) => void
  className?: string
}
```

**UI elements:**
- `role="search"` on wrapper div
- `dir="rtl"` layout
- Search icon — right side (RTL = visual right = `right-3` in Tailwind)
- Clear (×) button — left side (`left-3`), visible only when `value` non-empty
- `aria-label="חיפוש תבניות"` on `<input>`
- Placeholder: `"חפש תבניות..."`
- Focus ring: `#D85A30` (brand color) via Tailwind `ring` + custom color or inline style
- Min-height: 48px for mobile tap target

**Responsive:**
- Mobile: `w-full`
- Desktop: `max-w-[640px] mx-auto` (or match surrounding layout alignment)

**Animation:** Framer Motion `AnimatePresence` already in project — used for results fade/slide transition in the parent grid, not inside `GallerySearchBar` itself (search bar is always visible).

---

## Empty State

When `filteredTemplates.length === 0`, render in the grid area:

```tsx
<div className="text-center py-16 text-gray-500">
  <p>לא נמצאו תבניות התואמות לחיפוש שלך</p>
</div>
```

Empty state is rendered inside `GalleryTemplateDesktop` / `GalleryTemplateMobile` (each already owns its grid layout). Both receive `filteredTemplates` — if empty array, render the Hebrew message.

---

## Gallery Page Changes

```tsx
// New state
const [searchQuery, setSearchQuery] = useState<string>('')

// New hook
const { filteredTemplates } = useGallerySearch(enrichedTemplates, activeTab, searchQuery)

// JSX — after FilterTabs
<GallerySearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  className="mb-8"
/>

// Pass filteredTemplates instead of enrichedTemplates
<GalleryTemplateDesktop templates={filteredTemplates} ... />
<GalleryTemplateMobile templates={filteredTemplates} ... />
```

---

## Constraints

- Max 150 lines per file (modular-code-architect enforced)
- TypeScript strict: zero `any`, all return types explicit
- `@/*` path aliases only
- `logger.*` instead of `console.*`
- Client-side only — no server actions
- `dev` branch only

---

## Checklist

- [ ] No file exceeds 150 lines
- [ ] TypeScript: zero `any`, all return types explicit
- [ ] No `console.*` — `logger.*` used
- [ ] Real-time filtering works (debounced 200ms)
- [ ] Combined filtering (tab + search) correct
- [ ] Empty state in Hebrew when no results
- [ ] Clear × button works
- [ ] RTL layout correct (icons correctly positioned)
- [ ] Responsive: mobile full-width, desktop max-width
- [ ] Focus ring uses `#D85A30`
- [ ] `aria-label` in Hebrew, `role="search"` on wrapper
- [ ] Filter logic in `useGallerySearch.ts` only — no duplication
- [ ] Desktop/Mobile inline filter logic removed
- [ ] `dev` branch only, no changes to `main`
- [ ] Plan written to `.claude/plans/gallery-smart-search-bar.md`
