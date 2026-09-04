# Template Enhancement Proposal — All 21 Templates

Read-only investigation, 2026-09-04. No code was modified.

Paths are relative to `client/` unless prefixed `../`. Usage/complexity numbers are **cited from** `../.claude/plans/pricing-model-research.md` §4 (prod `templates.uses` snapshot) and are not re-derived here.

Stack note: backend is Prisma + plain Postgres (`prisma/schema.prisma`, `../db/schema.sql`). `../supabase/migrations/` is historical only.

## Hard constraint honoured throughout

Every proposal below is **additive**: it adds a layer, a field, a timing beat, or a style token. No proposal merges templates, swaps one template's mechanism for another's, or standardises interaction logic. Where an idea would change what a template fundamentally *is*, it is filed under §5 (New template concepts), not §2. Where I could not confirm from the code that an idea leaves the core interaction file untouched, it is explicitly flagged **RISK**.

---

# 1. Full template audit

## 1.0 Architecture facts that apply to all 21

| Fact | Evidence |
|---|---|
| Every template is a Desktop/Mobile pair behind a `useMediaQuery("(max-width: 768px)")` wrapper | e.g. `src/components/templates/DateInvite/DateInvite.tsx:18`, `ScratchCard/ScratchCard.tsx:15`, `WeddingGlassInteractive/WeddingGlassInteractive.tsx:12` |
| Most wrappers gate on `mounted` and return `null` during SSR → blank frame on first paint | `DateInvite.tsx:75`, `ScratchCard.tsx:23`, `SlotMachine.tsx:92`, `Timeline.tsx:23`, `ApologySearch.tsx:54`, `PunchingBag.tsx:52`, `BarBatMitzvah.tsx:58`, `WeddingGlassInteractive.tsx:16`, `HolidayHanukkahInteractive.tsx:16` (and the 5 sibling holidays). `DecisionWheel.tsx` and `RelationshipQuiz.tsx` and `LoveCoupons.tsx` do **not** gate, so they hydrate-flash instead |
| Recipient page renders the template immediately, then a share row, then the full site `Footer` | `src/app/[locale]/(public)/p/[slug]/client.tsx:59-96` |
| Loading state everywhere is a generic bordered spinner | `src/components/templates/TemplateRenderer.tsx:50-59` (`animate-spin` ring + `t("common.loading")`), same pattern in `editor/Mobile/EditorMobile.tsx:47` and `editor/components/CreationConfirmModal.tsx:101` |
| `FooterBranding` renders unconditionally in every template, paid or not | `src/components/templates/components/FooterBranding.tsx`, called from every Desktop/Mobile file and from `shared/InteractiveShell.tsx:36`. Confirms §1.4 of the pricing report |
| Confetti is the only celebration primitive; `canvas-confetti@1.9.4` | `package.json:21`; used in `DateInvite.tsx:39-50`, `ScratchCard/{Mobile,Desktop}`, `SurpriseGift/Mobile:52-56`, `DecisionWheel/components/useWheelAnimation.ts:47-52` |
| **No audio exists anywhere in the product** | `grep -i "<audio\|new Audio(\|howler\|use-sound\|\.mp3\|\.wav\|AudioContext\|navigator.vibrate"` over `src/` → **0 matches**. `package.json` has no audio dependency. `public/` contains only `assets/` — no audio files |
| **No haptics** either — `navigator.vibrate` appears nowhere (same grep) | as above |
| AI assist exists on exactly 3 fields | `src/lib/validations/ai.ts:12-16` allowlist; surfaced as `aiAssist: true` in `editor/configs/romance.ts:29` (scratch-card.prizeContent), `configs/interactions.ts:14` (surprise-gift.greeting), `configs/interactive-events.ts:43` (birthday-candles.message). Rendered by `editor/components/TextEditorFields.tsx:39-45` → `AiAssistButton.tsx` |
| Motion tokens **exist but templates ignore them** | `src/styles/tokens/type.ts:56-65` defines `out-quint`/`out-expo` easing and `fast/base/slow` durations, wired into `tailwind.config.ts:33-34`. Zero template Framer transitions reference them; every file inlines its own `duration`/`ease` |
| Brand colour is forked three ways | tokens `brand.500 = #D85A30` (`src/styles/tokens/palette.ts:13`); `DEFAULT_PRIMARY_COLOR = "#d4826f"` (`src/components/templates/types.ts:10`) used as every template's default; `salmon.500 = #C47A5A` (`palette.ts:25`). `CLAUDE.md` says `#D85A30` is the brand colour — no template uses it |
| Editor inputs are 15px on mobile → **iOS Safari auto-zoom on focus** | `editor/components/EditorField.tsx:33-36` `baseInputClass` sets no font-size, so it inherits body 14px; `AiAssistButton.tsx:72` explicitly sets `text-body-sm` = `0.9375rem` = 15px (`styles/tokens/type.ts:17`). Both are < 16px. Affects **every** template's editor, not one |
| `position: fixed` inside a Framer transform context — one instance, already handled | `BarBatMitzvah/components/CandyBurst.tsx:93` is `fixed`, and `BarBatMitzvah/Mobile/BarBatMitzvahMobile.tsx:47-48` deliberately hoists it above the `motion.div`. Modals (`LoveCoupons/components/CouponRedeemModal.tsx:73`, `OpenWhen/components/LetterModal.tsx:56`) use `createPortal(..., document.body)`, which is also safe. **No unhandled instances found** |
| Dead code | `shared/GreetingReveal.tsx` is exported (`shared/index.ts`) but rendered by nothing (grep for `GreetingReveal` returns only its own definition). It also contains a probable text bug at line 32: `` `?${data.recipientName}` `` renders a bare `?` before the name |
| Palette doc drift | `src/constants/colors.ts:19` comment says "13 approved colors"; the array holds 12 |

## 1.1 Audit table

Complexity/Uses columns cite `../.claude/plans/pricing-model-research.md` §4. "Polish gap" is my subjective judgement (concept ambition minus execution).

| Slug | Recipient does… | Motion tech | Uses | Visual polish | Worst flow beat | RTL | Mobile risk |
|---|---|---|---|---|---|---|---|
| date-invite | Taps "yes"; "no" runs away | FM spring + confetti ×2 | 27 | Good | Yes/No labels not editable | OK | Low |
| scratch-card | Drags across an 8×8 tile grid until 60% cleared | FM per-tile opacity + confetti | 20 | Mid — grey tiles are hardcoded flat grey | Threshold is invisible | **`dir="ltr"` on Hebrew text** | Low |
| decision-wheel | Presses the hub, wheel spins 4s | Canvas 2D + `useMotionValue`/`animate` + confetti | 6 | Good | Spin lands, then nothing | OK | Low |
| surprise-gift | Taps a gift box N times until the lid flies | FM spring lid + staged confetti | 6 | Good | 5 taps with no progress feedback | OK | Low |
| punching-bag | Taps a hanging bag N times | FM rotate keyframes + CSS glove | 0 | Weak — glove is 3 divs | Countdown only; no impact payoff | **glove internals hardcoded LTR** | Low |
| excuse-generator | Presses a button, text slot-rolls | `useAnimationControls` cog + `setInterval` | 0 | Mid — plain bordered box | Roll always 11 ticks, no suspense curve | OK | Low |
| slot-machine | Presses spin N times; reels settle on a target | FM scale jitter + `AnimatePresence` per reel | 1 | Mid — hardcoded greys break dark mode | 3 reels stop simultaneously | OK | Low |
| apology-search | Presses start; a query types itself, then a result | FM caret blink + bouncing dots | 0 | Mid | Fixed 2000 ms fake "search" | OK | Low |
| relationship-quiz | Answers N questions, gets a % score | FM slide per question + progress bar | 4 | Good | Score screen is emoji-heavy | **`x: ±50` slide is LTR-fixed** | Low |
| timeline | Scrolls a vertical dashed timeline | FM staggered entrance | 6 | Mid — 9–10px type on mobile | Static; nothing to *do* | **`x: -15` entrance is LTR-fixed** | 9px text |
| birthday-candles-interactive | Taps each flame out, then a greeting appears | FM flicker + `AnimatePresence` + `next/image` cake | 0 | Good | 800 ms gap after last candle | OK | absolute-positioned candle row vs cake SVG |
| holiday-rosh-hashanah | Taps once; 4-frame honey sequence, then greeting | `FrameSequenceScene` cross-fade | 0 | Good | One tap = whole show | OK | **frame filenames contain a space** |
| holiday-passover | Taps once; two matzah halves split apart | bespoke `HolidayAssetLayer` transforms | 0 | Good | as above | left/right are symmetric — fine | — |
| holiday-purim | Taps once; 3-frame mask sequence | `FrameSequenceScene` | 0 | Good | as above | OK | — |
| holiday-shavuot | Taps once; 3-frame bloom sequence | `FrameSequenceScene` | 0 | Good | as above | OK | — |
| holiday-sukkot | Taps once; 3-frame sukkah sequence | `FrameSequenceScene` | 0 | Good | as above | OK | — |
| holiday-hanukkah | Taps once; 4-frame candle sequence | `FrameSequenceScene` | 0 | Good | as above | OK | — |
| love-coupons | Redeems ticket coupons, optionally with a 4-digit code | FM stagger + stamp overlay + portal modal | 8 | Strong | Redeem is irreversible with a thin confirm | **`x: -20` entrance LTR-fixed** | Low |
| open-when | Opens date-locked envelopes into a letter modal | Layered SVG + FM hover lift + portal modal | 3 | Strongest in the set | Locked envelopes give no countdown | OK | Low |
| bar-bat-mitzvah | Taps the figure; candy rains; blessing appears | 40 hand-rolled FM particles | — | Good | 600 ms hard timeout, no anticipation | OK | 40 concurrent FM nodes |
| wedding-glass-interactive | Presses; 3-frame glass-break, then blessing | FM cross-fade over 3 SVGs | 0 | Good | 1.9 s of nothing after the tap | OK | — |

## 1.2 Per-template detail

