# Mobile WSOD — Round 2 Plan

## Context

The previous fix added a React error boundary inside `GalleryLoadingWrapper` and a 5-second safe-mode fallback inside the gallery tree. The user reports the same result on mobile: animated loader briefly, then a permanent blank screen. None of the boundary UI or safe-mode UI ever appears.

That can only mean the failure is happening **above** the React boundary — i.e. before the gallery tree ever renders. Investigation found the root cause: the pre-hydration `InitialLoader` overlay (rendered by `client/src/components/initialLoader/InitialLoader.tsx`).

`InitialLoader` paints a fixed-position `#initial-loader` div at `z-index: 99999` with a solid `#faf7f5` background. An inline `<script>` removes the `il-hidden` class only when **`Promise.all([document.fonts.ready, windowLoad])`** resolves. On iOS Safari (and some Android Chrome variants) with Hebrew custom fonts:

- `document.fonts.ready` is known to hang indefinitely under specific conditions (private mode, strict ITP, slow network for any font URL).
- The inline script has **no timeout** — if either promise never settles, `il-hidden` is never added, the overlay never fades, the page is hidden forever.
- The off-white `#faf7f5` background reads as "white screen" to the user.

A secondary risk: even if the loader does fade, hydration could throw inside one of the root-layout providers (`ThemeProvider`, `AccessibilityProvider`, `AuthProvider`, `QueryProvider`, `FontReadyGateway`, `CookieBanner`) — all sit **above** the gallery's `MobileErrorBoundary`, so a provider crash also produces a blank page.

Goal: make the pre-hydration overlay fail-open within a hard time limit, catch any provider-level render crash with a visible error UI, and log enough breadcrumbs to identify the failing line on a real device.

## Files to modify

1. `client/src/components/initialLoader/InitialLoader.tsx` — harden the inline bootstrap script.
2. `client/src/app/layout.tsx` — wrap the entire provider tree in a top-level error boundary.
3. `client/src/components/ErrorBoundary/MobileErrorBoundary.tsx` — already exists from previous round, reuse as-is.
4. `client/src/components/ErrorBoundary/SafeModeFallback.tsx` — already exists, reuse.

No new components needed beyond what the previous round added.

## Changes

### 1. `InitialLoader.tsx` — bulletproof inline script

Replace the `LOADER_SCRIPT` body so that:

- The whole script body is wrapped in one outer `try/catch`. The catch removes `#initial-loader` immediately and logs `[MOBILE-DEBUG] InitialLoader script crashed:` with the error message.
- A **hard 4-second `setTimeout`** is started at the top of the script. When it fires, it forces `il-hidden` and removes the element regardless of whether fonts/load resolved. Logs `[MOBILE-DEBUG] InitialLoader hard-timeout fired (fonts/load stalled)`.
- The existing `Promise.all` path remains the happy path; it just races the timeout. Both paths use the same `hide()` function and a `done` flag so we don't double-remove.
- `document.fonts.ready` is wrapped: `var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();` and `.catch(function(){})` is appended so a rejected promise can't deadlock the `Promise.all`.
- The `localStorage` / `matchMedia` block at the top stays inside its own try/catch (already is) but the catch is widened to include `matchMedia` too.
- Add a one-line `[MOBILE-DEBUG] InitialLoader hidden via <reason>` log when the overlay is finally hidden, where `<reason>` is `"fonts+load"` or `"timeout"` or `"error"`.

This single change is the highest-leverage fix — it guarantees the page reveals within 4 s no matter what, on every browser.

### 2. `app/layout.tsx` — top-level error boundary

Import `MobileErrorBoundary` from `@/components/ErrorBoundary/MobileErrorBoundary` and wrap the entire `<ThemeProvider>...</ThemeProvider>` subtree in it (scope `"RootLayout"`). The custom fallback should render `SafeModeFallback` so the user gets a visible refresh button instead of a blank page if any provider throws during hydration.

