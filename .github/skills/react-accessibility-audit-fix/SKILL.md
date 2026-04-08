---
name: react-accessibility-audit-fix
description: 'Audit and fix React component accessibility issues by adding missing ARIA attributes, improving semantic HTML structure, and verifying keyboard navigation support without changing visual design or business logic. Use for TSX components in Next.js projects.'
argument-hint: 'Target TSX file path, strictness level, and whether to include optional improvements beyond critical a11y issues'
user-invocable: true
---

# React Accessibility Audit And Fix

## Outcome
Review a React component and apply focused accessibility fixes while keeping visual output and business logic unchanged.

This skill targets:
- Semantic HTML correctness.
- Accessible names and ARIA relationships.
- Keyboard operability and focus behavior.
- Safe improvements that do not alter design intent or domain logic.

## Use When
- A TSX component needs an accessibility pass before release.
- Keyboard navigation or focus handling seems incomplete.
- Interactive UI relies on div/span or custom controls that need semantic hardening.
- You want deterministic a11y improvements with minimal behavioral risk.

## Inputs To Collect First
1. Target file path.
2. Component role and interaction model (form, modal, menu, tabs, card actions, etc.).
3. Whether the file is client-only or server-rendered in App Router context.
4. Scope boundary: critical fixes only (default) or include optional enhancements.
5. Validation requirements (type-check, lint, focused manual keyboard checks).

## Project References
- Core rules: [project-rules.md](../../../project-rules.md)
- Workspace defaults: [.github/copilot-instructions.md](../../../.github/copilot-instructions.md)
- Existing accessibility patterns:
  - [client/src/components/accessibility/AccessibilityWidget.tsx](../../../client/src/components/accessibility/AccessibilityWidget.tsx)
  - [client/src/components/accessibility/components/FocusTrap.tsx](../../../client/src/components/accessibility/components/FocusTrap.tsx)

## Guardrails (Do Not Violate)
- Do not alter business logic, data flow, or API contracts.
- Do not change visual design tokens, spacing, typography, or animation intent.
- Do not refactor unrelated code while applying accessibility fixes.
- Keep changes minimal, targeted, and easy to review.

## Procedure
1. Audit structure and interaction map.
- Identify all interactive elements and event handlers.
- Classify controls by role (button, link, input, dialog trigger, toggle, menu item).
- Detect non-semantic interactive elements (`div`/`span` with click handlers).

2. Apply semantic HTML corrections first.
- Replace non-semantic interactive wrappers with native controls where safe.
- Ensure heading levels and landmark usage are meaningful.
- Ensure form controls are associated with labels.

3. Add missing ARIA only where needed.
- Ensure every interactive control has an accessible name.
- Add ARIA relationships (`aria-labelledby`, `aria-describedby`, `aria-controls`) when implied by UI behavior.
- Use state attributes (`aria-expanded`, `aria-pressed`, `aria-selected`, `aria-current`) for stateful controls.
- Avoid redundant ARIA when native semantics already cover behavior.

4. Verify keyboard navigation support.
- Ensure all interactive controls are reachable by Tab.
- Ensure Enter/Space behavior for custom controls when native elements are not possible.
- Ensure Escape handling and focus return for overlays/dialogs.
- Ensure focus trap behavior for modal contexts where applicable.

5. Verify focus visibility and order.
- Preserve or improve visible focus indication.
- Ensure focus order follows visual and DOM reading order.
- Ensure no keyboard trap unless intentional and escapable.

6. Validate without functional drift.
- Confirm business logic paths and handlers are unchanged.
- Keep props, exports, and external contracts stable.
- Run from client:
  - npm run type-check
  - npm run lint

## Decision Branches
- Native element available?
  - Yes (default): prefer native element over ARIA-heavy custom control.
  - No: keep custom element and add proper role, keyboard handlers, and required ARIA states.

- Decorative or informative icon?
  - Decorative: mark as hidden from assistive tech.
  - Informative/action icon: provide accessible label/text association.

- Modal/overlay behavior present?
  - Yes: enforce dialog semantics, escape close, focus trap, and focus restoration.
  - No: avoid unnecessary dialog ARIA.

- Link vs button interaction?
  - Navigation intent: use link.
  - In-place action intent: use button.

## Quality Checks Before Done
1. Every interactive element has correct semantics and accessible name.
2. ARIA usage is minimal and purposeful (no redundant noise).
3. Keyboard navigation works across all reachable controls.
4. Focus behavior is predictable and visible.
5. Manual keyboard walkthrough is completed (Tab, Shift+Tab, Enter, Space, Escape where applicable).
6. No visual design changes introduced.
7. No business logic or data-flow changes introduced.
8. Type-check and lint pass.

## Done Criteria
- Component accessibility issues are fixed with minimal diff.
- Screen-reader relevant semantics are present and coherent.
- Keyboard-only usage is functional for primary interactions.
- Existing functionality and UI appearance remain intact.

## Anti-Patterns To Avoid
- Adding ARIA attributes blindly without matching behavior.
- Replacing controls in ways that change app logic.
- Introducing custom keyboard behavior where native elements already solve it.
- Bundling accessibility fixes with unrelated refactors.

## Example Invocation Prompts
- Audit and fix accessibility in [client/src/components/accessibility/AccessibilityWidget.tsx](../../../client/src/components/accessibility/AccessibilityWidget.tsx) without changing visuals or behavior.
- Review [client/src/components/auth/components/LoginModal.tsx](../../../client/src/components/auth/components/LoginModal.tsx) for semantic HTML, ARIA relationships, and keyboard navigation gaps only.
- Apply critical a11y fixes to a target TSX file, then run type-check and lint in client.