### date-invite — `templates/DateInvite/` (27 uses, 450 LOC + confetti)
- **Mechanism**: "Yes" commits; "No" teleports away on hover/touch. `DateInvite.tsx:58-64` randomises `noPosition` within ±100/60 px on mobile, ±180/100 px on desktop.
- **Motion**: FM spring `stiffness 800 / damping 15 / mass 0.4` on the No button (`Mobile/DateInviteMobile.tsx:108-113`); dual confetti bursts at x 0.3/0.7 (`DateInvite.tsx:39-50`); infinite 💌 pulse (`Mobile:65-71`).
- **Visual**: clean centred card on `bg-surface-raised rounded-card shadow-card`. Emoji (💌, 💖) carry the entire iconography — the most-used template's identity rests on two system emoji. Custom `primaryColor` drives the CTA, the title and a `${primaryColor}30` glow, which is the nicest colour usage in the set.
- **Editor flow** (`editor/configs/romance.ts:4-22`): title → question → successMessage → primaryColor. **`yesText` and `noText` are in `defaultData` (lines 17-18) but are not editable fields** — the sender cannot change the two buttons the whole joke rests on.
- **Recipient flow**: card fades/scales in over 0.4 s → question → two buttons → tap Yes → `DateInviteSuccess.tsx` swaps in with a 0.3 s scale and a wobbling 💖 + reset button. Undercut: the reset button ("ask again") appears immediately, which invites the recipient to undo the emotional moment.
- **RTL**: clean — `dir="auto"` on every text node, no directional utilities.
- **Mobile**: `onTouchStart={onNoHover}` (`Mobile:114`) means the No button dodges *on first touch*, which on touch devices reads as a mis-tap rather than a joke.

### scratch-card — `templates/ScratchCard/` (20 uses, 502 LOC, has AI field)
- **Mechanism**: 64 tiles (`Mobile/ScratchCardMobile.tsx:33-35`); `elementFromPoint` during `touchmove` marks tiles scratched (`components/ScratchGrid.tsx:34-39`); at 60% the prize is revealed.
- **Motion**: per-tile opacity fade, 0.15 s touch / 0.2 s hover (`ScratchGrid.tsx:83`); a one-shot yellow gradient sheen on reveal (`ScratchGrid.tsx:97-104`); dual confetti.
- **Visual**: the weakest part is the scratch surface itself — a hardcoded `linear-gradient(135deg, #d1d5db, #e5e7eb, #9ca3af)` (`ScratchGrid.tsx:90`) that reads as "grey placeholder", not foil. It also ignores the token system entirely.
- **RTL bug**: `ScratchGrid.tsx:56` sets `dir="ltr"` on the congratulations line, which is Hebrew text (`t("scratchCard.congratulations")`). Punctuation and any embedded digits will render in the wrong order.
- **Editor flow** (`configs/romance.ts:23-37`): title → prizeContent (**AI-assisted**) → primaryColor. Three fields; the fastest editor in the product.
- **Recipient flow**: title → bordered ticket with badge → drag hint → scratch → reveal + confetti + "scratch again". No indication of *how much more* to scratch; the 60% threshold fires without warning.
- **Colour handling**: a dedicated black-primary special case (`Mobile:44,69-72`) — evidence the palette fights this template.

### decision-wheel — `templates/DecisionWheel/` (6 uses, 557 LOC)
- **Mechanism**: press the hub, 5–8 extra rotations land on a pre-picked segment (`components/useWheelAnimation.ts:26-40`).
- **Motion**: the best-tuned easing in the codebase — `ease: [0.15, 0.85, 0.25, 1]` over 4 s (`useWheelAnimation.ts:39-40`), which genuinely feels like a wheel decelerating. Canvas is DPR-scaled (`components/WheelCanvas.tsx:39-42`).
- **Visual**: canvas wheel + a CSS-triangle pointer with a `drop-shadow` (`WheelCanvas.tsx:51-59`). The spin button swaps its label for a bare 🎯 while spinning (`WheelCanvas.tsx:88`) — a one-emoji loading state.
- **Recipient flow**: title → subtitle (0.15 s delay) → wheel springs in (0.2 s delay) → press → 4 s spin → confetti + result text below. **The result text appears below the fold on mobile** (wheel is 280 px + pointer inside a `min-h-[100dvh]` centred column) and has no entrance emphasis beyond a 0.8→1 scale.
- No reset button on either layout — the recipient can re-press the hub, but nothing says so.
- **RTL**: `left-1/2 -translate-x-1/2` (`WheelCanvas.tsx:51,80`) is physical centring, correct in both directions.

### surprise-gift — `templates/SurpriseGift/` (6 uses, 475 LOC, has AI field)
- **Mechanism**: tap the box `clicksRequired` times (default 5, `Mobile/SurpriseGiftMobile.tsx:25`); each tap shakes it; the last opens it.
- **Motion**: 8-keyframe shake over 0.4 s (`Mobile:112-113`); lid spring `stiffness 300 / damping 12` (`components/GiftBox.tsx:20-26`); two confetti volleys 300 ms apart (`Mobile:52-57`); reveal spring `stiffness 180 / damping 14` with a 0.2 s delay (`components/SurpriseGiftReveal.tsx:36`).
- **Notable**: `Mobile:58` deliberately delays the reset button by 1500 ms so it doesn't step on the reveal — the single best pacing decision in the whole set, and the pattern worth copying.
- **Visual**: hand-authored SVG box (`GiftBox.tsx:41-89`) with body, ribbon, lid and a two-loop bow. Genuinely custom, not emoji. Box/ribbon colours are editable.
- **Editor flow** (`configs/interactions.ts:8-27`): title → greeting (**AI**) → boxColor → ribbonColor → primaryColor. `clicksRequired: 5` sits in `defaultData` (line 24) with **no editable field** — the sender can't shorten or lengthen the tease.
- **Flow gap**: no tap counter is shown. `aria-label` carries `{clicks, needed}` (`Mobile:117`) but sighted users see only a shake, so tap 2 of 5 feels identical to tap 4 of 5.
- **Dead branch**: `GiftBox.tsx:38` returns `null` when `isOpen`, so the `lidVariants.open` spring (lines 20-26) never plays — the lid vanishes rather than flying off. Confirmed: the parent unmounts the box via `AnimatePresence` (`Mobile:108-121`) at the same moment.

### punching-bag — `templates/PunchingBag/` (0 uses, 411 LOC)
- **Mechanism**: tap the bag `hitsRequired` times (3–10, selectable); a glove flies in each time; on the last hit a message replaces the bag.
- **Motion**: 6-keyframe tilt over 0.35 s (`Mobile/PunchingBagMobile.tsx:67-68`); glove spring `stiffness 500 / damping 15` shown for exactly 150 ms (`Mobile:26-30`); floating heart SVG on the result (`components/PunchingBagResult.tsx:32-51`).
- **Visual — the weakest in the set**: the boxing glove is three absolutely-positioned divs with `bg-red-500` / `bg-gray-800` and hardcoded radii (`Mobile:94-98`). It reads as a prototype. The bag itself is `w-24 h-36 rounded-[50px]` with a raw hex fill — a coloured lozenge.
- **RTL bug**: the glove wrapper correctly uses `-end-4` (`Mobile:92`), but its internals use `-left-2` (thumb) and `-right-3` (wrist, line 96-97). In RTL the wrapper flips and the thumb/wrist do not, so the glove renders inside-out. Same bug in `Desktop/PunchingBagDesktop.tsx:99-101`.
- **Flow**: the countdown number sits *inside* the bag at `text-white/60` (`Mobile:78`) — low contrast, and it counts down with no escalation. The 350 ms delay before `isDone` (`PunchingBag.tsx:36`) is the only anticipation beat.

### excuse-generator — `templates/ExcuseGenerator/` (0 uses, 330 LOC)
- **Mechanism**: press a button; the display cycles random excuses on an 80 ms interval for 11 ticks, then stops (`Mobile/ExcuseGeneratorMobile.tsx:36-46`).
- **Motion**: cog spins `360 × 6` over 1.1 s linear (`Mobile:33`); a flashing accent overlay at 0.16 s repeat (`Mobile:107-112`).
- **Visual**: an inline lucide-style cog path (`Mobile:66-79`) — a settings icon standing in for a machine. The excuse box is a plain `border-2 border-line rounded-card shadow-inner`. Nothing about it says "excuse machine".
- **Flow problem**: the roll is **uniform** — 11 ticks at a constant 80 ms, then an abrupt stop. There is no deceleration, so the result feels arbitrary rather than "landed". The cog is also `cogControls.stop()` + `set({rotate: 0})` (`Mobile:43-44`), i.e. it snaps back to zero instead of easing out.
- **Editor flow** (`configs/interactive-games.ts:46-72`): title → subtitle → excuses list (1–8) → buttonLabel → disclaimer → colour. Reasonable.

### slot-machine — `templates/SlotMachine/` (1 use, 392 LOC)
- **Mechanism**: press spin `spinsRequired` times (default 3, `SlotMachine.tsx:38`); each spin randomises 3 reels for 15×100 ms; the final spin forces `targetReel1/2/3`.
- **Motion**: reels scale-jitter on a 0.15 s infinite loop (`components/Reel.tsx:17-22`); text swaps via `AnimatePresence mode="wait"` at 0.06 s while spinning (`Reel.tsx:40`).
- **Visual bug**: `Reel.tsx:30-32` overrides the token classes with hardcoded `#e5e7eb` / `#f3f4f6` / `#f8f4f1`. The `className` above it already sets `bg-surface-sunken`, so the inline style wins and the reels stay light-grey in dark mode. This is the clearest token violation in the codebase.
- **Flow problem**: all three reels stop on the same tick (`SlotMachine.tsx:71-87`). Real slot tension comes from staggered stops; here the payoff arrives flat.
- **Editor flow** (`configs/interactive-games.ts:4-45`): title, subtitle, three option lists, three target values, colour — **9 fields, the longest editor in the product**, and the relationship between "reelNOptions" and "targetReelN" is not explained anywhere in the field labels. Highest abandonment risk of any editor.

### apology-search — `templates/ApologySearch/` (0 uses, 387 LOC)
- **Mechanism**: press start → the query types itself at `typingSpeedMs` (default 80 ms, `ApologySearch.tsx:19`) → a fixed 2000 ms "loading" → a result card.
- **Motion**: blinking caret (`Mobile/ApologySearchMobile.tsx:55-61`); three bouncing dots staggered 0.2 s (`Mobile:75-88`); floating heart on the result (`components/ApologySearchResult.tsx:25-43`).
- **Visual**: the search bar is a `rounded-pill border-2` with a lucide `Search` icon — a credible but generic search field. The joke depends on it resembling a real search engine, and it currently resembles a generic input.
- **Flow problem**: the 2000 ms wait (`ApologySearch.tsx:40`) is dead air with only three dots. That is a long time on a first open.
- `typingSpeedMs: 80` is in `defaultData` (`configs/romance.ts:54`) with no editable field.

