# HeartNote — New Templates Integration Plan

**Source prototype:** `D:\HeartNote\framesApril.html`
**Prepared:** 2026-04-17
**Scope:** Integrate 8 new interactive card templates into the existing HeartNote pipeline (gallery → editor → public viewer).

> ⚠️ The prototype actually contains **8** templates (not 9 as initially described). They are identified below by the `id` used in the HTML's tab system.

---

## 0. Shared Foundation (MUST be done before any per-template agent)

These cross-cutting changes are prerequisites for every template agent. One agent runs this section; all per-template agents (§2–§9) assume the output of §0 already exists.

### 0.1 Audit existing architecture (for context only)

A new template is integrated in **five concentric layers** — every agent must touch exactly these layers for its template:

| Layer | Location | What to add |
|---|---|---|
| **1. Types** | `client/src/components/templates/types.ts` | `interface <Name>Data { ... }` describing the data shape |
| **2. Component** | `client/src/components/templates/<Name>/` | `<Name>.tsx` (responsive wrapper) + `Desktop/<Name>Desktop.tsx` + `Mobile/<Name>Mobile.tsx` + `index.ts` barrel (optional: `components/`, `types/`, `constants/`, `hooks/`) |
| **3. Registry + barrel** | `client/src/components/templates/registry.ts` and `index.ts` | Add `<Name>` import + `TEMPLATE_REGISTRY` entry |
| **4. Editor config** | `client/src/components/editor/configs.ts` | Entry in `EDITOR_CONFIGS` with `fields[]` and `defaultData` |
| **5. Gallery** | `client/src/components/galleryTemplate/data/templates.ts`, `.../types/index.ts`, `.../components/MorePreviews.tsx`, `.../components/TemplatePreview.tsx` | Entry in `TEMPLATES`, `PREVIEW_DATA`, `TEMPLATE_INFO_TEXT`; extend `TemplateComponentKey` union; **hand-crafted miniature preview component** (see §0.8) wired into the `TemplatePreview` switch |
| **6. Database** | `supabase/migrations/YYYYMMDD_*.sql` | `INSERT INTO public.templates (...)` with `config_schema` JSONB, `expiration_policy` JSONB, and `uses` explicitly set to `0` (see §0.9) |

Route auto-magic: `/create/<slug>` and `/p/<creation-id>` do **not** need changes — they resolve templates dynamically via `templateIdToComponentKey()` + `TEMPLATE_REGISTRY`.

### 0.2 Colour palette constraint

Only the 12 hex values in `client/src/constants/colors.ts` are accepted by the editor's `ColorPicker` and by the `validateMetadata()` server-side validator. **Do not introduce new hex values for `color`-type fields** — map prototype colours (`#cb8e7c`, `#1b263b`, `#415a77`, `#f2e9e4`, etc.) to the closest palette member (`#d4826f` for terracotta/accent; the rest stay as hard-coded neutrals inside the component, not as `color` fields). Hard-coded neutrals (backgrounds, borders, text colours) live inside the component's JSX and are **not** user-editable.

### 0.3 Add missing editor field types (if needed)

The prototype introduces input shapes not currently supported by the editor. Before per-template work begins, extend `client/src/components/editor/` with these generic editors:

| Prototype need | Existing editor reusable? | Action |
|---|---|---|
| String list (excuses, slot symbols) | ✅ `OptionsEditor` | Reuse as-is |
| Dropdown with preset values (holiday type, bar/bat) | ✅ `select` via `EditorField` | Reuse as-is |
| Integer counter (hits, candles, clicks) | ⚠️ `number` handled in `EditorField` but **has no entry in `EditorFieldType`** | Add `"number"` to `EditorFieldType` union in `client/src/components/editor/types.ts` |
| Per-entry object list with labels (slot 3-column options, holiday presets with icon+title+placeholder) | ❌ No generic editor | Decide per-template: inline with `options` arrays, or build a lightweight `CustomListEditor`. **See §10.3 for open question.** |

**Recommendation:** Extend `EditorFieldType` to include `"number"` in §0, and keep per-template custom editors local to each template folder unless more than one template needs them.

### 0.4 Gallery category extension

Current filter tabs (`client/src/components/galleryTemplate/data/templates.ts`):
`all / romantic / fun / memories / gifts`

Several new templates don't fit cleanly (`wedding`, `holiday`, `mitzvah`, `birthday`). **Decision required** — see §10.1. The plan below uses **placeholder categories** which must be confirmed before §2 starts.

### 0.5 Shared helpers to reuse

- `FooterBranding` and `BackToGallery` from `@/components/templates/components` — **include in every new Desktop and Mobile layout** (existing templates all do).
- `FloatingIcons` from `@/components/templates/OpenWhen/components` — background decoration; reuse where appropriate.
- `useMediaQuery("(max-width: 768px)")` — breakpoint convention for all templates.
- `framer-motion` for animations (NOT raw `@keyframes` as the prototype uses). Port all HTML keyframe animations to `motion` components.
- `canvas-confetti` for success celebrations (see `DateInvite.tsx` for pattern).

