# Template Enhancement Implementation Plan

Source: `template-enhancement-proposal.md`. Scope: all 21 templates, additive-only items (small/medium complexity). RISK-flagged core-interaction items are either skipped or done conservatively per the report's own caution. New template concepts and sound layer are NOT in this pass (separate future work).

Execution: batched by subagent (aviel-style, edit rights, sonnet), grouped by template family. Each batch runs `npm run type-check` after its edits. Motion tokens file created first so later batches can use it (optional adoption, not mandatory).

## Batch 0 — shared motion tokens (prereq)
- Create `client/src/components/templates/shared/motion-tokens.ts` per report §3 (ENTER/EXIT/REVEAL/TAP/PLAYFUL/SNAPPY/STAGGER_STEP). Additive export file, nothing imports it yet.

## Batch 1 — date-invite, scratch-card, decision-wheel
- date-invite: editable yes/no labels; dodge escalation; delayed reset (~2s)
- scratch-card: fix `dir="ltr"` bug → `dir="auto"`; progressive reveal opacity; token-driven foil gradient
- decision-wheel: result card wrapper + scroll into view; pointer tick via existing `rotation` MotionValue; replace 🎯 spinner; optional "no take-backs" field

## Batch 2 — surprise-gift, punching-bag, excuse-generator
- surprise-gift: visible tap progress; escalating shake; editable `clicksRequired` (select 3/5/7); fix dead lid animation (keep box mounted ~400ms before unmount — verify against `Mobile:103-105` stable-zone comment)
- punching-bag: SVG glove redraw + fix LTR-hardcoded internals (RTL bug); impact burst; escalating tilt; move counter out of bag + contrast fix
- excuse-generator: decelerating roll timing; ease cog to stop instead of snap; paper-slip presentation

## Batch 3 — slot-machine, apology-search, relationship-quiz
- slot-machine: fix dark-mode reel colors (delete hardcoded inline overrides — correctness, do first); staggered reel stops (~300ms apart, careful — core file, keep existing final-frame write, just stagger the setTimeouts); win-frame glow ring instead of hardcoded green
- apology-search: skeleton-row fill for the 2s wait; result-count line; expose `typingSpeedMs` as select; typing jitter ±30% (low risk per report)
- relationship-quiz: fix RTL slide direction (locale-aware, correctness); wire up `scoreMessages` (read sender's custom messages, fallback to tiers); calm score screen (drop stars/pill); count-up percentage animation

## Batch 4 — timeline, birthday-candles, wedding-glass
- timeline: fix mobile type sizes (9px/10px → caption/body-sm, correctness); fix RTL entrance direction (correctness); scroll-driven `whileInView` reveal; seed editor with example events; self-drawing connector
- birthday-candles: smoke-puff SVG replacing `~` glyph; dim-scene-as-candles-go-out; last-candle emphasis; move `recipientAge` to top of editor
- wedding-glass: fill 1.9s gap with shatter beat; add `aiAssist` to message field; add colour field (pass as prop, don't change InteractiveShell signature semantics); hold greeting longer before replay offered

## Batch 5 — bar-bat-mitzvah + six holidays (shared engine)
- bar-bat-mitzvah: anticipation wind-up before candy; cut particle count 40→~22, raise size; retire `CORAL` hardcode → use `primaryColor`; investigate `tapHintLabel` render (check Desktop file) before deciding action
- holidays (shared engine, one change set covers 6 templates): per-holiday `revealMotion` key + overlay variants (unset holidays keep current behavior); real two-color holiday palette pairs (accent + wash); colour field + aiAssist allowlist entries for all six; fix Rosh Hashanah frame filename spaces (correctness)
- Explicitly SKIP: per-holiday tap-to-advance participation (report flags as core-engine RISK affecting all six at once — out of scope this pass)

## Batch 6 — love-coupons, open-when
- love-coupons: perforation-tear redeem animation; distinct destructive-styled confirm + "can't be undone" line; replace redeem spinner with stamp animation; fix RTL entrance + title/button collision guard
- open-when: default seeded envelopes to future dates (+7/+30, correctness — do first); designed waiting state (countdown + sealed-look instead of desaturated+9px date); envelope-opens animation before modal (keep state in card component per report's caution, defer `onOpen` ~500ms)
- SKIP: letter paper variants (schema-shape change, report flags RISK)

## Explicitly out of scope this pass
- slot-machine editor field grouping/explanation UI (needs new EditorSidebar concept)
- scratch-card scratch-dust particles (report flags RISK — touch-coordinate tracking not currently retained)
- excuse-generator weighted excuses (schema shape change)
- open-when letter paper variants (schema shape change)
- holiday per-holiday tap participation (core engine RISK)
- Sound design, new template concepts (separate follow-ups)

## Verification
After each batch: `cd client && npm run type-check`. After all batches: `npm run lint`, spot-check 3-4 templates live in browser preview (date-invite, scratch-card, timeline, wedding-glass — mix of correctness fixes + new animation).