### relationship-quiz — `templates/RelationshipQuiz/` (4 uses, 455 LOC, 6 motion files)
- **Mechanism**: N multiple-choice questions via `useQuiz`; immediate right/wrong colouring; a % score screen.
- **Motion**: question slide `x: 50 → 0 → -50` (`components/QuestionCard.tsx:33-35`); progress bar width tween 0.4 s with a diagonal stripe overlay (`components/QuizProgressBar.tsx:29-40`); score circle spring `stiffness 200 / damping 15` (`components/QuizResults.tsx:57-61`); 5 floating star emoji.
- **Best accessibility in the set**: `useReducedMotion` is honoured in `QuestionCard.tsx`, `OptionButton.tsx` and `QuizResults.tsx`.
- **RTL bug**: `QuestionCard.tsx:33-35` slides questions in from `x: +50` and out to `x: -50`. In Hebrew the reading direction is reversed, so questions advance *backwards*.
- **Visual**: the score screen (`QuizResults.tsx`) is the busiest surface in the product — 5 star emoji, a gradient ring circle, a yellow-on-yellow "final score" pill (`:63-68`), a feedback card, a subtitle, and a reset button. It fights itself.
- **Editor flow** (`configs/interactive.ts:4-56`): title + a `questions` array editor. `scoreMessages` exist in `defaultData` (lines 49-53) but **the score screen never reads them** — `QuizResults.tsx:33-34` uses 10 fixed translation tiers instead. The sender's custom score messages are silently discarded.

### timeline — `templates/Timeline/` (6 uses, 341 LOC)
- **Mechanism**: none. It is a read-only vertical list of dated events.
- **Motion**: staggered entrance `delay: index * 0.08` (`Mobile/TimelineMobile.tsx:71`), card scale-in.
- **Visual**: the dashed connector built from `repeating-linear-gradient` aligned to the icon centre (`Mobile:56-62`) is a nice touch. But mobile type is `text-xs` titles and **`text-[10px]` descriptions and `text-[9px]` date badges** (`Mobile:96,106,112`) — below anything in the type scale (`styles/tokens/type.ts` bottoms out at 13px `caption`). On a phone this is close to unreadable, and it is the one template a recipient is meant to *read* slowly.
- **RTL bug**: entrance is `x: -15` (`Mobile:69`) / `x: -20` (`Desktop/TimelineDesktop.tsx:61`) — fixed LTR, so events slide in from the wrong edge in Hebrew.
- **Editor flow** (`configs/relationships.ts:4-18`): title → events → colour. `defaultData.events` is `[]` (line 15), so a new sender lands on the empty state (`Mobile:122-126`) — a 📅 emoji and a line of text. **The most-used premium-adjacent template opens on an empty box.**

### birthday-candles-interactive — `templates/BirthdayCandlesInteractive/` (0 uses, 341 LOC, has AI field)
- **Mechanism**: `getBirthdayCandlePlan(recipientAge)` decides candle count and whether to show a numeral (`utils/candle-utils.ts`); tap each flame; when all are out, a greeting overlays after 800 ms (`components/BirthdayCandlesCore.tsx:35`).
- **Motion**: per-flame flicker `scale [1, 1.16, 0.94, 1.08, 1]` on a 1.4 s loop with `delay: index * 0.12` (`components/BirthdayFlame.tsx:37-40`) — the most convincing single animation in the product. Extinguish exit is `opacity 0, scale 0.2, y: -8` plus a `~` smoke glyph (`BirthdayFlame.tsx:39,55-62`). Cake floats on a 5 s `y: [0,-3,0]` (`Core:61-62`).
- **Uses the shared `InteractiveShell`** (title + instruction + branding), unlike the game templates.
- **Visual**: real `next/image` SVG cake asset. The smoke wisp is a literal `~` character (`BirthdayFlame.tsx:61`) — the one cheap detail.
- **Mobile risk**: the candle row is `absolute left-1/2 -translate-x-1/2` with `top: clamp(30px, 1%, 30px)` and a width computed as `Math.min(92, 32 + candleCount * 6)%` (`Core:71-72`). That is a fragile registration between an absolutely-positioned flex row and a responsive raster of the cake SVG; at high candle counts on narrow screens the candles will not sit on the cake.
- **Editor flow** (`configs/interactive-events.ts:39-45`): recipientName → senderName → greetingTitle → message (**AI**) → recipientAge. Age is last, but it is the field that changes the visual most — a preview-ordering mismatch.

### wedding-glass-interactive — `templates/WeddingGlassInteractive/` (0 uses, 204 LOC + shared)
- **Mechanism**: press once; three SVG frames cross-fade at 620/1240 ms; the blessing overlays at 1900 ms (`components/WeddingGlassCore.tsx:35-37`).
- **Motion**: frame cross-fade 0.56 s `easeInOut` with a subtle scale/y offset for inactive frames (`WeddingGlassCore.tsx:77-83`); the active frame dims to `opacity 0.62` and scales to `1.025` behind the overlay — a genuinely elegant depth cue.
- **Visual**: three authored SVGs, `InteractiveShell` chrome, reveal card matching the holiday/birthday family.
- **Flow problem**: **1.9 seconds of near-silence** between the tap and the blessing, with only two frame swaps to carry it. For the most emotionally loaded template in the catalogue this is the largest pacing gap in the product.
- **Editor flow** (`configs/interactive-events.ts:67-83`): coupleNames → senderName → greetingTitle → message. **No `aiAssist`, no colour field** — an event-critical template with less personalisation than scratch-card.

### bar-bat-mitzvah — `templates/BarBatMitzvah/` (513 LOC; absent from `../db/schema.sql` seed per pricing report §P11)
- **Mechanism**: tap the boy/girl figure (or the button); a 600 ms hard timeout then reveals the blessing while blurring the figure (`BarBatMitzvah.tsx:33-37`).
- **Motion**: 40 hand-rolled candy particles with per-particle wobble, drift, rotation up to ±1080°, staggered delays up to 1.2 s (`components/CandyBurst.tsx:53-73`) — a bespoke, better-looking effect than `canvas-confetti`. The figure blurs to 6 px and dims to 0.45 behind the card (`Mobile/BarBatMitzvahMobile.tsx:69-74`).
- **Visual**: hand-authored `BoyFigure` / `GirlFigure` SVGs; a hardcoded `CORAL = "#E28F79"` gradient on the CTA (`Mobile:23,128`) that is a **fourth** brand orange.
- **Mobile risk**: 40 simultaneously animating FM nodes, each `position: absolute` with a 3-keyframe x-path and a rotation (`CandyBurst.tsx:96-114`). On a mid-range Android this is the heaviest frame budget in the product. `canvas-confetti` would be cheaper but would lose the identity — so the answer is fewer, larger particles, not a swap.
- **Flow**: `setTimeout(600)` is a fixed delay unlinked to the particle timeline (which runs 2.5 s), so the blessing lands while candy is still falling. That is arguably good, but it is accidental rather than composed.
- **Editor flow** (`configs/special-occasions.ts:8-24`): kind → introTitle → introSubtitle → blessingTitle → blessingMessage → tapHintLabel → colour. `tapHintLabel` is defined and editable but I could not find it rendered in `BarBatMitzvahMobile.tsx` — **flagged as unverified**, it may be desktop-only.

### The six holiday templates — `templates/Holiday*Interactive/` + `templates/holidays-shared/` (0 uses each; 44 LOC each on a 656-LOC shared engine)

The shared engine is real and well-factored. Each `Holiday<X>Interactive.tsx` is a 22-line media-query wrapper; each Desktop/Mobile is a one-liner delegating to `HolidayInteractiveCard`.

- **Engine**: `holidays-shared/HolidayInteractiveCard.tsx` holds a 3-state machine (`idle → playing → revealed`), a `FRAME_COUNTS` map (`:18-24`) driving a 500 ms-per-frame timeline, and `reduceMotion` short-circuits (`:43-46`). `holidays-shared/holiday-config.ts` is the per-holiday catalogue — slug, message keys, accent colour, interaction name.
- **Scene routing**: `holidays-shared/HolidayScene.tsx:16-32` switches on `config.interaction`. Five of six use `scenes/FrameSequenceScene.tsx` (cross-faded `next/image` frames); **Passover is the one bespoke scene** (`scenes/PassoverScene.tsx`) — two matzah halves splitting apart with `origin-right` / `origin-left` and ±36 px translation. Passover is also absent from `FRAME_COUNTS`, so it takes the generic 1050 ms branch (`HolidayInteractiveCard.tsx:54-57`).
- **Per-holiday identity today is: an accent hex, a set of SVG frames, and three strings.** Accents: rosh-hashanah `#d4826f`, passover `#b7791f`, purim `#8b5cf6`, shavuot `#7ed957`, sukkot `#5f8f2f`, hanukkah `#38b6ff` (`holiday-config.ts`). Four of these six are straight from `COLOR_PALETTE` (`constants/colors.ts`), i.e. the *editor swatch* palette, not a holiday-specific palette.
- **Visual**: `HolidayCardFrame.tsx` gives a framed-card presentation (border, shadow, inner sunken well) that the game templates lack. It is the most "designed" chrome in the product.
- **Flow problem, all six**: the recipient taps once and watches. There is no participation. The reveal overlay (`HolidayRevealOverlay.tsx`) is identical across all six except the accent colour — so the *payoff* is where the six feel most alike, precisely where they should feel most different.
- **Editor flow**: all six share `COMMON_FIELDS` (`configs/interactive-events.ts:5-10`) — recipientName, senderName, greetingTitle, message. **No colour field and no `aiAssist`** on any holiday.
- **Asset risk**: `scenes/RoshHashanahScene.tsx:9-12` references `rh- 1.svg` … `rh- 4.svg` — filenames containing a literal space. This works through `next/image` URL encoding but is fragile against any CDN or asset-pipeline change. Flagged as a latent risk, not a current bug.

