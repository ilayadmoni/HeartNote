# New Interactive Greeting Templates

## Summary
Create 8 brand-new first-class templates alongside the existing template set:
`birthday-candles-interactive`, `wedding-glass-interactive`, and six holiday interactive templates.
Existing `birthday-candles`, `wedding-glass`, and `holiday-card` stay unchanged, active, visible, and renderable.

## Implementation Steps
- Add shared interactive template components, motion helpers, birthday candle logic, and holiday variant config.
- Add dedicated renderers for birthday, wedding, and six holidays.
- Add editor configs, gallery entries/previews, registry entries, and exports for all 8 slugs.
- Add a Supabase migration inserting 8 new template rows using existing premium and expiration conventions.
- Copy the provided wedding SVG files unchanged into `client/public/assets/images/wedding-interactive/`.
- Add targeted tests for birthday logic, holiday config, and registry/editor config coverage.

## Validation
- New template config schemas validate required fields.
- `recipientAge` is validated as a number from 1 to 120.
- Public birthday renderer gracefully falls back if malformed metadata reaches it.
- Existing template schemas and behavior remain unchanged except for non-breaking config-driven submit validation.

## Verification
- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npx vitest`

## Execution Log
After implementation, write `.claude/plans/logs/interactive-event-greetings-<timestamp>.log`
with results and the mandatory CLAUDE.md post-execution checklist.