The boundary must live inside `<body>` and below `<InitialLoader />` so it can render visibly once the loader fades. It must wrap *everything* below the GTM scripts — i.e. ThemeProvider, AccessibilityProvider, FontReadyGateway, QueryProvider, AuthProvider, CookieBanner, AccessibilityWidget. `Toaster`, `StructuredData`, and `GTMVerifierWrapper` can stay outside since they don't render visible app shell.

### 3. `[MOBILE-DEBUG]` logging breadcrumbs

Add console logs that survive past hydration so a user with the inspector open can pinpoint where it stalled:

- `[MOBILE-DEBUG] InitialLoader script start`
- `[MOBILE-DEBUG] InitialLoader hidden via <reason>`
- `[MOBILE-DEBUG] InitialLoader script crashed:` (in outer catch)
- `[MOBILE-DEBUG] RootLayout boundary caught:` (componentDidCatch in MobileErrorBoundary already does this — scope is `"RootLayout"`)
- Existing `[MOBILE-DEBUG] Safe-mode timeout` from `useSafeModeTimeout` stays.

### 4. Already-applied previous-round changes (kept as-is)

- `MobileErrorBoundary.tsx`, `SafeModeFallback.tsx`, `useSafeModeTimeout.ts`
- `GalleryLoadingWrapper.tsx` — gallery boundary + 5 s safe-mode
- `WeddingGlass.tsx` — wrapped in boundary
- `fireShatterConfetti.ts` — try/catch + `useWorker:false`

These are still useful as a second line of defense; the new top-level boundary is what catches provider-level crashes the gallery boundary can't see.

## Why this should fix it (the two failure modes)

| Failure mode | What user sees | What fixes it |
|---|---|---|
| `document.fonts.ready` or `window load` never resolves | Loader animates briefly, then off-white overlay forever | Hard 4 s timeout in inline script forces `il-hidden` |
| Provider hydration throws (e.g. Supabase init, ThemeProvider localStorage) | Loader fades, then truly blank `<body>` | Top-level `MobileErrorBoundary` shows refresh UI |

Either failure mode produces logs prefixed `[MOBILE-DEBUG]` that the user can read in the mobile inspector to identify the exact line.

## Verification

1. `cd client && npm run build && npm run start` (or `npm run dev`) on the dev machine.
2. From a real mobile device on the same LAN (or via Chrome DevTools device emulation with cache disabled and "slow 3G" throttling to simulate font-stall):
   - Open the production-built site.
   - Confirm: loader appears, then within ≤ 4 s the gallery (or an error UI) is visible. **No permanent blank screen.**
   - Open mobile inspector (Safari Web Inspector on iOS, `chrome://inspect` on Android) and confirm a `[MOBILE-DEBUG] InitialLoader hidden via fonts+load` (happy path) or `[MOBILE-DEBUG] InitialLoader hidden via timeout` (proves the safety net engaged) log line is present.
3. Force-test the timeout path locally by temporarily replacing `document.fonts.ready` in the script with `new Promise(function(){})` (a never-resolving promise) and verifying the loader still removes after 4 s. Revert before commit.
4. Force-test the boundary path by temporarily throwing inside `AuthProvider`'s render and confirming the `SafeModeFallback` UI with the refresh button appears instead of a blank page. Revert before commit.
5. Run `npm run type-check` and `npm run lint` from `client/`.

## File length budget (modular-code-architect, 150 lines)

- `InitialLoader.tsx` is currently 277 lines (over budget already, but pre-existing). The script change adds ~10 lines. If the file must be brought under 150, split `LOADER_CSS` and `LOADER_SCRIPT` into sibling files (`InitialLoader.css.ts`, `InitialLoader.script.ts`) — but treat that as out of scope unless the user asks; the task is fixing the WSOD, not refactoring the loader.
- `app/layout.tsx` is 152 lines and will gain ~3 lines (import + wrap). Acceptable.