### love-coupons — `templates/LoveCoupons/` (8 uses, 623 LOC, has a redeem server action)
- **Mechanism**: ticket-shaped coupons; "redeem" opens a portal modal; if `verificationCode` is present the recipient must enter 4 digits (`components/CouponCodeInput.tsx`, `hooks/useCoupons`); success stamps the coupon.
- **Motion**: staggered entrance `delay: index * 0.1`; stamp overlay springs in at `rotate: -15 → -8` (`components/CouponCard.tsx:131-132`); modal spring `stiffness 300 / damping 30` (`components/CouponRedeemModal.tsx:90`).
- **Visual — the strongest craft in the product**: a real ticket silhouette with `rounded-s-card` body, a `PerforatedEdge` of 5 punched dots (`CouponCard.tsx:110-124`), a vertical `COUPON` stub using `writing-mode: vertical-rl` (`CouponCard.tsx:90-100`), and a grayscale + stamp treatment on redemption.
- **RTL**: mostly excellent — `rounded-s-card`/`rounded-e-card`, `start-4`, `text-end pe-2 ps-24` are all logical. Two issues: entrance is `x: -20` (`CouponCard.tsx:31`), LTR-fixed; and the redeem button sits at `absolute start-4` overlapping a `ps-24` text block, so a long Hebrew title will collide with the button before it wraps.
- **Flow problem**: redemption is **irreversible for the recipient** and the confirm modal is a thin two-button row (`CouponRedeemModal.tsx:121-142`) with the destructive action styled identically to a normal CTA. Reset exists but is gated to `isCreateRoute` (`Mobile/LoveCouponsMobile.tsx:65`) — i.e. the editor only.
- **Loading state**: `Loader2 animate-spin` + "redeeming…" (`CouponRedeemModal.tsx:139-140`) — a generic spinner on the most meaningful action in the product.

### open-when — `templates/OpenWhen/` (3 uses, 653 LOC, date-locked)
- **Mechanism**: a grid of envelopes; `isEnvelopeUnlocked(dateOpen)` gates each (`constants/index.ts`); unlocked ones open a portal letter modal.
- **Motion**: entrance `delay: index * 0.08`; `whileHover={{ y: -6, scale: 1.02 }}` on unlocked cards only (`components/EnvelopeCard.tsx:46`); heart-seal hover scale spring `stiffness 400 / damping 15` (`components/EnvelopeLayers.tsx:79-83`); modal spring from `scale 0.8, y 50`.
- **Visual — best in the product**: a true three-layer envelope. Back + back-flap triangle with its own gradient, a white card layer inset at 8%/2%/28%, front flaps as two SVG polygons with per-side gradients and hairline creases, a bottom rounded edge, and a radial-gradient wax heart seal with an inset highlight (`EnvelopeLayers.tsx:20-94`). Locked envelopes get `saturate(0.3) brightness(0.82)` (`EnvelopeCard.tsx:63`). The letter modal even uses a `repeating-linear-gradient` ruled-paper background offset by 24 px (`components/LetterModal.tsx:79-80`).
- **Flow problem**: a locked envelope shows a `Lock` icon and a bare date at `text-[9px]` (`EnvelopeCard.tsx:110-118`). The whole emotional premise is *anticipation*, and anticipation is rendered as 9px grey text.
- **Second flow problem**: the envelope never *opens*. It is a static open-envelope illustration; tapping it jumps straight to a modal. The single most obvious animation opportunity in the product is unclaimed.
- **Editor flow** (`configs/relationships.ts:38-65`): title → colour → envelopes (1–6). Both default envelopes get `dateOpen = today` (lines 53, 60), so a sender who doesn't change dates ships a card with zero locking — the feature silently defaults itself off.

---

# 2. Per-template enhancement proposals

All ideas are additive. "Touches" lists the files an implementation would edit. **Core-interaction files are named explicitly when a proposal does *not* touch them.**

Priority within each template: recipient-facing reveal first, editor second.

## date-invite
1. **Make Yes/No labels editable** — add two `text` fields to `editor/configs/romance.ts` (`yesText`, `noText`; the keys and defaults already exist at lines 17-18, and `Mobile/DateInviteMobile.tsx:94,117` already render `data.yesText`/`data.noText`). *Why here*: the joke is the two buttons; today every card ships identical ones. *Complexity*: small. *Touches*: `editor/configs/romance.ts` + two message keys. **Additive — zero template-file changes.**
2. **Dodge escalation** — increase the No button's jump radius with each dodge instead of a constant ±100/60. `DateInvite.tsx:58-64` already owns `noPosition` state; add a `dodgeCount` counter and multiply. *Why here*: the gag currently plateaus after one dodge. *Complexity*: small. *Touches*: `DateInvite.tsx` only (state layer, not the render). **Additive.**
3. **Delay the "ask again" reset by ~2 s**, copying the `showReset` pattern from `SurpriseGift/Mobile/SurpriseGiftMobile.tsx:58`. *Why here*: the reset currently invites undoing the yes. *Complexity*: small. *Touches*: `components/DateInviteSuccess.tsx`. **Additive.**
4. **Replace the 💌 emoji with a small authored SVG envelope-heart**, reusing the visual language of `OpenWhen/components/EnvelopeLayers.tsx`. *Why here*: it is the most-used template and its hero icon is a system emoji that renders differently per platform. *Complexity*: medium (new SVG component). *Touches*: new `DateInvite/components/InviteSeal.tsx` + one line each in Desktop/Mobile. **Additive** — the interaction files' logic is untouched, only the icon node is swapped. Subjective call; the emoji is arguably warmer.

## scratch-card
1. **Fix `dir="ltr"` on the congratulations line** (`components/ScratchGrid.tsx:56`) → `dir="auto"`. Correctness, not an enhancement. *Small.*
2. **Progressive reveal feedback** — as `scratchedBlocks.size / TOTAL_BLOCKS` climbs, raise the prize layer's opacity from ~0.15 to 1 instead of it being fully opaque under the tiles. *Why here*: the recipient currently scratches blind and the 60% threshold fires as a surprise; a rising ghost of the prize is the actual pleasure of a scratch card. *Complexity*: medium. *Touches*: `components/ScratchGrid.tsx` only. **Additive** — the `onScratch`/threshold logic in `Mobile/ScratchCardMobile.tsx:58-65` and `Desktop/` is untouched.
3. **Real foil surface** — replace the hardcoded `#d1d5db/#e5e7eb/#9ca3af` gradient (`ScratchGrid.tsx:90`) with a token-driven metallic gradient plus a slow `shimmer` sweep (the keyframe already exists at `styles/tokens/type.ts:88-91`). *Why here*: the whole template is a foil-scratch metaphor rendered in placeholder grey. *Complexity*: small. *Touches*: `ScratchGrid.tsx`. **Additive.**
4. **Scratch-dust particles** at the touch point — 3-4 short-lived FM specks per newly-cleared tile. *Why here*: gives the drag physical weight that pure opacity fade lacks. *Complexity*: medium; **RISK** — this needs a per-tile position, and `handleTouchMove` (`ScratchGrid.tsx:34-39`) currently discards coordinates after `elementFromPoint`. I cannot confirm this stays out of the interaction path; treat as the riskiest idea on this template.

## decision-wheel
1. **Result card instead of result text** — wrap the winner in a small elevated card with the accent border, and scroll it into view on mobile. *Why here*: after a 4-second build the payoff is two lines of text that may be below the fold (`components/WheelCanvas.tsx:93-104` inside a centred `min-h-[100dvh]` column). *Complexity*: small. *Touches*: `WheelCanvas.tsx` render only; `useWheelAnimation.ts` untouched. **Additive.**
2. **Pointer tick** — nudge the pointer triangle by a few degrees each time a segment boundary passes under it, driven off the existing `rotation` `MotionValue` via `useTransform`. *Why here*: the wheel's motion curve is already excellent (`useWheelAnimation.ts:39`); a physical pointer is the missing half. *Complexity*: medium. *Touches*: `WheelCanvas.tsx` (the pointer div at :49-60). **Additive** — `useWheelAnimation.ts` exposes `rotation` already.
3. **Replace the spinning-state 🎯** (`WheelCanvas.tsx:88`) with three pulsing dots or a rotating accent ring. *Why here*: a bare emoji is the loading state of the product's third-most-used template. *Small. Touches*: `WheelCanvas.tsx`.
4. **Optional "the wheel decides — no take-backs" line** as a new editor `text` field. *Why here*: turns a random spin into a commitment, which is the emotional point. *Small. Touches*: `editor/configs/interactive.ts` + one render line.

## surprise-gift
1. **Visible tap progress** — render `clicks / needed` as filling dots or a ribbon that tightens with each tap. The counter is already tracked (`Mobile/SurpriseGiftMobile.tsx:38`) and already in the `aria-label` (`:117`). *Why here*: five identical shakes with no progress is the template's only real flaw. *Complexity*: small. *Touches*: `Mobile/` + `Desktop/` render; `GiftBox.tsx` untouched. **Additive.**
2. **Escalating shake** — scale the shake amplitude with `clicks/needed` (currently a fixed 8-keyframe pattern at `Mobile:112`). *Why here*: builds anticipation for free. *Small. Touches*: `Mobile/` + `Desktop/` only.
3. **Make `clicksRequired` editable** — the key already exists in `defaultData` (`editor/configs/interactions.ts:24`); add a `select` field of 3/5/7 mirroring the `hitsRequired` pattern at `configs/interactions.ts:35-40`. *Small. Touches*: `configs/interactions.ts` + message keys. **Additive.**
4. **Actually fly the lid off** — `components/GiftBox.tsx:38` early-returns `null` when open, so the authored `lidVariants.open` spring (lines 20-26) is dead. Keep the box mounted for ~400 ms so the lid animation plays before `AnimatePresence` removes it. *Why here*: a designed animation already exists and is never seen. *Complexity*: medium; **RISK** — this changes the mount/unmount timing in `Mobile:108-121`, which is interaction-adjacent. Verify against the "stable transition zone" comment at `Mobile:103-105` before touching.

