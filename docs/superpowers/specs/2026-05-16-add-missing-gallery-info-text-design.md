# Design: Add Missing Info Modal Text for 8 Interactive Event Templates

**Date:** 2026-05-16  
**Status:** Approved  
**Branch:** dev

---

## Problem

The 8 interactive event templates added in commit `53ac56a` (Nitsan design) appear in the `/gallery` grid but show no info (ℹ️) button. The button is suppressed by `TemplateCard` when `TEMPLATE_INFO_TEXT[template.id]` is `undefined`. Users cannot access "how it works" for these templates.

Additionally, `data/templates.ts` is 469 lines — more than 3× the mandatory 150-line file limit. This must be resolved as part of any change to that file.

---

## Scope

**In scope:**
- Add 8 `TEMPLATE_INFO_TEXT` entries (playful Hebrew, same voice as existing 16)
- Split `data/templates.ts` into ≤150-line focused files

**Out of scope:**
- No changes to `TemplateInfoModal.tsx`
- No changes to `TemplateCard.tsx`
- No changes to the 16 existing `TEMPLATE_INFO_TEXT` entries
- No DB changes
- No new template registrations

---

## Missing Templates

| Template ID | Hebrew Name | Category (DB) |
|---|---|---|
| `birthday-candles-interactive` | עוגת יום הולדת אינטראקטיבית | אירועים מיוחדים |
| `wedding-glass-interactive` | חתונה אינטראקטיבית | חתונה |
| `holiday-rosh-hashanah-interactive` | ראש השנה אינטראקטיבי | חגים |
| `holiday-passover-interactive` | פסח אינטראקטיבי | חגים |
| `holiday-purim-interactive` | פורים אינטראקטיבי | חגים |
| `holiday-shavuot-interactive` | שבועות אינטראקטיבי | חגים |
| `holiday-sukkot-interactive` | סוכות אינטראקטיבי | חגים |
| `holiday-hanukkah-interactive` | חנוכה אינטראקטיבי | חגים |

---

## Architecture

### File Split

`data/templates.ts` (469 lines) → 5 focused files + 1 barrel:

| File | Responsibility | Target lines |
|---|---|---|
| `data/categoryConfig.ts` | `CATEGORY_EMOJI_MAP`, `FILTER_TABS` | ~28 |
| `data/baseTemplates.ts` | 16 original `TEMPLATES` entries | ~140 |
| `data/interactiveEventTemplates.ts` | 8 `INTERACTIVE_EVENT_TEMPLATES` entries + merge | ~95 |
| `data/previewData.ts` | `PREVIEW_DATA` | ~125 |
| `data/templateInfoText.ts` | All 24 `TEMPLATE_INFO_TEXT` entries | ~90 |
| `data/templates.ts` (barrel) | Imports + re-exports + final TEMPLATES merge | ~20 |

All external consumers import from `"../data/templates"` — zero import-path changes required.

### TemplateInfoModal contract

```ts
interface TemplateInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  infoText: string;   // ← populated from TEMPLATE_INFO_TEXT[template.id]
}
```

The modal expects `infoText` to be a non-empty string. The 8 new entries must be non-empty.

---

## Info Text Tone

Playful, self-aware Hebrew — same voice as the existing 16 entries. Key characteristics:
- Written in second person plural (אתם)
- Parenthetical asides with dry humor
- References the actual mechanic of the template
- Ends with a witty punchline or observational twist

---

## Affected Files

**Modified:**
- `client/src/components/galleryTemplate/data/templates.ts` → becomes barrel (re-export only)

**Created:**
- `client/src/components/galleryTemplate/data/categoryConfig.ts`
- `client/src/components/galleryTemplate/data/baseTemplates.ts`
- `client/src/components/galleryTemplate/data/interactiveEventTemplates.ts`
- `client/src/components/galleryTemplate/data/previewData.ts`
- `client/src/components/galleryTemplate/data/templateInfoText.ts`

---

## Rollback

Revert the commit: all files in `data/` are restored to their pre-split state. The 8 interactive event templates return to having no info button (no functional regression — they were already without it).

---

## Verification

```bash
npm run type-check   # zero errors
npm run lint         # zero warnings
npm run build        # exits 0
```

Visual check on `/gallery`:
- Each of the 8 interactive event cards shows the ℹ️ button
- Clicking opens `TemplateInfoModal` with correct title, description, and info text
- Existing 16 template cards unchanged
- No TypeScript errors in any `data/` file
