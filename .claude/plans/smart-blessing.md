# Smart Blessing (Gemini-generated blessing text + style)

## Spec (confirmed)
- New separate field in editor, all templates, all tiers. Existing manual blessing field untouched.
- User types short Hebrew description (who/what), max 100 chars.
- "Generate" button → spinner + disabled state during call.
- Server action calls Gemini API → returns `{ text: string, style: { accentColor, theme } }`.
- Generated text lands in an editable field (user can hand-edit after).
- Generated style applied via generic adapter (accent color from fixed palette + theme enum), no icon.
- Gemini unavailable/error/no-key/timeout/429 → clear inline error message, manual field still usable, no crash.

## Decisions
| Question | Decision |
|---|---|
| Style mapping | Generic adapter — Gemini returns `{ accentColor, theme }`, adapter maps onto each template's existing style keys |
| Icon | Not included — color+theme only |
| Rate limit | 10 generations / 5 min / user ID, fail-closed |
| SDK | `@google/generative-ai` official SDK |
| Env | `GEMINI_API_KEY` server-only, in `client/.env.example` |

## Files

**Backend (adiel)**
- `client/src/actions/generateBlessing.ts` — new server action, `protectedAction` + `validateOrigin` + rate limit
- `client/src/lib/gemini/client.ts` — SDK wrapper
- `client/src/lib/gemini/promptBuilder.ts` — Hebrew prompt template
- `client/src/lib/gemini/styleAdapter.ts` — maps `{accentColor,theme}` → per-template style keys
- `client/src/lib/utils/rate-limiter.ts` — add `blessingLimiter` export
- `client/src/lib/validations/blessing.ts` — Zod: 100-char input, Gemini response shape
- `client/.env.example` — add `GEMINI_API_KEY`
- `client/src/actions/index.ts` — barrel export
- `client/package.json` — add `@google/generative-ai`

**UI (aviel)**
- `client/src/components/editor/components/SmartBlessingField.tsx` — new: input + Generate button + spinner + inline error
- `client/src/components/editor/components/EditorSidebar.tsx` — mount field
- `client/src/components/editor/hooks/useEditorState.ts` — wire result into data map
- `client/src/hooks/useGenerateBlessing.ts` — new, via `useServerAction`

**QA/Quality (read-only, parallel, last)**
- avishag: fallback/error path, security (no raw error leakage, CSRF present, rate-limit keyed by user ID, key never client-exposed, prompt-injection check on Hebrew input)
- avigil: ≤150-line files, naming, no `any`, dead code, barrels

## Order
1. adiel (backend + Gemini integration + adapter) → `npm run type-check`
2. aviel (UI, consumes adiel's `ActionResult` contract) → `npm run type-check`
3. avishag + avigil in parallel → report findings → fixes applied by aviel/adiel