## punching-bag
1. **Redraw the glove as an SVG** (and fix the LTR internals at `Mobile:96-97` / `Desktop:100-101` in the same pass). *Why here*: this is the single worst-looking asset in the product and it is the template's hero. *Complexity*: medium. *Touches*: new `PunchingBag/components/BoxingGlove.tsx` + the two view files. **Additive** — hit logic lives in `PunchingBag.tsx` and is untouched.
2. **Impact burst** — a short radial shockwave ring + 4-6 spark lines at the contact point on each hit. The `showPunch` flag (`Mobile:24-30`) already gives a 150 ms window to hang it on. *Why here*: the mechanism is *hitting* and there is currently no impact — only a tilt. *Complexity*: medium. *Touches*: the two view files.
3. **Escalate the tilt with hit count** — amplitude scales from ±8° to ±25° as `hits` approaches `hitsRequired` (currently a fixed 6-keyframe pattern at `Mobile:67`). *Small. Touches*: view files only.
4. **Move the counter out of the bag** and raise contrast — it sits at `text-white/60` inside the bag (`Mobile:78`) and fails contrast on light bag colours. *Small.*

## excuse-generator
1. **Decelerating roll** — replace the fixed 80 ms × 11 `setInterval` (`Mobile:36-46`) with a widening interval (60, 60, 80, 110, 160, 240, 350 ms…). *Why here*: a slot-style landing is what makes a generator feel like a machine rather than a random function. *Complexity*: small. *Touches*: `Mobile/` + `Desktop/` (both hold their own copy of `generateExcuse`). **Additive** — no shared state file exists to break.
2. **Ease the cog to a stop** instead of `stop()` + `set({rotate:0})` (`Mobile:43-44`), which visibly snaps. *Small. Touches*: same two files.
3. **Paper-slip presentation** — render the excuse on a slightly rotated card with a torn/dashed top edge that slides up out of the machine, rather than swapping text inside a static box (`Mobile:105-121`). *Why here*: gives the "machine" an output. *Complexity*: medium. *Touches*: the two view files.
4. **Weighted excuses** — an optional per-excuse "favourite" flag so one line lands more often. *Complexity*: medium; **RISK** — changes the `excuses` field shape from `string[]` to objects, which touches `OptionsEditor` and the stored `metadata` schema. Flagged; probably not worth it.

## slot-machine
1. **Stagger the reel stops** — reels 1/2/3 settle ~300 ms apart instead of on the same tick (`SlotMachine.tsx:71-87`). *Why here*: this is the defining mechanic of a slot machine and it is currently absent. *Complexity*: medium; **RISK** — `SlotMachine.tsx` *is* the core interaction file. This is the one place where the honest answer is that the enhancement lives in the mechanism. Scope it as three staggered `setTimeout`s around the existing final-frame write, and treat it as a change requiring test coverage.
2. **Fix the dark-mode reels** — delete the inline `backgroundColor`/`borderColor` overrides at `components/Reel.tsx:30-32` and let the existing `bg-surface-sunken` / `border-line` classes apply. *Small. Touches*: `Reel.tsx`. Purely additive/corrective.
3. **Win frame** — on `hasWon`, add a pulsing accent glow ring around the three reels rather than only recolouring the button to `#22c55e` (`Mobile:77-78`, a hardcoded green that is in no palette). *Small. Touches*: view files.
4. **Explain the editor** — the 9-field form (`configs/interactive-games.ts:4-45`) needs the `targetReelN` fields grouped under one heading explaining "this is what it lands on". *Complexity*: small–medium. *Touches*: `configs/interactive-games.ts` + message keys; possibly a `group` label concept in `EditorSidebar.tsx`. Highest-value editor fix in the product.

## apology-search
1. **Fill the 2-second wait** — replace the three dots with 2-3 fake "result" skeleton rows that shimmer in and then get swept away by the real answer. The `shimmer` keyframe already exists (`styles/tokens/type.ts:88-91`). *Why here*: 2000 ms (`ApologySearch.tsx:40`) is a long silence and the joke depends on the search-engine mimicry, which skeleton rows sell and dots do not. *Complexity*: medium. *Touches*: `Mobile/` + `Desktop/` view files; `ApologySearch.tsx` phase machine untouched.
2. **Result-count line** — "About 1 result (0.42 seconds)" above the answer. *Why here*: cheapest possible way to complete the parody. *Small. Touches*: view files + message keys.
3. **Human typing rhythm** — jitter `typingSpeedMs` ±30% per character and pause slightly longer at spaces (`ApologySearch.tsx:33-42`). *Complexity*: small; **RISK** — this is inside the core `handleStart` interval. Low risk in practice but it is the interaction file.
4. **Expose `typingSpeedMs`** as a 3-option select (slow/normal/fast) — the key already exists in `defaultData` (`configs/romance.ts:54`). *Small. Touches*: `configs/romance.ts`. **Additive.**

## relationship-quiz
1. **Direction-aware slide** — make the `x: ±50` in `components/QuestionCard.tsx:33-35` locale-aware (negate under `he`). *Why here*: questions currently advance backwards in Hebrew — the product's primary language. *Small. Touches*: `QuestionCard.tsx`. Correctness.
2. **Wire up `scoreMessages`** — `defaultData.scoreMessages` (`configs/interactive.ts:49-53`) is stored and never read; `components/QuizResults.tsx:33-34` uses fixed translation tiers. Read the sender's messages when present, fall back to tiers. *Why here*: personalisation the sender thinks they have. *Complexity*: medium. *Touches*: `QuizResults.tsx` + `configs/interactive.ts` (add an editable field). **Additive** — falls back to today's behaviour.
3. **Calm the score screen** — drop the 5 floating star emoji and the yellow-on-yellow "final score" pill (`QuizResults.tsx:40-53, 63-68`), keep the score ring, let the feedback line breathe. *Complexity*: small. *Touches*: `QuizResults.tsx`. Subjective — the current screen is legible, just loud; someone optimising for teenagers might keep the stars.
4. **Count-up the percentage** from 0 to the score over ~700 ms as the ring springs in. *Why here*: turns a static number into a small verdict moment. *Small. Touches*: `QuizResults.tsx`.

## timeline
1. **Fix mobile type** — `text-[9px]` date badges and `text-[10px]` descriptions (`Mobile/TimelineMobile.tsx:96,112`) up to `caption` (13px) and `body-sm` (15px). *Why here*: this is a template whose entire purpose is being read. *Small. Touches*: `Mobile/TimelineMobile.tsx`. Highest-value single line-change in the audit.
2. **Direction-aware entrance** — `x: -15` / `x: -20` (`Mobile:69`, `Desktop:61`) should be positive in RTL. *Small.*
3. **Scroll-driven reveal** — swap the mount-time `delay: index * 0.08` stagger for FM `whileInView`, so events reveal as the recipient scrolls. *Why here*: the timeline is a *journey* and currently the whole journey plays in the first 800 ms whether the recipient is looking or not. *Complexity*: medium. *Touches*: `Mobile/` + `Desktop/` view files. **Additive** — no state or data changes.
4. **Seed the editor with 2-3 example events** — `defaultData.events: []` (`configs/relationships.ts:15`) means the sender opens on an empty box. Every other template seeds defaults. *Small. Touches*: `configs/relationships.ts` + message keys. **Additive.**
5. **A connector that draws itself** — animate the dashed line's height from 0 as events appear. *Complexity*: medium. *Touches*: view files (`Mobile:56-62`).

## birthday-candles-interactive
1. **Blow-out feedback per candle** — a small smoke puff SVG (2-3 curling paths that rise and fade) replacing the literal `~` glyph at `components/BirthdayFlame.tsx:61`. *Why here*: the flame animation is the best in the product and its payoff is an ASCII tilde. *Complexity*: small. *Touches*: `BirthdayFlame.tsx` only. **Additive** — `blowCandle` lives in `BirthdayCandlesCore.tsx:41-43` and is untouched.
2. **Dim the scene as candles go out** — reduce ambient brightness / add a warm vignette that fades with each extinguished flame, so the room "darkens" before the greeting. *Why here*: a birthday cake ritual is about the room going dark; the current 800 ms gap (`Core:35`) is dead time that this fills. *Complexity*: medium. *Touches*: `BirthdayCandlesCore.tsx` render (the wrapper div), not the state machine.
3. **Last-candle emphasis** — the final flame flickers harder and takes a beat longer to die. *Small. Touches*: `BirthdayFlame.tsx` (needs an `isLast` prop from `Core:75-81`).
4. **Move `recipientAge` to the top of the editor** (`configs/interactive-events.ts:39-45`) — it drives the candle count and the numeral, so it should be the first thing the sender sets while watching the live preview. *Small. Touches*: `configs/interactive-events.ts` (array reorder). **Additive.**

## wedding-glass-interactive
1. **Fill the 1.9-second gap** — the frame timeline is 620/1240/1900 ms (`components/WeddingGlassCore.tsx:35-37`) with only two cross-fades. Add a shatter beat: a brief white flash and a handful of glass shards on the 1240 ms frame change. *Why here*: this is the largest pacing hole in the product, on the highest-stakes template. *Complexity*: medium. *Touches*: `WeddingGlassCore.tsx` render + a new `components/GlassShards.tsx`. **Additive** — the timer sequence stays as-is.
2. **Add `aiAssist: true` to the `message` field** — requires adding `{templateId: "wedding-glass-interactive", fieldKey: "message", maxLength: 100}` to `lib/validations/ai.ts:12-16` and `aiAssist: true` at `configs/interactive-events.ts:75`. *Why here*: wedding blessings are the hardest thing in the catalogue to write and the only template with AI help is a birthday cake. *Complexity*: small. *Touches*: two files, both allowlists. **Additive.**
3. **Add a colour field** — the template has none (`configs/interactive-events.ts:71-76`), so every wedding card looks identical. *Small. Touches*: `configs/interactive-events.ts` + `InteractiveShell`/overlay accent plumbing. **Additive** — but note `InteractiveShell.tsx` is shared with the holidays and birthday, so pass the colour as a prop with a default rather than changing the shell's signature semantics.
4. **Hold the greeting longer before offering "replay"** (`components/WeddingRevealOverlay.tsx:46-52`) — same `showReset` delay pattern as `SurpriseGift/Mobile:58`. *Small.*