### 0.6 Hebrew / RTL + font rules

- Root HTML already sets `dir="rtl"`. All text classes use the `text-hebrew-heading` / `text-hebrew-body` utilities.
- Do NOT load Tailwind's CDN runtime like the prototype — the project uses the local Tailwind build. The prototype's `tailwind.config` extension (`dark`, `terracotta`, `cream`, `steel`, `graylight`, `offwhite`) is **not** part of the project — those colours must be inlined as raw hex or mapped to existing Tailwind colours in each component.

### 0.7 Migration file per template (UPDATED)

**Strategy change:** Each template gets its own migration file named `supabase/migrations/YYYYMMDD_add_<template_slug>.sql`. This allows safer per-template production deployments and independent rollback.

Example: `supabase/migrations/20260418_add_apology_search.sql`

Each file contains:
1. A header comment with rollback instruction (single `DELETE FROM public.templates WHERE slug = '...'`)
2. One `INSERT INTO public.templates (..., uses) VALUES (..., 0) ON CONFLICT (slug) DO NOTHING`

Do **not** use the single-file approach (`20260417_add_april_templates.sql`). All per-template agents must create individual migration files.

### 0.8 Hand-crafted gallery previews (REQUIRED for every template)

Every template **must** have a bespoke miniature preview in the gallery card — falling back to `LivePreview` leaves the card visually blank (the scaled-down real component is too expensive and often broken at miniature sizes).

**Per-template actions (Layer 5):**
1. Open `framesApril.html` and find the template's `<div id="tab-...">`. Identify the dominant visual (reels, bag, candles, glass, etc.).
2. Add a small React component (typically ~30–60 lines, using `motion`) to `client/src/components/galleryTemplate/components/MorePreviews.tsx` — e.g. `SlotMachinePreview`, `PunchingBagPreview`. Follow the size convention of existing previews (`p-3`, small SVGs / `w-7 h-10` blocks, text sizes `text-[6px]`–`text-[10px]`).
3. Import it in `TemplatePreview.tsx` and add a `case "<ComponentKey>": return <...Preview />;` branch **before** the `default` fallback.
4. Any colors used must either be palette hex (`#d4826f`) or neutrals — no new brand colors.

The per-template sections in §§2–9 all assume this step; do not skip it.

### 0.9 Template `uses` counter

The `templates.uses INTEGER NOT NULL DEFAULT 0` column (migration `013_template_usage_tracking.sql`) already exists, and trigger `trigger_increment_template_uses` on `creations` INSERT atomically bumps it. **No new trigger or application logic is required** for new templates — they inherit the behavior automatically.

**Per-template action:** include `uses` in the INSERT column list and pass `0` explicitly. The column has a default, but passing it explicitly documents intent and prevents regressions if the default is ever removed:

```sql
INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES ('<slug>', ..., 0)
ON CONFLICT (slug) DO NOTHING;
```

**§0 is complete when:**
- [ ] `EditorFieldType` union includes `"number"` (if approved)
- [ ] Gallery categories decided (§10.1 resolved)
- [ ] Migration skeleton file exists with header comment + ROLLBACK block, and all INSERT rows include the `uses` column set to `0` (§0.9)
- [ ] `TemplateComponentKey` union in `client/src/components/galleryTemplate/types/index.ts` is ready to accept 8 new entries (agent can append incrementally)
- [ ] Each per-template agent is aware they must add a hand-crafted miniature preview to `MorePreviews.tsx` + wire it into `TemplatePreview.tsx` (§0.8)

---

## 1. Template Catalogue (overview)

The 8 templates, with proposed slugs, component keys, tier, category, and source HTML tab IDs.

| # | Hebrew name | Source tab | Slug (kebab) | Component key (Pascal) | Tier | Proposed category |
|---|---|---|---|---|---|---|
| 1 | מכונת ההבטחות | `slot` | `slot-machine` | `SlotMachine` | **free** | `fun` |
| 2 | שק איגרוף | `punch` | `punching-bag` | `PunchingBag` | **free** | `fun` |
| 3 | חיפוש סליחה | `search` | `apology-search` | `ApologySearch` | **free** | `romantic` |
| 4 | כיבוי נרות | `birthday` | `birthday-candles` | `BirthdayCandles` | **premium** | `birthday` (new) |
| 5 | מכונת תירוצים | `excuse` | `excuse-generator` | `ExcuseGenerator` | **free** | `fun` |
| 6 | שבירת כוס | `wedding` | `wedding-glass` | `WeddingGlass` | **premium** | `wedding` (new) |
| 7 | מפעל החגים | `holiday` | `holiday-card` | `HolidayCard` | **premium** | `holidays` (new) |
| 8 | בר/בת מצווה | `mitzvah` | `bar-bat-mitzvah` | `BarBatMitzvah` | **premium** | `mitzvah` (new) |

Tier and category are **proposals** — see §10.1/§10.2.

---

## 2. Template #1 — Slot Machine (`slot-machine`)

**Prototype section:** `<div id="tab-slot">` plus JS block `--- 1. Slot Machine Logic ---`
**User interaction:** 3 reels spin on press; after the 3rd press, reels land on a fixed target message.

