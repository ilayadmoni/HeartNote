# Plan: Refactor HeartNote Mobile Navigation Menu Items

## Context

The mobile navigation currently looks "boxy" and rough due to:
- **2px coral-colored borders** around each `MobileNavItem` row, making them look like boxed cards
- **Dual-layer glowing shadows** (`0 0 12px rgba(212,130,111,0.3), 0 4px 12px -3px ...`) applied to every item, creating visual noise
- An arrow icon enclosed in a **32px circle** (border + background), adding clutter
- The `borderColor: C.coral` inline style overrides the subtle Tailwind class to a full-opacity coral border

> **Important note:** The user referenced `MenuItem.tsx` but that file is the desktop dropdown (Profile/Sign Out) and is already minimal and clean. The actual mobile navigation items are in `MobileNavItem.tsx`. Both will be addressed.

## Files to Modify

| File | Scope of change |
|------|----------------|
| `src/components/header/components/MobileNavItem.tsx` | **Primary** — redesign the row appearance |
| `src/components/header/components/MobileMenu.tsx` | **Minor** — soften the login button corners, refine container |
| `src/components/header/components/MenuItem.tsx` | **Minimal** — already clean, add `dir="rtl"` and slightly round hover |

---

## Design Tokens in Use

From `tailwind.config.ts` and `constants/colors.ts`:
- **Coral accent:** `#d4826f` (coral-500)
- **Dark text:** `#2e3c52` (navy-700)
- **Muted text:** `#4a5a72`
- **Background:** `#faf7f5` (beige/cream)
- **Font:** `var(--font-open-sans)`

---

## Implementation Plan

### 1. `MobileNavItem.tsx` — Full Redesign

**Remove:**
- `border-2 border-[rgba(212,130,111,0.18)]` and all hover border variants
- `style={{ boxShadow: ... }}` (the coral glow shadows)
- `style={{ borderColor: C.coral }}` inline override
- The circular arrow `<span>` (32px circle with border + background)

**Add:**
- `rounded-xl` (softer than 16px radius, ~12px) — or remove rounding entirely for a "row" feel
- Hover: `hover:bg-[rgba(212,130,111,0.06)]` (very light warm blush fill)
- Subtle hover shadow: `hover:shadow-sm` — no shadow by default
- Thin bottom separator using `border-b border-[rgba(212,130,111,0.1)]` on the `<li>` (last item excluded via `last:border-b-0`)
- Padding: increase to `py-4 px-3` for spacious feel
- Bare SVG chevron (no enclosing circle): same path `M6 1 L1 5 L6 9`, coral stroke, `flexShrink: 0`
- Transition: `transition-all duration-200`
- RTL: text side stays right, arrow indicator stays on left side (already correct)

**Result shape:**
```
┌──────────────────────────────────────┐  ← no border
│                            גלריית תבניות  →  │  ← arrow bare (no circle)
│  תיאור קצר באיטליק                       │
└──────────────────────────────────────┘  ← thin separator line (not box)
```

### 2. `MobileMenu.tsx` — Login Button & Container

**Login/Register button:**
- Change `rounded-[18px]` → `rounded-full` (fully pill-shaped)
- Keep the gradient: `linear-gradient(135deg, #d4826f 0%, #b86a57 100%)`
- Soften the shadow: `0 8px 20px -4px rgba(212,130,111,0.45)` (reduce from 55% to 45% opacity, smaller spread)
- Already has `active:scale-[0.98]` — keep it

**Menu container:**
- No major changes needed
- Reduce top padding slightly: `24px 20px 20px` (from `26px 22px 22px`) for a tighter feel

### 3. `MenuItem.tsx` — Desktop Dropdown (Minor Polish)

The component is already clean. No structural changes needed — it's not the "boxy" element.

---

## Verification

1. Run `npm run dev` from `client/`
2. Open localhost on mobile viewport (< 1024px)
3. Tap hamburger → menu opens
4. Verify: items are clean rows, no boxes/borders visible, gentle hover blush, bare chevron arrow
5. Verify: login button is pill-shaped with soft floating shadow
6. Verify: RTL alignment intact (text right, arrow left)
7. Verify: last item has no bottom divider
8. Check dark mode: rows should still be legible