## bar-bat-mitzvah
1. **Anticipation beat before the candy** — the current path is tap → 600 ms `setTimeout` → blessing (`BarBatMitzvah.tsx:33-37`), with candy running independently for 2.5 s. Add a 200 ms figure "wind-up" (a small crouch/scale) before `setBurstKey`. *Why here*: the tap currently has no acknowledgement. *Complexity*: small. *Touches*: `Mobile/` + `Desktop/` view files (the `motion.div` at `Mobile:68-84`); the timing in `BarBatMitzvah.tsx` is untouched.
2. **Cut particle count, raise particle size** — 40 concurrent FM nodes (`components/CandyBurst.tsx:56`) is the heaviest frame budget in the product. 20-24 larger, more characterful candies read better *and* run better on mid-range Android. *Complexity*: small. *Touches*: `CandyBurst.tsx` only. Subjective on the exact number.
3. **Retire the `CORAL` constant** (`Mobile/BarBatMitzvahMobile.tsx:23`, `#E28F79`) in favour of `primaryColor`, which is already an editable field (`configs/special-occasions.ts:23`) and already passed in. *Why here*: the sender picks a colour and the main CTA ignores it. *Small. Touches*: the two view files.
4. **Verify `tapHintLabel` renders** — it is an editable field (`configs/special-occasions.ts:22`) that I could not find rendered in `Mobile/BarBatMitzvahMobile.tsx`. **Flagged as unverified** — either it is desktop-only or it is an orphaned field. Check `Desktop/BarBatMitzvahDesktop.tsx` before acting.

## The six holiday templates (shared engine)

Design rule for this family: **enhancements must diverge the six, not converge them.** The shared engine stays shared; the per-holiday *character* is what gets richer.

1. **Per-holiday reveal choreography** — today `HolidayRevealOverlay.tsx` is byte-identical across all six except `accentColor`. Add an optional `revealMotion` key to each entry in `holidays-shared/holiday-config.ts` (e.g. Hanukkah's card fades up like a flame catching; Purim's spins in like a `ra'ashan`; Passover's slides open like the matzah; Shavuot's blooms from centre). The overlay reads the key and picks a variant; unspecified holidays keep today's behaviour. *Why here*: the payoff moment is where the six feel most interchangeable, which is exactly backwards. *Complexity*: medium. *Touches*: `holiday-config.ts` (+6 keys), `HolidayRevealOverlay.tsx` (a variants map). **Additive** — `HolidayInteractiveCard.tsx`'s state machine is untouched, and any holiday without the key renders identically to today.
2. **Give the six a real holiday palette** — four of the six accents come straight from the editor swatch list (`constants/colors.ts`). Author six deliberate two-colour pairs (accent + a background wash for `HolidayCardFrame`). *Why here*: Sukkot green and Shavuot green are currently near-neighbours picked from a generic list. *Complexity*: small. *Touches*: `holiday-config.ts` (+ one optional field), `HolidayCardFrame.tsx` (accept an optional wash). **Additive.**
3. **Per-holiday tap participation, opt-in** — an optional `taps: n` in `holiday-config.ts` so a holiday can require n taps to advance frames instead of one tap playing the whole sequence (`HolidayInteractiveCard.tsx:49-57`). Hanukkah lighting one candle per tap is the obvious case; Purim and Shavuot would leave it unset. *Why here*: one tap and watch is the weakest recipient verb in the catalogue. *Complexity*: medium; **RISK** — this modifies the engine's timeline branch, which is the core interaction for all six at once. Only ship it behind an opt-in key so unset holidays take the existing code path unchanged, and test all six.
4. **Add a colour field and `aiAssist` to the holiday editor** — `configs/interactive-events.ts:5-10` gives all six only four text fields, no colour and no AI. Holiday greetings are formulaic and are exactly what AI is good at. *Complexity*: small. *Touches*: `configs/interactive-events.ts`, `lib/validations/ai.ts:12-16` (six new allowlist entries, or one wildcard-per-template entry). **Additive.**
5. **Rename the Rosh Hashanah frame assets** to remove the spaces (`scenes/RoshHashanahScene.tsx:9-12`). Hygiene. *Small.*

## love-coupons
1. **Perforation tear on redeem** — the stub separates and falls away as the stamp lands, instead of the card simply greying out (`components/CouponCard.tsx:127-139`). The ticket geometry is already there (`PerforatedEdge` at :110-124). *Why here*: this template's craft is its physicality; redemption should feel physical. *Complexity*: medium. *Touches*: `CouponCard.tsx` only. **Additive** — `useCoupons` and the redeem action are untouched.
2. **Style the confirm modal's destructive action distinctly** and add a one-line "this can't be undone" (`components/CouponRedeemModal.tsx:121-142`). *Why here*: an irreversible action currently looks like an ordinary CTA, and the recipient has no reset (reset is `isCreateRoute`-gated at `Mobile/LoveCouponsMobile.tsx:65`). *Small. Touches*: `CouponRedeemModal.tsx`.
3. **Replace the `Loader2` spinner** during redemption (`CouponRedeemModal.tsx:139`) with a stamp-pressing animation. *Why here*: the most emotionally loaded network call in the product currently shows a generic spinner. *Complexity*: small. *Touches*: `CouponRedeemModal.tsx`.
4. **Direction-aware entrance** (`CouponCard.tsx:31`, `x: -20`) and give the title block room so it can't collide with the `absolute start-4` redeem button on long Hebrew titles. *Small. Touches*: `CouponCard.tsx`.

## open-when
1. **Open the envelope** — on tap, animate the front flaps down and the white card sliding up before the modal appears. The flaps are already separate SVG polygons (`components/EnvelopeLayers.tsx:66-67`) and the card is already its own layer (`components/EnvelopeCard.tsx:82-119`). This is the highest-ceiling animation opportunity in the product and the geometry for it already exists. *Complexity*: medium–large. *Touches*: `EnvelopeLayers.tsx` + `EnvelopeCard.tsx` + a short delay before `onOpen` fires. **Partially RISK** — deferring `onOpen(envelope)` by ~500 ms does touch the click handler at `EnvelopeCard.tsx:48`. Keep the state in the card, not in `OpenWhen.tsx`.
2. **Make waiting feel designed** — replace the `Lock` icon + `text-[9px]` raw date (`EnvelopeCard.tsx:110-118`) with a "opens in 6 days" countdown and a wax seal that looks *sealed* rather than desaturated. *Why here*: anticipation is the entire product premise of this template and is currently its least designed surface. *Complexity*: medium. *Touches*: `EnvelopeCard.tsx` + `constants/index.ts` (a `daysUntil` helper next to the existing `isEnvelopeUnlocked`). **Additive.**
3. **Default the seeded envelopes to future dates** — both defaults use `new Date()` (`configs/relationships.ts:53,60`), so an untouched card ships with locking disabled. Seed +7 and +30 days. *Small. Touches*: `configs/relationships.ts`. **Additive.**
4. **Letter paper variants** — an optional per-envelope paper style (ruled / plain / aged) on top of the existing ruled-paper gradient (`components/LetterModal.tsx:79-80`). *Complexity*: medium; **RISK** — adds a field to the `envelopes` object shape, which touches `EnvelopesEditor` and stored `metadata`.

---

# 3. Shared design-language tokens (surface only)

## What's inconsistent today

**Easing.** Every template inlines its own. Observed values:

| Value | Where |
|---|---|
| `ease: "easeOut"`, 0.4 s | `DateInvite/Mobile:53`, `DateInvite/Desktop:51`, `Timeline/Mobile:37` |
| `ease: "easeInOut"`, 0.35 s | `PunchingBag/Mobile:68` |
| spring `800/15/0.4` | `DateInvite` No button |
| spring `500/15` | `PunchingBag` glove |
| spring `400/15` | `OpenWhen` heart seal |
| spring `300/30` | `CouponRedeemModal:90` |
| spring `300/12/0.8` | `GiftBox` lid |
| spring `200/15` | `QuizResults` score ring |
| spring `180/14` | `SurpriseGiftReveal:36` |
| spring `120` | `DecisionWheel` wheel entrance |
| `cubic-bezier(0.15,0.85,0.25,1)`, 4 s | `useWheelAnimation.ts:39` |
| 0.45 s `easeOut` | `HolidayRevealOverlay:29`, `BirthdayRevealOverlay:21`, `WeddingRevealOverlay:21`, `GreetingReveal:27` |
| 0.56 s `easeInOut` | `WeddingGlassCore:82` |
| 0.22 s `easeInOut` | `FrameSequenceScene:33` |

That is **13 distinct motion personalities**. The token file already has the right answers (`styles/tokens/type.ts:56-65`: `out-quint` `cubic-bezier(0.22,1,0.36,1)`, `out-expo` `cubic-bezier(0.16,1,0.3,1)`, `fast` 160 ms / `base` 240 ms / `slow` 420 ms) and **not one Framer transition references them**.

**Colour.** Four oranges in play: `#D85A30` (brand-500 token, and what `CLAUDE.md` calls the brand colour), `#d4826f` (`DEFAULT_PRIMARY_COLOR`, what every template actually uses), `#C47A5A` (salmon-500), `#E28F79` (`CORAL` in `BarBatMitzvahMobile.tsx:23`). Plus hardcoded non-palette colours: `#22c55e` (SlotMachine win), `#ffd700`/`#ff6b8a` (ScratchCard confetti), `#f3f4f6`/`#f8f4f1`/`#e5e7eb` (Reel), `#d1d5db`/`#9ca3af` (ScratchGrid), `#ffde59` (BirthdayFlame — this one *is* in the palette).

**Typography.** The scale (`type.ts:8-20`) bottoms out at 13px `caption`. Templates go below it: `text-[11px]`/`text-[10px]` (`FooterBranding:23,69`, `LimitedInput:87,95`), `text-[10px]`/`text-[9px]` (`TimelineMobile:96,112`, `EnvelopeCard:113`). Templates also mix scale tokens (`text-title-lg`, `text-display-md`) with raw Tailwind (`text-xl`, `text-2xl`, `text-5xl`) in the same file — e.g. `DateInviteDesktop.tsx:41,74` uses `text-2xl 2xl:text-display-md`.

## Proposed tokens

A **motion vocabulary file** — `src/components/templates/shared/motion-tokens.ts` — exporting plain Framer transition objects. Not a component, not an engine. Each template imports the one or two it wants; nothing forces adoption; a template that ignores it behaves exactly as today.

