# HeartNote UI/UX Fixes Plan

## Context
This plan addresses 9 distinct UI/UX bug fixes and styling standardizations across the HeartNote card template system. The work involves:
- Fixing responsiveness and text overflow across 8 templates
- Standardizing color usage (primaryColor prop) inconsistently applied across templates
- Updating config schemas to add field constraints (max length, select menus, min/max counts)
- Creating a shared Reset button component for reuse
- Redesigning specific modal/UI elements (BarBatMitzvah blessing modal, OpenWhen letter overlay)

### Key Findings
- **primaryColor pipeline**: All templates receive `primaryColor?: string` (defaults to `#d4826f`), but usage is inconsistent. Some hardcode colors, others use primaryColor selectively.
- **Reset buttons**: 7 templates have reset/replay buttons, implemented inline with no shared component. Timeline, HolidayCard, and ExcuseGenerator lack explicit reset functionality.
- **Text overflow**: HIGH RISK templates (no `break-words`/`truncate`/width constraint): BarBatMitzvah (intro/blessing text), ApologySearch (searchQuery), ExcuseGenerator (excuses), HolidayCard (greeting), WeddingGlass (subtitle).
- **Config patterns**: Schemas use `text`, `textarea`, `number`, `select`, `color`, `options` (array) field types. Current validation includes `maxLength` for strings; new constraints needed for number ranges and array counts.

---

## Phase 1: Create Shared Reset Button Component
**Status**: Prerequisite (must complete first)
**Files to create**: `client/src/components/templates/components/TemplateResetButton.tsx`

### Specification
Create a reusable, locale-aware reset button with:
- Props: `onClick: () => void`, `label?: string` (defaults to "התחל מחדש" in Hebrew), `className?: string`
- Default styling: small, rounded, subtle (gray background with dark text, hover effect)
- Export from `client/src/components/templates/components/index.ts` for registry access
- Used by all templates except Timeline

### Implementation Notes
- Use `RotateCcw` icon from `lucide-react` (seen in DateInvite)
- Tailwind classes: `px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition`
- Position: fixed at bottom of template (below content area)

---

## Phase 2: Update Config Schemas
**Files to update**: `client/src/components/editor/configs.ts`
**Priority**: High (gates template implementation)

### Task 2a: PunchingBag — "hits required" field
- **Current**: `hitsRequired` type `number`, default 5 (no validation)
- **Change**: Convert to `select` field with fixed options: [3, 4, 5, 6, 7, 8, 9, 10]
- **Line**: ~400 in configs.ts

### Task 2b: BirthdayCandles — "candle count" field & default title
- **Current**: `candleCount` type `number`, default 3, range 1-10 (no select)
- **Change 1**: Convert to `select` field with options [3, 4, 5, 6, 7, 8, 9, 10]
- **Change 2**: Update `title` field default from `"מערכת כיבוי נרות דיגיטלית"` to `"מזל טוב! כבה את הנרות"`
- **Line**: ~425 in configs.ts

### Task 2c: ApologySearch — result title/description field limits
- **Current**: `resultTitle` maxLength 80, `resultSubtitle` maxLength 200
- **Changes**: 
  - `resultTitle`: reduce maxLength from 80 to 30
  - `resultSubtitle`: reduce maxLength from 200 to 100
- **Line**: ~475 in configs.ts

### Task 2d: ExcuseGenerator — excuses array & button/disclaimer limits
- **Current**: `excuses` type `options`, no min/max; `buttonLabel` maxLength 40; `disclaimer` no explicit limit
- **Changes**:
  - `excuses`: add min 1, max 8 items (currently allows 3-20)
  - `buttonLabel`: reduce maxLength from 40 to 20
  - `disclaimer`: add maxLength 60 (currently unlimited)
- **Line**: ~445 in configs.ts

---

## Phase 3: Fix Gallery Layout
**Files to update**: `client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx`
**Priority**: Medium

