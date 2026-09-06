# Remove 4-digit coupon verification code + merge Smart Blessing into templates

## Decisions (confirmed with user)
1. Remove LoveCoupons 4-digit verification code gate entirely. Coupons redeem on click, no code check client or server side. Reverts the 20260423_c2_verification_code.sql security gate (intentional, user-approved trade-off — coupon redemption becomes unauthenticated by design, matching pre-C2 behavior).
2. Smart Blessing: replace with static JSON blessing bank (no Gemini AI). Match by user's free-text description via keyword/category detection against template's `aiSubjectPrompt` context.
3. Generated blessing text merges directly into each template's own relevant field instead of a separate floating box:
   - interactive-events.ts (holidays, birthday-candles, wedding-glass) → `message`
   - date-invite → `successMessage`
   - scratch-card → `prizeContent`
   - apology-search → `resultSubtitle`
   - surprise-gift → `greeting`
   - punching-bag → `resultMessage`
   - relationship-quiz, decision-wheel, slot-machine, excuse-generator, timeline, love-coupons, open-when → no fit, Smart Blessing hidden entirely (removed from EditorSidebar for these templateIds)

## Part A — remove verification code
- [ ] New migration: revert redeem_love_coupon to 2-arg (creationId, couponId), drop verification_code column + constraint
- [ ] redeem.ts — drop verificationCode from schema/call
- [ ] create.ts, persistCreation.ts — stop generating verificationCode
- [ ] SuccessModal.tsx — remove code UI block + query param
- [ ] useEditorState.ts, useEditorModals.ts — drop verificationCode from state/types
- [ ] FieldRenderer.tsx — drop prop
- [ ] registry.ts, TemplateRenderer.tsx — drop verificationCode from component contract
- [ ] LoveCoupons (Desktop/Mobile/types), useCoupons.ts, CouponRedeemModal.tsx — drop code-entry flow, auto-confirm redeem
- [ ] client.tsx (p/[slug]) — drop code query-param parsing

## Part B — static blessing bank + template-field merge
- [ ] JSON blessing bank file: categories keyed by template context (keywords), each with array of Hebrew blessing variants
- [ ] Matching helper: keyword-score description against category keyword sets, pick random variant from best match (fallback: generic warm blessing)
- [ ] Replace generateBlessing server action (drop Gemini call) to use bank + matcher, keep same ActionResult contract
- [ ] Remove style/theme generation (no longer AI-driven) — SmartBlessingField simplified, no accentColor/theme fields needed unless still used for display styling elsewhere (check SmartBlessingDisplay usage removal)
- [ ] EditorConfig: add `blessingTargetField?: string` per template; EditorSidebar passes it, SmartBlessingField writes generated text into that field's onChange instead of `smartBlessing` key; hidden when absent
- [ ] Remove SmartBlessingDisplay + smartBlessing/smartBlessingStyle metadata plumbing (TemplateRenderer, EditorPreview, blessing.ts reserved keys)
- [ ] Delete unused gemini client/promptBuilder/styleAdapter files if nothing else references them

## Execution order
Part A first (self-contained, mechanical). Part B second. Type-check after each file.