| Token | Value | Intended for |
|---|---|---|
| `ENTER` | `{ duration: 0.42, ease: [0.22,1,0.36,1] }` | anything appearing on mount (cards, titles) |
| `EXIT` | `{ duration: 0.18, ease: "easeIn" }` | anything leaving |
| `REVEAL` | `{ duration: 0.45, ease: [0.16,1,0.3,1], delay: 0.1 }` | the greeting/result moment — already the de-facto value in all four reveal overlays |
| `TAP` | `{ type: "spring", stiffness: 400, damping: 22 }` | button press feedback |
| `PLAYFUL` | `{ type: "spring", stiffness: 300, damping: 14, mass: 0.8 }` | gift lids, seals, stamps |
| `SNAPPY` | `{ type: "spring", stiffness: 700, damping: 18, mass: 0.4 }` | dodging/evading elements |
| `STAGGER_STEP` | `0.07` | list entrance delays (currently 0.08 / 0.1 / 0.03 in different files) |
| `RESET_DELAY_MS` | `1500` | how long to wait before offering "try again" — codifies `SurpriseGift/Mobile:58` |

Plus three **directional helpers** so RTL stops being a per-file decision:

```
slideInX(locale)  // +N in LTR, -N in RTL
slideOutX(locale)
```

These would fix `QuestionCard.tsx:33-35`, `TimelineMobile.tsx:69`, `TimelineDesktop.tsx:61` and `CouponCard.tsx:31` with one shared helper rather than four ad-hoc negations.

**Colour**: pick one canonical accent. My recommendation is to keep `#d4826f` (it is what every template ships with and what users see) and correct `CLAUDE.md` + the `brand` scale to match, rather than the reverse — changing the visible colour of 21 live templates to match a doc is the wrong direction. Then delete `CORAL` from `BarBatMitzvahMobile.tsx:23` and the inline overrides in `Reel.tsx:30-32`. Subjective; a designer might reasonably prefer the more saturated `#D85A30` as the brand and keep `#d4826f` as the template default.

**Typography**: add a `micro: 0.6875rem/11px` step to `type.ts` so `FooterBranding` and character counters have a legitimate token, then raise every sub-11px usage (`TimelineMobile`, `EnvelopeCard`) into the real scale. Nothing below 11px should exist.

---

# 4. Sound design proposal

## Confirmed: there is no audio

- `grep -ri "<audio|new Audio\(|howler|use-sound|\.mp3|\.wav|AudioContext|navigator\.vibrate"` across `client/src` → **0 matches**.
- `client/package.json` dependencies (lines 15-37) contain no audio library. The only media-adjacent deps are `canvas-confetti` and `framer-motion`.
- `client/public/` contains only `assets/` — no audio files anywhere.

So a sound layer means: new assets, a new tiny playback utility, and a new user-facing control. Nothing exists to build on.

## Where it would have outsized impact

Scope: **one short cue at the reveal moment only.** Not background music (that is a separate item and should not be conflated with this), not per-tap clicks on every template.

Ranked by impact per unit of effort:

| Template | Cue | Why it earns the exception |
|---|---|---|
| wedding-glass-interactive | glass break at the 1240 ms frame | The 1.9 s gap (`WeddingGlassCore.tsx:35-37`) is currently silent *and* visually sparse. Sound is the cheapest possible fill, and a breaking glass is the single most recognisable audio signature in Israeli life-cycle events |
| birthday-candles-interactive | a soft whoosh per candle + a single chime when the last goes out | The blow-out gesture is inherently breath-and-sound; the current payoff is a `~` glyph |
| holiday-hanukkah | a match-strike / flame catch per frame | The only holiday where the sequence is literally a lighting ritual |
| love-coupons | a stamp thud on successful redeem | Replaces a `Loader2` spinner on the product's most meaningful confirmed action |
| decision-wheel | pointer ticks during the spin | The 4 s spin is the longest single animation in the product; ticks are what make a wheel feel physical |
| bar-bat-mitzvah | candy patter | Nice-to-have; the visual already carries it |

Everything else — punching bag, slot machine, scratch card — would benefit but is not worth the first increment.

## Constraints that must be designed around

1. **Autoplay policy.** iOS Safari and Chrome both block audio without a user gesture. Fortunately every cue above fires *after* a tap (the wedding glass, the candle, the coupon redeem, the wheel spin all originate in a `onClick`). So each is legal — **provided the `Audio` object is created or unlocked inside the same gesture handler**, not in an effect. This is a real implementation constraint, not a footnote: creating the audio in a `setTimeout` chain (which is exactly how `WeddingGlassCore.tsx:35-37` is structured) will be blocked on iOS.
2. **iOS silent switch.** HTML5 `<audio>` respects the hardware mute switch; `AudioContext` with the right category does not. Many recipients open a card in a meeting with the phone on silent. Design for the card to be fully comprehensible with zero audio — sound is a garnish, never information.
3. **Consent.** A card that makes noise unexpectedly is worse than a silent one. Recommendation: a small persistent mute/unmute affordance on the public viewer (`app/[locale]/(public)/p/[slug]/client.tsx`), defaulting to **on but at low volume**, with the state in `localStorage`. Alternatively default off with a visible "tap for sound" — safer, lower reach. This is a product judgement call, not a technical one.
4. **Accessibility.** The existing `AccessibilityProvider` (`src/components/accessibility/AccessibilityProvider.tsx`) already has a `stopAnimations` toggle. A `muteSounds` toggle belongs in the same panel, and `prefers-reduced-motion` users should probably default to muted.
5. **Weight.** Six cues at ~15-25 KB each (mono, 48 kbps AAC/opus) is ~120 KB — acceptable, but they must be lazily fetched on first interaction, not preloaded on card open, or they compete with the template's own SVG assets for first-paint bandwidth.
6. **Library.** No dependency is needed. A ~30-line `src/lib/audio/cue.ts` wrapping a cached `Audio` element per cue, with a global mute flag, is sufficient. Adding `howler` (~10 KB gz) buys sprite support and iOS unlock handling; worth it only if the cue count grows past ~10.

**Haptics** deserve a mention alongside: `navigator.vibrate` exists on Android Chrome (not iOS Safari) and costs nothing. A 10 ms tick on each punching-bag hit, gift-box tap, and candle blow-out would add physicality on the majority-Android Israeli market with zero assets. Also currently absent (same grep).

---

# 5. New template concepts

These are **new templates**, not modifications — each was arrived at by asking "what verb does the recipient perform that no existing template asks for?"

Existing recipient verbs, for reference: tap-to-commit (date-invite), drag-to-clear (scratch-card), press-and-wait (wheel, slot, excuse, apology, all six holidays, wedding, bar-mitzvah), repeat-tap (surprise-gift, punching-bag, birthday-candles), answer (quiz), read (timeline), claim (love-coupons), unlock-over-time (open-when).

### 5.1 "Cassette / Mixtape" — הקלטת
**Concept.** The sender builds a "side A / side B" tracklist: 5-8 entries, each a song title plus a one-line reason ("track 3 — because you sang this badly in the car in Eilat"). The recipient sees a cassette; pressing play spools the reels and advances one track at a time, each track's note typing itself out over the spinning reels. There is no audio playback — the *reason* is the content.

**Distinct because**: the recipient's verb is **pace-through** — they control advancement but not content, and the pleasure is in the accumulating list. Nothing else in the catalogue does sequential-with-control.

**Most different from**: `timeline` (which is the closest neighbour — dated entries in order) and `love-coupons` (a list you act on). The separation from `timeline` is real: timeline is scrolled passively and is date-anchored; the cassette is advanced deliberately, is order-anchored not date-anchored, and each entry has a reveal beat. If that separation feels thin in practice, the honest call is to drop this concept rather than ship a timeline reskin.