### Task 3a: Increase desktop grid columns
- **Current** (line 59): `grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`
- **Change**: Add intermediate breakpoints for 14-inch/large screens
- **New breakpoints**: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5` (or use `lg:grid-cols-4 xl:grid-cols-5` depending on design intent)
- **Rationale**: User wants 5 columns on large screens for "more inviting" look

---

## Phase 4: Fix Template Issues (8 Templates)

### Task 4.1: BarBatMitzvah
**Files**: 
- `client/src/components/templates/BarBatMitzvah/Desktop/BarBatMitzvahDesktop.tsx`
- `client/src/components/templates/BarBatMitzvah/Mobile/BarBatMitzvahMobile.tsx`

**Changes**:
1. **introTitle & introSubtitle color mapping**
   - Line 35: Change `text-dark` to `style={{ color: primaryColor }}`
   - Line 38: Change `text-steel` to `style={{ color: primaryColor }}` (or lighter shade of primaryColor)
   - Add `break-words` class to both for overflow protection

2. **Blessing modal redesign**
   - Current (line 82-104): Uses `bg-white/95` overlay
   - Change to: darker overlay (`bg-black/50` or `bg-black/60`), more elegant card styling, possibly add shadow/border effects
   - Consider adding fade-in animation and centered layout

3. **Hint button (transparency bug investigation)**
   - Exploration found NO transparency bug in className
   - Current: `bg-terracotta text-white px-4 py-2 rounded-full` — already visible
   - **Action**: User may be reporting a different issue; test in browser and adjust styling if needed

---

### Task 4.2: SlotMachine
**Files**:
- `client/src/components/templates/SlotMachine/Desktop/SlotMachineDesktop.tsx`
- `client/src/components/templates/SlotMachine/Mobile/SlotMachineMobile.tsx`

**Changes**:
1. **Map title & text colors to primaryColor**
   - Find all hardcoded color classes on title/heading text
   - Replace with `style={{ color: primaryColor }}`
   
2. **Add Reset/Play Again button**
   - Import `TemplateResetButton` (from Phase 1)
   - Place at bottom: `<TemplateResetButton onClick={handleReset} label="בואו לשחק שוב" />`
   - Wire to state reset logic

3. **Fix text overflow**
   - Add `break-words` and/or `max-w-[...] mx-auto` to reel display text
   - Ensure reels don't wrap unexpectedly

---

### Task 4.3: PunchingBag
**Files**:
- `client/src/components/templates/PunchingBag/Desktop/PunchingBagDesktop.tsx`
- `client/src/components/templates/PunchingBag/types/index.ts` (if needed for type updates)

**Changes**:
1. **Map title color to primaryColor**
   - Line 43: Change `text-[#1b263b]` to `style={{ color: primaryColor }}`
   - Apply to both `introTitle` and `resultTitle`

2. **Fix rapid-click -1 bug** (note: exploration found NO -1 bug in current code)
   - Current logic correctly increments: `setHits((prev) => prev + 1)`
   - Display: `remaining = hitsRequired - hits` (correct)
   - **Verify**: Test rapid clicking. If counter reaches -1 (shouldn't), add debounce/disable:
     ```typescript
     const handleHit = useCallback(() => {
       if (isDone || hits >= hitsRequired) return; // Add upper bound guard
       // existing logic
     }, [isDone, hitsRequired, hits]);
     ```

3. **subtitle & instructions text overflow**
   - Line 47: Add `break-words` to subtitle
   - Line 81: Add `break-words` to instructions text
   - Ensure no horizontal scroll

---

### Task 4.4: ApologySearch
**Files**:
- `client/src/components/templates/ApologySearch/Desktop/ApologySearchDesktop.tsx`
- `client/src/components/templates/ApologySearch/Mobile/ApologySearchMobile.tsx`

**Changes**:
1. **Map title color to primaryColor & enlarge**
   - Find title rendering (line 38-39 area in Desktop)
   - Change hardcoded `text-[#415a77]` to `style={{ color: primaryColor }}`
   - Increase size: upgrade from `text-lg` to `text-2xl` or `text-3xl`

2. **Fix searchQuery text overflow**
   - Line 48: Add `break-words` class to the typed-out search text display
   - Ensure query fits within container bounds

3. **Result title/description text overflow**
   - Line 119+: Add `break-words` to both result title and subtitle
   - Verify no text escapes container

---

### Task 4.5: ExcuseGenerator
**Files**:
- `client/src/components/templates/ExcuseGenerator/Desktop/ExcuseGeneratorDesktop.tsx`
- `client/src/components/templates/ExcuseGenerator/Mobile/ExcuseGeneratorMobile.tsx`

**Changes**:
1. **Map title color to primaryColor**
   - Verify line 90-91 already uses `style={{ color: accent }}` (which is primaryColor)
   - Ensure consistency across Mobile variant

2. **Map excuse text color to primaryColor**
   - Line 116: Change `text-[#2e3c52]` to `style={{ color: primaryColor }}`
   - Or use lighter shade if needed for contrast

3. **Fix excuse text overflow**
   - Line 116: Add `break-words` class
   - Optionally add `max-w-full` constraint if needed

4. **Make text bolder**
   - Line 116: Upgrade from `text-xl font-bold` to `text-2xl font-black`
   - Or add `font-extrabold` for extra emphasis

5. **Add Reset button**
   - Import `TemplateResetButton`
   - Place below excuse generation area: `<TemplateResetButton onClick={handleReset} label="אפס" />`

---

### Task 4.6: OpenWhen
**Files**:
- `client/src/components/templates/OpenWhen/components/LetterModal.tsx`
- `client/src/components/templates/OpenWhen/Desktop/OpenWhenDesktop.tsx`

**Changes**:
1. **Darken & enhance modal overlay** (LetterModal.tsx)
   - Current line: `bg-black/60 backdrop-blur-sm`
   - Change to: `bg-black/75` or `bg-black/80` for full darkening effect
   - Optional: Increase blur to `backdrop-blur-md`

2. **Highlight title & expiration date**
   - Find title & expiration date in modal content
   - Add `font-bold text-lg` or `font-black text-xl` classes
   - Optionally: Apply primaryColor to title: `style={{ color: primaryColor }}`

3. **Add Reset button** (optional per requirements)
   - OpenWhen doesn't explicitly need reset since envelopes can be re-opened
   - Skip unless user clarifies

---

### Task 4.7: BirthdayCandles
**Files**:
- `client/src/components/templates/BirthdayCandles/Desktop/BirthdayCandlesDesktop.tsx`
- `client/src/components/templates/BirthdayCandles/Mobile/BirthdayCandlesMobile.tsx`
- Config: `client/src/components/editor/configs.ts` (candle count select, title default — covered in Phase 2)

**Changes**:
1. **Map title color to primaryColor**
   - Line 33: Change `text-[#1b263b]` to `style={{ color: primaryColor }}`
   - Line 105: Change `text-[#d4826f]` to `style={{ color: primaryColor }}`

2. **Fix candle width overflow**
   - Exploration found candles scale correctly (gap: 12px for >6, 24px for ≤6; cake width 288px fits all)
   - **Verify**: On mobile, test with 10 candles. If candles overflow:
     - Desktop (lines 52-66): Ensure flex container has `max-w` constraint equal to cake width
     - Add `overflow-hidden` to container if needed
     - Optionally: Use CSS to scale candle sizes proportionally: `style={{ maxWidth: cakeWidth, margin: '0 auto' }}`

3. **subtitle text overflow**
   - Line 36: Add `break-words` to subtitle
   - Ensure no horizontal overflow

---

### Task 4.8: Global Reset Button Addition
Apply to ALL templates (except Timeline per requirement):

**Templates to update**:
- SlotMachine ✓ (Task 4.2)
- ExcuseGenerator ✓ (Task 4.5)
- All others: check if reset button already exists
  - BarBatMitzvah: Add (implicit reset via modal close, but add explicit button for consistency)
  - ApologySearch: Already has reset
  - PunchingBag: Already has reset
  - OpenWhen: Skip (envelopes can be re-opened; implicit reset)
  - BirthdayCandles: Already has "הדלק מחדש"
  - LoveCoupons: Already has reset
  - WeddingGlass: Already has reset
  - **Timeline**: SKIP per requirement
  - HolidayCard: Add reset/replay button if needed

**LoveCoupons Special Case**: Hide reset button during editor/creation phase
- Locate reset button render in Desktop component
- Wrap in: `{!isEditor && <TemplateResetButton ... />}`
- Or add prop `showReset?: boolean` that editor passes as `false`

---

## Phase 5: Testing & Verification

### Unit Tests (Vitest)
- [ ] Test PunchingBag counter bounds (counter stops at hitsRequired, never goes negative)
- [ ] Test BarBatMitzvah modal opens/closes correctly with new styling
- [ ] Test BirthdayCandles candle layout on mobile (10 candles, verify no overflow)
- [ ] Test ApologySearch with long searchQuery (verify break-words works)
- [ ] Test ExcuseGenerator with max 8 excuses, verify button label max 20 chars

### Browser Testing (Manual)
1. **Gallery Layout**: View at lg, xl, 2xl breakpoints, verify 5-column layout on large screens
2. **Color Consistency**: Check each template's title/text uses primaryColor from editor palette
3. **Text Overflow**: Input max-length strings into each field, verify no horizontal scroll
4. **Reset Buttons**: Click reset on each template (except Timeline), verify state resets
5. **Responsive**: Test all templates on mobile (375px), tablet (768px), desktop (1280px+)
6. **Modals**: Test BarBatMitzvah blessing modal, OpenWhen letter modal with new overlays
7. **Config Validation**: Create cards with config constraints (e.g., 8 excuses max, 30-char result title) — verify editor enforces limits

### Dev Server Hot-Reload
- Run `npm run dev` from client/
- Edit component → verify live reload
- Edit config schema → verify editor form updates

---

## Execution Order

1. **Phase 1**: Create `TemplateResetButton` component (foundation for all templates)
2. **Phase 2**: Update `configs.ts` schemas (4 templates: PunchingBag, BirthdayCandles, ApologySearch, ExcuseGenerator)
3. **Phase 3**: Fix gallery layout (1 file)
4. **Phase 4**: Fix individual templates in order:
   - 4.1 BarBatMitzvah (2 files, modal redesign)
   - 4.2 SlotMachine (2 files, reset button)
   - 4.3 PunchingBag (2 files, counter guard)
   - 4.4 ApologySearch (2 files, color & overflow)
   - 4.5 ExcuseGenerator (2 files, text emphasis & reset)
   - 4.6 OpenWhen (2 files, modal overlay)
   - 4.7 BirthdayCandles (3 files + configs, color mapping & overflow)
   - 4.8 Global reset button integration (slot in all templates)
5. **Phase 5**: Testing & verification (manual QA + Vitest)

**Total Files to Modify**: ~25 files (3 config, 1 gallery, 2 per template × 8, plus new reset button component)

---

## Critical Notes

- **primaryColor consistency**: After fixes, EVERY template's title should respect primaryColor. Review color assignments carefully.
- **Overflow protection**: Use `break-words` on all text containers. Add `max-w-[...]` constraints where needed.
- **Reset button labeling**: Each template can customize the label (e.g., "בואו לשחק שוב" for SlotMachine, "אפס" for ExcuseGenerator).
- **Config field validation**: EditorField schema already supports `maxLength` for strings; ensure new `options` fields in selects are properly defined with value/label pairs.
- **No shared reset button during editor phase for LoveCoupons**: Verify UI state tracks whether in editor mode.