### 2.1 Data shape (`client/src/components/templates/types.ts`)

```ts
export interface SlotMachineData {
  title?: string;            // "מכונת ההבטחות"
  subtitle?: string;         // "סובבי 3 פעמים כדי לגלות..."
  // Options shown while spinning (animated randomly)
  reel1Options: string[];    // 2–8 labels
  reel2Options: string[];
  reel3Options: string[];
  // The locked message that lands on the final spin
  targetReel1: string;
  targetReel2: string;
  targetReel3: string;
  spinsRequired?: number;    // default 3, min 1, max 5
  spinButtonLabel?: string;  // "סובבי"
  successEmoji?: string;     // "🎉"
  primaryColor?: string;     // palette color
}
```

### 2.2 Files to create

```
client/src/components/templates/SlotMachine/
├── SlotMachine.tsx                    (responsive wrapper, ~30 lines)
├── Desktop/SlotMachineDesktop.tsx     (main layout, reels, button)
├── Mobile/SlotMachineMobile.tsx
├── types/index.ts
├── index.ts
└── components/
    └── Reel.tsx                       (single reel with spin animation)
```

### 2.3 Editor config entry (append to `EDITOR_CONFIGS` in `configs.ts`)

```ts
"slot-machine": {
  templateId: "slot-machine",
  title: "מכונת ההבטחות",
  description: "סובבו 3 גלגלים ותקבלו הודעה מוסתרת!",
  fields: [
    { key: "title",         label: "כותרת",           type: "text",     placeholder: "מכונת ההבטחות", maxLength: 60 },
    { key: "subtitle",      label: "כותרת משנה",       type: "text",     placeholder: "סובבי 3 פעמים..." },
    { key: "reel1Options",  label: "אפשרויות גלגל 1",  type: "options" },
    { key: "reel2Options",  label: "אפשרויות גלגל 2",  type: "options" },
    { key: "reel3Options",  label: "אפשרויות גלגל 3",  type: "options" },
    { key: "targetReel1",   label: "תוצאה סופית - גלגל 1", type: "text", maxLength: 40 },
    { key: "targetReel2",   label: "תוצאה סופית - גלגל 2", type: "text", maxLength: 40 },
    { key: "targetReel3",   label: "תוצאה סופית - גלגל 3", type: "text", maxLength: 40 },
    { key: "primaryColor",  label: "צבע ראשי",        type: "color" },
  ],
  defaultData: {
    title: "מכונת ההבטחות",
    subtitle: "סובבי 3 פעמים כדי לגלות מה מחכה לך הערב...",
    reel1Options: ["אני מבטיח", "מחר בבוקר", "תקשיבי לי טוב", "אין מצב ש"],
    reel2Options: ["לשטוף את", "להזמין לנו", "לפנק אותך ב", "לעשות היום"],
    reel3Options: ["כל הכלים.", "פיצה ענקית.", "מסאז' ברגליים.", "מרתון סרטים."],
    targetReel1: "אני מבטיח",
    targetReel2: "להזמין לנו",
    targetReel3: "פיצה ענקית.",
    primaryColor: "#d4826f",
  },
}
```

### 2.4 Gallery entry (append to `TEMPLATES` in `galleryTemplate/data/templates.ts`)

```ts
{
  id: "slot-machine",
  title: "מכונת ההבטחות",
  description: "סובבו את הגלגלים וגלו הבטחה מתוקה!",
  category: "fun",
  isFree: true,
  componentKey: "SlotMachine",
  link: "/create/slot-machine",
  badge: { type: "free", color: "#22c55e" },
}
```

Also add to `PREVIEW_DATA.SlotMachine` and `TEMPLATE_INFO_TEXT["slot-machine"]`.

**Miniature preview:** add `SlotMachinePreview` to `MorePreviews.tsx` (3 tiny reels with cycling Hebrew labels via `motion.div` translateY loop + a pulsing "סובבי" button) and wire it into `TemplatePreview.tsx`'s switch. See §0.8.

### 2.5 DB migration row

```sql
-- Column order: slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses
(
  'slot-machine', 'מכונת ההבטחות', ARRAY['משחקים'], 'new', false,
  '{
    "fields": [
      { "key": "title",         "type": "text",  "label": "כותרת",          "maxLength": 60 },
      { "key": "subtitle",      "type": "text",  "label": "כותרת משנה",     "maxLength": 120 },
      { "key": "reel1Options",  "type": "array", "label": "אפשרויות גלגל 1", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "reel2Options",  "type": "array", "label": "אפשרויות גלגל 2", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "reel3Options",  "type": "array", "label": "אפשרויות גלגל 3", "minItems": 2, "maxItems": 8, "itemType": "text", "required": true },
      { "key": "targetReel1",   "type": "text",  "label": "תוצאה סופית 1",  "maxLength": 40, "required": true },
      { "key": "targetReel2",   "type": "text",  "label": "תוצאה סופית 2",  "maxLength": 40, "required": true },
      { "key": "targetReel3",   "type": "text",  "label": "תוצאה סופית 3",  "maxLength": 40, "required": true },
      { "key": "primaryColor",  "type": "color", "label": "צבע ראשי",       "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 14}'::jsonb,
  0
)
```