**Complexity tier**: medium (per pricing report's classification — personal, replayable, not occasion-critical). Suggested tier: **Lite**.

**AI**: yes — the per-track "reason" field is an ideal `aiAssist` target (add `{cassette, trackReason}` to `lib/validations/ai.ts`).

**Buildable from existing patterns**: almost entirely. The advancing-list state is `useQuiz`-shaped; the typing effect exists in `ApologySearch.tsx:33-42`; the spinning reels are the `Reel.tsx` scale-jitter idea rotated. **New capability needed**: none. (Actual music playback would need audio + licensing — explicitly out of scope; the concept works without it.)

### 5.2 "Two Truths and a Lie" — שתי אמיתות ושקר
**Concept.** The sender writes three statements about the relationship and marks which is the lie. The recipient picks. Whatever they pick, all three are then revealed with the sender's commentary on each — including why the lie is *almost* true.

**Distinct because**: the recipient's verb is **guess-then-learn** with **no wrong answer**. The quiz has right and wrong answers and produces a score; this produces a story regardless of the pick. That is a different emotional contract.

**Most different from**: `relationship-quiz`. The overlap is superficial (both present options) and the divergence is structural: one question not N, no scoring, the payoff is commentary rather than a percentage, and the interaction is single-shot rather than a run.

**Complexity tier**: casual. Suggested tier: **Free** — it is a strong funnel-entry candidate alongside date-invite.

**AI**: strong fit — "write me a plausible lie about a couple who met at university" is exactly the AI-assist shape. Two allowlist entries (`statements`, `commentary`).

**Buildable**: yes. Option buttons exist (`RelationshipQuiz/components/OptionButton.tsx` pattern), reveal overlays exist. **New capability**: none.

### 5.3 "The Jar" — הצנצנת
**Concept.** A glass jar filled with folded paper notes. Every time the recipient opens the link they can draw **one** note, and only one — the jar remembers (client-side) and tells them to come back tomorrow. Over a week they empty the jar.

**Distinct because**: the recipient's verb is **ration** — the card deliberately withholds. Every other template can be consumed in one sitting.

**Most different from**: `open-when` — and this needs care, because both gate content over time. The distinction is the gating *rule*: open-when is **sender-scheduled** (the sender picks the date each envelope unlocks, and the recipient sees the schedule); the jar is **recipient-paced** (nothing is scheduled; drawing is random; the constraint is one-per-visit). Open-when says "read this when you're sad"; the jar says "you get one a day, and you don't get to choose which". If those don't feel distinct enough to the product owner, this concept should be cut rather than shipped as an open-when variant.

**Complexity tier**: medium. Suggested tier: **Premium** — it needs the long link lifetime that the pricing report §3 recommends (90 days), and it is a natural upsell for that exact reason.

**AI**: moderate — bulk-generating 20 short notes from a prompt is a genuinely useful assist and a good showcase for a "generate many" AI mode that doesn't exist yet.

**Buildable**: mostly. **New capability**: draw-state persistence. `localStorage` is the honest answer (per-device, resettable, no backend) but it degrades on a shared or cleared browser. Server-side per-recipient state would require identifying the recipient, which the product deliberately doesn't do (public links, no recipient accounts). Recommend `localStorage` with graceful degradation and a clear product decision that "cleared browser = jar refills".

### 5.4 "Advice Machine" / "Fortune Teller" — מכונת העצות
**Concept.** A vintage fortune-teller machine. The recipient "inserts a coin" (drag a coin into a slot), the machine whirs, and a printed card slides out of a slot with a fortune the sender wrote. Three fortunes, three coins, then the machine closes for the day.

**Distinct because**: the verb is **drag-to-insert** — a directed drag toward a target, which nothing in the catalogue asks for. Scratch-card drags, but it drags *across* a surface with no target.

**Most different from**: `excuse-generator` (random text from a list) and `decision-wheel` (random selection). The divergence: those two are *randomisers* the recipient triggers with a press; this is a *ritual* with a physical insertion gesture, a mechanical output, and a scarcity limit.

**Complexity tier**: medium. Suggested tier: **Lite**.

**AI**: yes — fortune-writing is formulaic and a perfect assist target.

**Buildable**: needs FM `drag` with `dragConstraints` and a drop target, which appears nowhere in the codebase today. **New capability**: drag-gesture handling (available in `framer-motion@11`, just unused). Everything else — the card slide-out, the whir animation — is existing vocabulary.

### 5.5 "Memory Match" — משחק זיכרון
**Concept.** A grid of face-down cards. Each matched pair reveals a photo-less "moment" the sender wrote — a place, a phrase, an in-joke. Clearing the board reveals the full message.

**Distinct because**: the verb is **remember and match** — sustained, skill-adjacent, multi-minute engagement. Every existing template resolves in under 60 seconds.

**Most different from**: `relationship-quiz`. Both are games, but the quiz tests knowledge of the *sender*, resolves in one pass, and produces a score; memory-match tests short-term recall, is replayable with a different shuffle each time, and produces a slowly assembled message. It is also the only template where the recipient can *fail* and retry within a single session.

**Complexity tier**: medium, leaning replayable. Suggested tier: **Lite**.

**AI**: weak fit — the content is inherently specific memories that AI cannot invent. Would be the first template where the honest answer is "no AI assist".

**Buildable**: yes, entirely from existing patterns (grid, flip animation via FM `rotateY`, state machine like `useQuiz`). **New capability**: none. The main design risk is that a grid of Hebrew text cards is visually noisy — this template needs real typographic restraint to not look like a homework exercise.

---

# 6. Prioritised order

## Ranking method

Value = (emotional/perceived-quality lift) × (likelihood a recipient sees it) ÷ (effort). Usage counts come from `../.claude/plans/pricing-model-research.md` §4 and are one input, weighted against my polish-gap judgement — a 0-use template with a huge gap can outrank a 27-use template that is already good.

| # | Template | Uses | Polish gap | Effort | Verdict |
|---|---|---|---|---|---|
| 1 | **timeline** | 6 | High (unreadable type, LTR entrance, empty default) | Very low | Do first |
| 2 | **scratch-card** | 20 | High (grey placeholder surface, blind threshold, RTL bug) | Low | Do first |
| 3 | **open-when** | 3 | Medium-high (best assets, weakest anticipation, envelope never opens) | Medium | Do first |
| 4 | **wedding-glass-interactive** | 0 | High (1.9 s silent gap, no AI, no colour) | Medium | Do first |
| 5 | **love-coupons** | 8 | Medium (great craft, thin confirm, spinner on the key moment) | Low-medium | Do first |
| 6 | **the six holidays** | 0 | High (six templates, one payoff) | Medium | Do first (one change, six templates) |
| 7 | date-invite | 27 | Low-medium (good already; missing editable Yes/No) | Very low | Next |
| 8 | relationship-quiz | 4 | Medium (RTL slide, dead `scoreMessages`, loud results) | Low | Next |
| 9 | surprise-gift | 6 | Medium (no tap progress, dead lid animation) | Low | Next |
| 10 | birthday-candles-interactive | 0 | Medium (best animation, `~` payoff) | Low | Next |
| 11 | decision-wheel | 6 | Low-medium (best easing, weak payoff placement) | Low | Next |
| 12 | punching-bag | 0 | Very high (worst asset in the product) | Medium | Later |
| 13 | slot-machine | 1 | High (dark-mode bug, flat stops, 9-field editor) | Medium-high | Later |
| 14 | bar-bat-mitzvah | — | Medium (good already; perf + colour-ignoring CTA) | Low | Later |
| 15 | excuse-generator | 0 | Medium-high (uniform roll, generic box) | Medium | Later |
| 16 | apology-search | 0 | Medium-high (2 s dead air, generic search bar) | Medium | Later |

*(Ranks 16-21 are the five remaining holidays, which move as a group with rank 6.)*

## Recommended first five (plus one)

**1. timeline.** The cheapest real win in the audit. Three edits — raise `text-[9px]`/`text-[10px]` into the type scale (`Mobile/TimelineMobile.tsx:96,112`), negate the entrance `x` under RTL (`:69`, `Desktop:61`), seed 2-3 default events (`configs/relationships.ts:15`) — and a template that is currently unreadable on a phone becomes usable. 6 uses means real people have shipped cards their recipients struggled to read.

**2. scratch-card.** 20 uses (second-highest), and its central surface is a hardcoded placeholder grey. Progressive prize opacity + a real foil texture + the `dir="ltr"` fix transforms the most-touched interaction in the product for a day of work. It also already has an AI field, so it is the template most likely to demo well.

**3. open-when.** The best-crafted assets in the codebase are attached to the weakest anticipation design. The envelope layers are already separate SVG polygons — the "open the envelope" animation is unusually cheap given how much it would lift the product's most emotionally ambitious template. Only 3 uses, but this is the template that would make someone screenshot the product.

**4. wedding-glass-interactive.** Zero uses today, which is the point: it is event-critical (per the pricing report's §4 classification, a **Premium**/add-on template that one-off event buyers would pay for) and it currently has a 1.9-second silent gap, no AI help on the hardest-to-write field in the catalogue, and no colour customisation. It is the template with the largest gap between *revenue potential* and *current polish*.

**5. love-coupons.** 8 uses, the strongest visual craft, and the only template with a real server-side action. Three small fixes — perforation tear on redeem, a properly weighted confirm, a stamp animation instead of `Loader2` — take a good template to the product's flagship.

**6 (bonus, best ratio in the list). The six holidays.** One change to `holidays-shared/holiday-config.ts` + `HolidayRevealOverlay.tsx` — per-holiday reveal choreography and a real per-holiday palette — improves **six templates at once**, and it is precisely the change that makes each holiday feel *more itself* rather than more like its siblings. Zero uses today, but the pricing report's §4 recommendation is to rotate the in-season holiday to Free as an acquisition spike; that plan only pays off if the in-season card is memorable.

## Deliberately deferred, and why

**punching-bag** has the worst asset in the product and would benefit most in absolute terms — but it has 0 uses and is a novelty/free-tier template, so the lift doesn't convert. Fix it when the glove offends someone.

**slot-machine** needs its reel-stop stagger, which is the one enhancement in this whole document that genuinely lives inside a core interaction file (`SlotMachine.tsx:71-87`). Given 1 use and zero test coverage over template behaviour, that risk isn't worth taking before the higher-value work lands. Its one-line dark-mode fix (`Reel.tsx:30-32`) should be done immediately anyway — it costs nothing.

**date-invite** is the most-used template and is already the second-best-executed. Making `yesText`/`noText` editable (`configs/romance.ts`, a config-only change) is worth doing opportunistically in any pass, but it does not warrant a dedicated slot.

## Cross-cutting work worth bundling into the first pass

- Create `shared/motion-tokens.ts` (§3) and adopt it in whichever templates you touch first — do **not** do a sweeping 21-file migration.
- Add the `slideInX(locale)` helper and use it to fix all four LTR-fixed entrance animations at once (`QuestionCard.tsx:33-35`, `TimelineMobile.tsx:69`, `TimelineDesktop.tsx:61`, `CouponCard.tsx:31`).
- Fix the iOS input-zoom risk once, in `editor/components/EditorField.tsx:33-36` (`baseInputClass`) and `AiAssistButton.tsx:72` — it affects every template's editor.
- Delete `shared/GreetingReveal.tsx` (dead, and contains the `?${recipientName}` text bug at line 32) or wire it up deliberately.
- Correct the "13 approved colors" comment at `constants/colors.ts:19` (there are 12).
- Rename the Rosh Hashanah frame assets to remove spaces (`scenes/RoshHashanahScene.tsx:9-12`).

---

## Gaps and caveats in this audit

- **`tapHintLabel`** (bar-bat-mitzvah) is an editable field I could not find rendered in the mobile view. Unverified — may be desktop-only.
- I read every Mobile view and every shared/component file, but **not every Desktop view in full** (`ExcuseGeneratorDesktop`, `SlotMachineDesktop`, `ApologySearchDesktop`, `LoveCouponsDesktop`, `OpenWhenDesktop`, `TimelineDesktop`, `BarBatMitzvahDesktop`, the six holiday Desktop wrappers). The holiday and interactive-event Desktop files are one-line delegations and are safe to generalise; the game-template Desktop files were sampled via grep and appear to mirror their Mobile siblings, but per-file claims about desktop-only details should be re-checked.
- **Perceived-quality judgements** (which templates look dated, which reveals feel flat, the ranking in §6) are mine and are subjective. Every code-derived claim carries a file:line citation; every aesthetic claim is labelled as judgement.
- Usage numbers are a prod snapshot cited from the pricing report and predate any recent activity. `bar-bat-mitzvah` has no usage figure because it is absent from the `../db/schema.sql` seed (pricing report §P11).
- The "no audio" and "no haptics" findings are from an exhaustive grep of `client/src` plus `package.json` plus `public/` — high confidence.
