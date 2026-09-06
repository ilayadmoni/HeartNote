# Template UI Polish — Plan

## Part A — WeddingGlass Mobile (`WeddingGlass/Mobile/WeddingGlassMobile.tsx`)

Goal: bride+groom figures fill ~50vh on mobile, no dead space.

Changes:
1. Stage wrapper `relative w-full h-72 mb-6` → `relative w-full h-[55vh] sm:h-72 mb-3 sm:mb-6`.
2. Groom container `w-40 h-64 sm:w-44 sm:h-72` → `w-[45%] h-[50vh] sm:w-44 sm:h-72`.
3. Bride container `w-44 h-64 sm:w-48 sm:h-72` → `w-[48%] h-[50vh] sm:w-48 sm:h-72`.
4. Reduce subtitle bottom margin `mb-6` → `mb-3 sm:mb-6`.

## Part B — BarBatMitzvah

### B1 — `BarBatMitzvah.tsx`: reset state on `data.kind` change
Add `useEffect([data.kind])` resetting `isThrowing`, `showGreeting`, `burstKey`.

### B2 — `BarBatMitzvah/Mobile/BarBatMitzvahMobile.tsx`
- Remove hardcoded wrapper `bg-white dark:bg-[#121721] rounded-3xl overflow-hidden`. Match WeddingGlass-style transparent wrapper.
- Title: drop `text-[#2e3c52] dark:text-[#F5F1EC]`, apply `style={{ color: primaryColor }}` (mirrors WeddingGlassMobile pattern).
- Blessing card: replace `bg-black/5 dark:bg-white/15 backdrop-blur-xl border border-black/10 dark:border-white/25` with `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700`; text classes → `text-zinc-900 dark:text-zinc-100` / `text-zinc-600 dark:text-zinc-300`.
- Try Again branch (when `showGreeting`): button background `bg-orange-500 hover:bg-orange-600 active:bg-orange-700` (use className conditional rather than inline style).

## Constraints respected
- All files stay ≤150 lines.
- No `any`, no `console.*`.
- `@/*` aliases preserved.
- Dev branch only.

## Verification
- `npm run type-check`, `npm run lint`, `npm run build`.