### 2.6 Acceptance criteria

- [ ] 3 reels render with default labels `לחצי / כדי / לגלות` (initial state)
- [ ] Each click of the primary button spins all 3 reels concurrently for ~1.5s (random labels from each reel's `<reelN>Options` array)
- [ ] Counter shown in button ("סובבי (X נותרו)") updates
- [ ] On final spin (`spinsRequired`-th press), reels lock onto `targetReel1/2/3`
- [ ] Success state: button turns green + label = success emoji + text; reels remain visible
- [ ] `primaryColor` controls button background
- [ ] Responsive: reels shrink from `w-40 h-40` (desktop) to `w-24 h-24` (mobile), per prototype
- [ ] Includes `BackToGallery` top-right and `FooterBranding` at bottom

---

## 3. Template #2 — Punching Bag (`punching-bag`)

**Prototype section:** `<div id="tab-punch">` + JS `--- 2. Punching Bag Logic ---`
**User interaction:** Click the bag N times → reveal apology message.

### 3.1 Data shape

```ts
export interface PunchingBagData {
  introTitle?: string;         // "מערכת לשחרור לחצים"
  introSubtitle?: string;      // "תני לזה כמה מכות טובות..."
  hitsRequired?: number;       // default 5, min 1, max 20
  hitInstructions?: string;    // "הקישי על השק כדי להרביץ"
  resultTitle?: string;        // "אאוץ׳... זה שחרר?"
  resultMessage: string;       // "מקווה שהוצאת את העצבים..."
  bagColor?: string;           // palette color (bag fill)
  primaryColor?: string;
}
```

### 3.2 Files

```
client/src/components/templates/PunchingBag/
├── PunchingBag.tsx
├── Desktop/PunchingBagDesktop.tsx
├── Mobile/PunchingBagMobile.tsx
├── types/index.ts
└── index.ts
```

### 3.3 Editor fields

`introTitle`, `introSubtitle`, `hitsRequired` (number), `hitInstructions`, `resultTitle`, `resultMessage` (textarea), `bagColor` (color), `primaryColor` (color).

### 3.4 Gallery entry

Category: `fun`. Free tier. Badge: `new`.

### 3.5 Acceptance criteria

- [ ] Bag hangs from a visible rope (thin vertical grey line, as in prototype)
- [ ] Counter inside the bag shows `hitsRequired - hits` (starts at full, counts down to 0)
- [ ] Each click triggers a brief tilt animation (port `@keyframes punch` → `framer-motion` spring)
- [ ] When counter reaches 0, cross-fade to the result card (heart icon + `resultTitle` + `resultMessage` + "try again" link)
- [ ] "Try again" resets counter and hides result
- [ ] `bagColor` controls the fill of the bag

---

## 4. Template #3 — Apology Search (`apology-search`)

**Prototype section:** `<div id="tab-search">` + JS `--- 3. Search Logic ---`
**User interaction:** Simulates a Google search — typewriter effect types the query, then shows a result card.

### 4.1 Data shape

```ts
export interface ApologySearchData {
  searchQuery: string;         // "איך לבקש סליחה מהבן זוג שלי?"
  resultTitle: string;         // "סליחה שהייתי עצבנית"
  resultSubtitle?: string;     // "אתה צודק. אוהבת אותך."
  startButtonLabel?: string;   // "התחל חיפוש"
  typingSpeedMs?: number;      // default 80
  primaryColor?: string;
}
```

### 4.2 Files

```
client/src/components/templates/ApologySearch/
├── ApologySearch.tsx
├── Desktop/ApologySearchDesktop.tsx
├── Mobile/ApologySearchMobile.tsx
├── types/index.ts
└── index.ts
```

### 4.3 Editor fields

`searchQuery` (text, max 150), `resultTitle` (text, max 80), `resultSubtitle` (textarea, max 200), `startButtonLabel` (text, max 40), `primaryColor` (color).

**Note on Google logo:** The prototype uses `https://upload.wikimedia.org/...Google_2015_logo.svg`. Replace with a self-hosted neutral "magnifying glass" icon (`<Search />` from `lucide-react`) to avoid third-party hotlinking and trademark issues. **Confirm with product — see §10.4.**

### 4.4 Acceptance criteria

- [ ] Initial state: search bar (empty) + "start" button
- [ ] Clicking start: typewriter animates `searchQuery` into the bar, character-by-character at `typingSpeedMs`
- [ ] After typing: 3 bouncing dots appear for ~2s (loading simulation)
- [ ] Result card fades in with `resultTitle` + `resultSubtitle`
- [ ] "Search again" link resets to initial state
- [ ] Free tier, category `romantic`

---

## 5. Template #4 — Birthday Candles (`birthday-candles`)

**Prototype section:** `<div id="tab-birthday">` + JS `--- 4. Birthday Logic ---`
**User interaction:** Click each candle to extinguish. All out → birthday message appears.

### 5.1 Data shape

```ts
export interface BirthdayCandlesData {
  title?: string;              // "מערכת כיבוי נרות דיגיטלית"
  subtitle?: string;           // "הקישי על הלהבות..."
  candleCount: number;         // default 3, min 1, max 10
  cakeColor?: string;          // palette color
  flameColor?: string;         // palette color
  celebrationTitle: string;    // "מזל טוב!!! 🎂"
  celebrationMessage: string;  // "שתמיד תהיי מוקפת באהבה..."
  primaryColor?: string;
}
```

### 5.2 Files

```
client/src/components/templates/BirthdayCandles/
├── BirthdayCandles.tsx
├── Desktop/BirthdayCandlesDesktop.tsx
├── Mobile/BirthdayCandlesMobile.tsx
├── components/Candle.tsx        (reusable flame SVG + stick)
├── types/index.ts
└── index.ts
```

### 5.3 Editor fields

`title` (text), `subtitle` (text), `candleCount` (number, 1-10), `cakeColor` (color), `flameColor` (color), `celebrationTitle` (text), `celebrationMessage` (textarea), `primaryColor` (color).

### 5.4 Acceptance criteria

- [ ] Cake base renders with `candleCount` candles lined up on top
- [ ] Each candle has a flickering flame (animate-pulse)
- [ ] Clicking a flame fades it out (`opacity-100` → `opacity-0`)
- [ ] When all candles are out, `celebrationTitle` + `celebrationMessage` fade/slide in
- [ ] "Relight" button resets all candles and hides message
- [ ] Premium tier (has personalization of candle count + cake colour)
- [ ] Category: `birthday` (new) — see §10.1

---

## 6. Template #5 — Excuse Generator (`excuse-generator`)

**Prototype section:** `<div id="tab-excuse">` + JS `--- 5. Excuse Logic ---`
**User interaction:** Press button → random excuse from pool is displayed, with a rapid cycling animation.

### 6.1 Data shape

```ts
export interface ExcuseGeneratorData {
  title?: string;              // "מכונת התירוצים האוטומטית"
  subtitle?: string;           // "לא בא לך לצאת?..."
  excuses: string[];           // pool of 3–20 excuse strings
  buttonLabel?: string;        // "ג'נרט תירוץ"
  disclaimer?: string;         // "* החברה אינה אחראית..."
  primaryColor?: string;
}
```

### 6.2 Files

```
client/src/components/templates/ExcuseGenerator/
├── ExcuseGenerator.tsx
├── Desktop/ExcuseGeneratorDesktop.tsx
├── Mobile/ExcuseGeneratorMobile.tsx
├── types/index.ts
└── index.ts
```

### 6.3 Editor fields

`title` (text), `subtitle` (text), `excuses` (**options** — reuse `OptionsEditor`), `buttonLabel` (text), `disclaimer` (textarea), `primaryColor` (color).

### 6.4 Acceptance criteria

- [ ] Animated cog icon (spinning wheel) appears in header
- [ ] Card shows placeholder text before first press
- [ ] Press button: icon starts spinning, text rapidly cycles through `excuses` (~10 iterations at 80ms each)
- [ ] Animation ends on a random final excuse (may repeat — no uniqueness guarantee)
- [ ] Button disabled while generating
- [ ] Free tier, category `fun`

---

## 7. Template #6 — Wedding Glass (`wedding-glass`)

**Prototype section:** `<div id="tab-wedding">` + JS `--- 6. Wedding Logic ---`
**User interaction:** Click button → groom's leg stomps, glass shatters, mazal tov message appears.

### 7.1 Data shape

```ts
export interface WeddingGlassData {
  title?: string;              // "שבירת כוס דיגיטלית"
  subtitle?: string;           // "לחצו על הכפתור..."
  stompButtonLabel?: string;   // "שבור את הכוס!"
  mazalTovTitle: string;       // "מזל טוב! 💍"
  mazalTovMessage: string;     // "שתזכו לבנות יחד..."
  primaryColor?: string;
}
```

### 7.2 Files

```
client/src/components/templates/WeddingGlass/
├── WeddingGlass.tsx
├── Desktop/WeddingGlassDesktop.tsx
├── Mobile/WeddingGlassMobile.tsx
├── components/
│   ├── GroomFigure.tsx     (SVG with animated leg, uses stomp keyframe)
│   ├── BrideFigure.tsx     (static SVG)
│   └── GlassWithShards.tsx
├── types/index.ts
└── index.ts
```

### 7.3 Editor fields

`title`, `subtitle`, `stompButtonLabel`, `mazalTovTitle`, `mazalTovMessage` (textarea), `primaryColor`.

### 7.4 Acceptance criteria

- [ ] Bride (right) and groom (left) SVG figures render as drawn in prototype
- [ ] Clicking button: groom's right leg animates stomp (`@keyframes stomp` ported to Framer Motion keyframe sequence)
- [ ] After ~1s, glass disappears and 4 shards animate outward (`@keyframes shatter-left/right/up`)
- [ ] Mazal tov message fades in below
- [ ] "Try again" resets all animations
- [ ] Premium tier, category `wedding` (new)

### 7.5 Notes on SVG assets

The bride and groom SVG markup in the prototype is ~100 lines each. Extract verbatim into dedicated `GroomFigure.tsx` / `BrideFigure.tsx` components. Replace inline style colours with Tailwind where the palette allows, otherwise keep as raw hex.

---

## 8. Template #7 — Holiday Card (`holiday-card`)

**Prototype section:** `<div id="tab-holiday">` + JS `--- 7. Holiday Logic ---`
**User interaction:** Sender selects a holiday + types a greeting → recipient sees the themed card. **This template has an editor-driven theme but a static recipient view.**

### 8.1 Data shape

```ts
export type HolidayKind = "rosh" | "hanukkah" | "purim" | "pesach";

export interface HolidayCardData {
  holidayKind: HolidayKind;    // select: one of 4
  customTitle?: string;        // optional override of preset title
  customGreeting?: string;     // the user's message
  primaryColor?: string;       // palette; overrides auto-theme accent
}
```

Preset metadata (title, icon, bg, border) lives **inside the component** — not user-editable.

### 8.2 Files

```
client/src/components/templates/HolidayCard/
├── HolidayCard.tsx
├── Desktop/HolidayCardDesktop.tsx
├── Mobile/HolidayCardMobile.tsx
├── constants/holidays.ts     (HOLIDAY_PRESETS record)
├── types/index.ts
└── index.ts
```

`constants/holidays.ts` example:

```ts
export const HOLIDAY_PRESETS: Record<HolidayKind, {
  icon: string;
  defaultTitle: string;
  defaultGreeting: string;
  bgColor: string;      // hardcoded — not from palette
  borderColor: string;
}> = {
  rosh:     { icon: "🍎", defaultTitle: "שנה טובה ומתוקה!", defaultGreeting: "שתהיה שנה מלאה בדבש.", bgColor: "#fff5f2", borderColor: "rgba(212,130,111,0.3)" },
  hanukkah: { icon: "🕎", defaultTitle: "חג אורים שמח!",  defaultGreeting: "שיהיה חג מלא באור וסופגניות.", bgColor: "#f0f4f8", borderColor: "rgba(65,90,119,0.3)" },
  purim:    { icon: "🎭", defaultTitle: "חג פורים שמח!",  defaultGreeting: "עד דלא ידע! חג שמח ומבדח.",   bgColor: "#f8f0f8", borderColor: "rgba(168,85,247,0.3)" },
  pesach:   { icon: "🍷", defaultTitle: "חג חירות שמח!",  defaultGreeting: "שנזכה לפרוח ולשמוח באביב.",   bgColor: "#fffaeb", borderColor: "rgba(234,179,8,0.3)" },
};
```

### 8.3 Editor fields

- `holidayKind` — **type: `"select"`** with options `[{value:"rosh",label:"ראש השנה"}, ...]`
- `customTitle` — text (max 60), placeholder = preset title
- `customGreeting` — textarea (max 300), placeholder = preset greeting
- `primaryColor` — color (palette)

### 8.4 Acceptance criteria

- [ ] Editor sidebar shows holiday dropdown → preset updates live in preview
- [ ] Preview card displays the preset icon (large), title (`customTitle` or preset), greeting (`customGreeting` or preset)
- [ ] Background + border use the preset theme (`bgColor`, `borderColor`)
- [ ] Decorative background icon (large + rotated + opacity 10%) shown bottom-right
- [ ] Premium tier, category `holidays` (new)

### 8.5 Extensibility note

Limit to the 4 Jewish holidays in scope. **Do not** add bar/bat mitzvah, birthday, or Israeli secular holidays here — they are separate templates (or out of scope).

---

## 9. Template #8 — Bar/Bat Mitzvah (`bar-bat-mitzvah`)

**Prototype section:** `<div id="tab-mitzvah">` + JS `--- 8. Bar/Bat Mitzvah Logic ---`
**User interaction:** Sender chooses `bar` or `bat` → recipient taps the ceremonial icon (crown for bat, Torah for bar) → blessing modal appears.

### 9.1 Data shape

```ts
export type MitzvahKind = "bar" | "bat";

export interface BarBatMitzvahData {
  kind: MitzvahKind;               // user selects in editor
  introTitle?: string;             // "מכונת ההתבגרות"
  introSubtitle?: string;          // "לחצו על הכתר / הספר..."
  blessingTitle: string;           // "הגיע הזמן לחגוג! 🎉"
  blessingMessage: string;         // "ברוכים הבאים לגיל הבגרות..."
  tapHintLabel?: string;           // "לחצו על הכתר" / "לחצו על הספר"
  primaryColor?: string;
}
```

### 9.2 Files

```
client/src/components/templates/BarBatMitzvah/
├── BarBatMitzvah.tsx
├── Desktop/BarBatMitzvahDesktop.tsx
├── Mobile/BarBatMitzvahMobile.tsx
├── components/
│   ├── BatFigure.tsx    (dress + crown SVG)
│   └── BarFigure.tsx    (boy + Torah + bimah SVG)
├── types/index.ts
└── index.ts
```

### 9.3 Editor fields

- `kind` — select: `["bar", "bat"]`
- `introTitle`, `introSubtitle`, `blessingTitle`, `blessingMessage` (textarea), `tapHintLabel`, `primaryColor` (color)

**Note:** The prototype shows a runtime toggle between bar and bat. In our product, the sender picks the kind at create-time; the recipient sees only one figure. **No toggle in the recipient view.**

### 9.4 Acceptance criteria

- [ ] If `kind === "bat"`: show dress SVG with crown on head; crown is clickable + has `animate-pulse`
- [ ] If `kind === "bar"`: show boy SVG standing next to bimah holding Torah; Torah is clickable + has `animate-pulse`
- [ ] Tap hint pill ("לחצו על ...") floats near the target
- [ ] Clicking the target: blessing modal fades in on top (opacity + scale)
- [ ] Modal has a close button → returns to figure view
- [ ] Premium tier, category `mitzvah` (new)

---

## 10. Open Questions & Required Decisions

These **block** or **scope** the implementation — please resolve before per-template agents start.

### 10.1 Gallery categories

Current tabs: `all / romantic / fun / memories / gifts`.

New templates proposed: `wedding`, `holidays`, `mitzvah`, `birthday`.

**Options:**
- **(A)** Add 4 new category tabs (`birthday`, `wedding`, `holidays`, `mitzvah`) → may clutter the gallery UI.
- **(B)** Add one broader tab like `celebrations` / `חגיגות` and categorise all four under it.
- **(C)** Map all four into the existing `gifts` bucket (loosely "celebration gifts").

**I need you to choose A, B, or C** (or propose D).

### 10.2 Tier assignments (free vs premium)

My proposal (in §1 table):
- **Free:** slot-machine, punching-bag, apology-search, excuse-generator
- **Premium:** birthday-candles, wedding-glass, holiday-card, bar-bat-mitzvah

Rationale: the premium set is the more "life-event" heavy, ceremonial content; the free set is lighter/humorous.

**Confirm the split, or re-assign as you prefer.** (DB column `is_premium` + gallery `isPremium` badge both depend on this.)

### 10.3 Custom list editors

Several templates need structured array editing that no existing editor covers:

- **Slot Machine** — 3 separate `options` fields + 3 single `text` fields. The plan currently uses 6 form fields. Is that acceptable, or would you prefer a single "Slot Configuration" combined editor?
- **Excuse Generator** — reuses existing `OptionsEditor` for `excuses: string[]`. ✓ no decision needed.
- **Holiday Card** — presets are hardcoded in `constants/holidays.ts`, not editable. Confirm that's OK (vs. letting the user edit the preset titles/greetings in the editor).

### 10.4 Third-party assets / trademarks

- Prototype #3 (`apology-search`) embeds the **Google logo** via Wikimedia. Using a real Google logo in a commercial greeting-card product is a trademark risk. **My recommendation:** replace with a generic search-bar look (magnifying glass icon + "Search…" placeholder, no branded logo). Please confirm.

### 10.5 Expiration policy

All existing templates use `{"free_days": 1, "paid_days": 14}`. Should the 8 new templates follow the same policy, or do any of them (e.g., birthday, wedding) warrant longer retention (e.g., `{"free_days": 7, "paid_days": 30}`)?

### 10.6 Mobile viewport constraints

The prototype is built in a 2-column desktop-ish layout (`max-w-2xl`). Several templates have fixed-width SVG illustrations (wedding figures ~350px wide, mitzvah figures ~250px). Mobile (viewport min 360px) may need either scaling-down via `transform: scale()` or per-breakpoint SVG viewBox adjustments.

**Decision needed:** do you have any existing mobile-layout spec I should follow, or is "stretch to fit container" acceptable for these SVG-heavy templates?

### 10.7 Sound effects

The prototype has no audio. Confirm **no audio** is in scope (avoids browser autoplay issues anyway). If audio *is* wanted (glass shatter, candle blow, slot machine click), that needs separate approval for asset sourcing + licensing.

### 10.8 Analytics events

Existing templates don't emit per-interaction GTM events (only `view_template` on page load). Should the new templates emit custom events like `slot_machine_won`, `wedding_glass_broken`, `birthday_all_candles_blown`? If yes, please specify event names + properties; otherwise I'll match existing behaviour.

### 10.9 Tests

The project uses Vitest + Testing Library. Existing templates have **no unit tests** in the repo (I did a quick scan — none found). Confirm that new templates do not need tests, or specify required coverage (e.g., smoke-test render with default data).

### 10.10 Migration strategy (RESOLVED)

**Decision:** Individual migration file per template, named `supabase/migrations/YYYYMMDD_add_<template_slug>.sql`.

Rationale: per-template files allow deploying templates independently to production without touching unrelated rows. Each file has a single `INSERT … ON CONFLICT (slug) DO NOTHING` plus a rollback comment. See updated §0.7.

---

## 11. Per-Agent Execution Prompt Template

Copy-paste this when dispatching an agent for a specific template. Fill in the `{…}` placeholders. The agent should also read this plan file and the source HTML.

> **Task:** Implement HeartNote template `#{n}` — `{slug}` (Hebrew: `{hebrew_name}`).
>
> **Prerequisites:** Section 0 of `templates_integration_plan.md` must be complete. `EditorFieldType` union includes `"number"`. Gallery categories are decided (see plan §10.1). The migration skeleton file `supabase/migrations/20260417_add_april_templates.sql` exists.
>
> **Read first:**
> 1. `templates_integration_plan.md` — especially §{section_number} for this template.
> 2. `framesApril.html` — HTML section `<div id="tab-{html_id}">` and JS block `--- {n}. {title} Logic ---`.
> 3. One existing template as reference: `client/src/components/templates/DateInvite/` (has Desktop+Mobile split + responsive wrapper + BackToGallery + FooterBranding).
>
> **Deliverables (follow the 6-layer checklist):**
> 1. Add `{Name}Data` to `client/src/components/templates/types.ts`.
> 2. Create `client/src/components/templates/{Name}/` with `{Name}.tsx` (responsive wrapper), `Desktop/{Name}Desktop.tsx`, `Mobile/{Name}Mobile.tsx`, `index.ts`, and supporting files per the plan.
> 3. Register in `client/src/components/templates/registry.ts` and re-export from `client/src/components/templates/index.ts`.
> 4. Add editor config to `client/src/components/editor/configs.ts` — key `{slug}`.
> 5. Add gallery entry to `client/src/components/galleryTemplate/data/templates.ts` (both `TEMPLATES` and `PREVIEW_DATA` and `TEMPLATE_INFO_TEXT`); extend `TemplateComponentKey` union in `.../types/index.ts`. **Also** create a hand-crafted miniature preview component in `.../components/MorePreviews.tsx` — extract the dominant visual from the matching `<div id="tab-{html_id}">` in `framesApril.html` — and add a `case "<ComponentKey>": return <...Preview />;` branch to `.../components/TemplatePreview.tsx` (§0.8). The gallery card must not fall back to `LivePreview`.
> 6. Create a new migration file `supabase/migrations/YYYYMMDD_add_{slug}.sql` with a single `INSERT INTO public.templates (..., uses) VALUES (..., 0) ON CONFLICT (slug) DO NOTHING` plus a rollback comment. The `uses` column **must** be set to `0` explicitly (see §0.9). Do **not** append to any shared migration file.
>
> **Rules:**
> - Port every `@keyframes` animation in the HTML to `framer-motion` — no raw CSS keyframes.
> - Only palette colours (`client/src/constants/colors.ts`) for `color` fields; hard-coded neutrals allowed inside the component.
> - Include `<BackToGallery />` and `<FooterBranding />` in both Desktop and Mobile layouts.
> - Hebrew/RTL: text classes `text-hebrew-heading` / `text-hebrew-body`; no `dir` attributes needed (inherited from root).
> - Do NOT touch the other 7 templates' files. Append-only in shared files (types.ts, registry.ts, configs.ts, gallery templates.ts).
> - Run `npm run type-check` and `npm run lint` before declaring the task done.
>
> **Acceptance test:** After implementation, navigate to `/create/{slug}` — the editor should load with default data and a live preview. After saving, the public `/p/{creation-id}` link should render the same template correctly.

---

## 12. Execution Order Summary

```
┌────────────────────────────┐
│  §0 Foundation (1 agent)   │  ← resolve §10 blockers first
└─────────────┬──────────────┘
              │
              ├─ §2 SlotMachine (1 agent)        ┐
              ├─ §3 PunchingBag (1 agent)        │
              ├─ §4 ApologySearch (1 agent)      │  parallelisable
              ├─ §5 BirthdayCandles (1 agent)    │  (no cross-deps
              ├─ §6 ExcuseGenerator (1 agent)    │   once §0 is done)
              ├─ §7 WeddingGlass (1 agent)       │
              ├─ §8 HolidayCard (1 agent)        │
              └─ §9 BarBatMitzvah (1 agent)      ┘
                      │
                      ▼
              ┌───────────────────────────┐
              │  Final QA agent (1)       │
              │  • type-check + lint pass │
              │  • migration dry-run      │
              │  • manual smoke on each   │
              │    /create/<slug> page    │
              │  • /p/<id> rendering for  │
              │    a creation per template│
              └───────────────────────────┘
```

**Estimated effort:** §0 ≈ 1–2h (mostly decisions, small code). Each per-template agent ≈ 2–4h depending on SVG complexity (wedding + mitzvah are on the high end). Final QA ≈ 1h.

---

## 13. What I Need From You Before Starting

**Please answer all 10 questions in §10** (or mark "defer to your judgement" where you're OK with my recommendations). The tightest blockers are:

1. **§10.1** — Gallery category decision (A/B/C)
2. **§10.2** — Tier split approval or revision
3. **§10.4** — Google logo handling for `apology-search`
4. **§10.5** — Expiration policy (same as existing vs. longer for wedding/birthday)

Once those four are resolved, I can dispatch §0 immediately and queue the 8 per-template agents in parallel.
