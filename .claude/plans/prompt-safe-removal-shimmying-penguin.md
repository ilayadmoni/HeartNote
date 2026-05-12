# Safe Removal Plan: `SteamyWindow` Template

## Context
The `SteamyWindow` template is being removed from HeartNote entirely. This plan enumerates every reference (component code, registries, type unions, gallery previews, DB seed) so the removal is complete and type-safe with no ghost imports.

**Important nuance discovered:** The Supabase storage bucket `image_steamy_Window` is misleadingly named — it is the **shared image bucket** used by the generic `useImageUpload` hook (`src/hooks/useImageUpload.ts`) and `claimGuestDraft` (`src/actions/draftActions.ts`) for **all** templates that upload images. It must NOT be removed. Renaming it is a separate concern (requires bucket-level data migration in Supabase) and is out of scope for this template removal.

---

## 1. Files to Delete

### Entire SteamyWindow component folder
Delete the directory `src/components/templates/SteamyWindow/` and everything in it:
- `index.ts`
- `SteamyWindow.tsx`
- `constants.ts`
- `types/index.ts`
- `Desktop/SteamyWindowDesktop.tsx`
- `Mobile/SteamyWindowMobile.tsx`
- `components/index.ts`
- `components/SteamyWindowPreview.tsx`
- `components/SteamyWindowCropModal.tsx`
- `components/CreateCardPage.tsx`
- `components/ImageCropperModal.tsx`
- `components/ConfirmationModal.tsx`
- `components/SteamCanvas.tsx`

(All helpers in `components/` are local — no external file imports them.)

### Gallery preview file
- `src/components/galleryTemplate/previews/SteamyWindowPreview.tsx`

---

## 2. Files to Modify

### `src/components/templates/registry.ts`
- Remove import (line 18): `import { SteamyWindow } from "./SteamyWindow/SteamyWindow";`
- Remove registry entry (line 49): `SteamyWindow: SteamyWindow as AnyTemplateComponent,`

### `src/components/templates/types.ts`
- Remove the `SteamyWindowData` interface block (lines 121–129, including the `// 8. STEAMY WINDOW` section header).
- If a master template-data union type elsewhere in the file references `SteamyWindowData`, drop that arm.

### `src/components/galleryTemplate/data/templates.ts`
- Remove the SteamyWindow gallery entry (lines 116–125).
- Remove the SteamyWindow default preview-data entry (lines 274–277).

### `src/components/galleryTemplate/types/index.ts`
- Remove `| "SteamyWindow"` from the template-component union (line 29).

### `src/components/galleryTemplate/components/MorePreviews.tsx`
- Remove re-export (line 7): `export { SteamyWindowPreview } from "../previews/SteamyWindowPreview";`

### `src/components/galleryTemplate/components/index.ts`
- Remove `SteamyWindowPreview,` from the export list (line 12).

### `src/components/galleryTemplate/components/TemplatePreview.tsx`
- Remove `SteamyWindowPreview` from the import (line 12).
- Remove the SteamyWindow `case` branch in the preview switch (lines 46–47).

### `supabase/migrations/006_seed_templates.sql`
- Remove the SteamyWindow seed block (lines 26–74) — slug `'steamy-window'`, name `'חלון עם אדים'`.
- **Note:** Migrations are immutable history; only edit if this seed has not yet been applied to production. If it has been applied, instead author a new migration that does:
  ```sql
  DELETE FROM templates WHERE slug = 'steamy-window';
  ```
  and leave the historical seed file alone. Confirm with the user before choosing.

---

## 3. Files / Items to LEAVE ALONE

- **`src/lib/utils/image-utils.ts`** — `IMAGE_CONSTANTS.BUCKET = "image_steamy_Window"` is the shared upload bucket. Do not change.
- **`src/actions/draftActions.ts`** lines 101 & 114 — same shared bucket; do not change.
- **`src/hooks/useImageUpload.ts`** line 8 — comment references the same bucket; harmless. Optionally update wording later, but not required for this removal.
- **Public assets** — none found matching `*steamy*`.

---

## 4. Verification Steps

Run from `client/`:

```bash
# 1. Type safety — must be the FIRST check (catches ghost imports + union mismatches)
npm run type-check

# 2. Lint — catches unused imports / dead code
npm run lint

# 3. Grep for any leftover references (should return zero)
#    Use Grep tool from the editor, case-insensitive, on the client/ tree:
#      pattern: SteamyWindow
#      pattern: steamy-window
#      pattern: SteamyWindowData
#    Expect: only the single `image_steamy_Window` bucket string in image-utils.ts,
#    draftActions.ts, and useImageUpload.ts comment.

# 4. Production build
npm run build

# 5. Smoke test in the browser
npm run dev
#    - Open /gallery → confirm SteamyWindow card is gone, others render fine.
#    - Open /create/[someTemplateId] for a template that uses image upload → confirm
#      image upload still works (verifies the shared bucket was NOT broken).
```

If any of the above fail, the most likely cause is a missed reference in a union type or a switch/case in `TemplatePreview.tsx` / `registry.ts`.

---

## 5. Critical Files Reference List

| File | Action |
|---|---|
| `src/components/templates/SteamyWindow/**` | Delete folder |
| `src/components/templates/registry.ts` | Edit (remove import + entry) |
| `src/components/templates/types.ts` | Edit (remove interface) |
| `src/components/galleryTemplate/data/templates.ts` | Edit (2 blocks) |
| `src/components/galleryTemplate/types/index.ts` | Edit (union member) |
| `src/components/galleryTemplate/previews/SteamyWindowPreview.tsx` | Delete |
| `src/components/galleryTemplate/components/MorePreviews.tsx` | Edit |
| `src/components/galleryTemplate/components/index.ts` | Edit |
| `src/components/galleryTemplate/components/TemplatePreview.tsx` | Edit (import + case) |
| `supabase/migrations/006_seed_templates.sql` | Edit OR new migration (TBD) |
