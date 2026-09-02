# HeartNote Design Refactor + i18n (Hebrew / English)

> **For agentic workers:** Opus wrote this plan. Sonnet executes it task-by-task (superpowers:subagent-driven-development). Steps use `- [ ]` checkboxes. Update this file as facts are learned; do not re-plan from scratch.

**Goal:** Raise HeartNote's visual language to a paid-product tier (tokens, typography, rhythm, motion) and add full Hebrew/English i18n with correct RTL/LTR switching, per-locale SEO, and a persistent switcher.

**Tech stack (verified):** Next.js **14.2.35** App Router (brief said 15; repo is 14.2 - next-intl 4.x supports it), React 18, TypeScript strict, Tailwind 3.4 (logical props `ms-/me-/ps-/pe-/start-/end-` available), Framer Motion 11, NextAuth v5 + Prisma 6 on plain Postgres (`db/schema.sql` + `db/<date>_<slug>.sql` migrations), lucide-react, sonner, Zod 4.

---

## Skill resolution log (mandatory pre-flight)

| Requested | Resolved path | Status |
|---|---|---|
| `tasteskill` | `D:\HeartNote\.agents\skills\design-taste-frontend\SKILL.md` (via `.claude/skills/design-taste-frontend` symlink; project-level, the only taste skill installed; not present in global path) | loaded, treated as aesthetic authority |
| `frontend-design` | **not installed anywhere** (`C:\Users\ilaya\.claude\skills`, `C:\Users\ilaya\.agents\skills`, project). Substituted with `impeccable` (`C:\Users\ilaya\.agents\skills\impeccable`, global symlink) design laws + `high-end-visual-design` (project). Impeccable's interactive gates (PRODUCT.md / shape approval) skipped per autonomy directive. | substituted, reported |
| `ui-ux-pro-max` | `C:\Users\ilaya\.claude\skills\ui-ux-pro-max\SKILL.md` | loaded |
| `modular-code-architect` | `C:\Users\ilaya\.claude\skills\modular-code-architect\SKILL.md` | loaded |
| `typescript-strict` | `C:\Users\ilaya\.claude\skills\typescript-strict.skill` | loaded |
| `next-performance` | `C:\Users\ilaya\.claude\skills\next-performance.skill` | loaded |
| `caveman` | `C:\Users\ilaya\.claude\skills\caveman` (hook-activated) | active |
| `supabase-best-practices` | intentionally NOT loaded (project is plain Postgres + Prisma) | skipped by brief |

No project-level overrides exist for the four global skills.

---

## Design Read (tasteskill §0.B)

Reading this as: **redesign-preserve** of a Hebrew-first premium-consumer greeting-card SaaS for gift-givers (mobile-heavy, emotional moments), with a warm, playful-but-polished language, leaning toward Tailwind tokens + Framer Motion, brand palette terracotta `#D85A30` / salmon `#C47A5A` / cream `#F5EDE8` (explicitly named by brief - palette override justified), navy ink retained for text.

**Dials:** `DESIGN_VARIANCE 6` / `MOTION_INTENSITY 6` / `VISUAL_DENSITY 3`.

Audit of current state:
- Tokens: `coral` (#d4826f salmon scale), `navy`, unused pink `primary` and purple `secondary` (AI-default leftovers, 4 usages), Inter body font declared but `.text-hebrew-*` utilities force Open Sans Hebrew everywhere.
- ~530 arbitrary hex classes (`bg-[#…]`, `text-[#…]`) in chrome components; 185 physical direction classes across 82 files; `dir="rtl"` hardcoded on `<body>`, header, footer.
- Motion: ad-hoc `whileHover scale 1.05` everywhere, no shared easing, no reduced-motion discipline beyond the a11y toggle.
- Shape system: mixed (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`). Lock: **buttons pill, cards 24px, controls 14px**.
- Copy tells to remove: emoji in CTAs ("תראו לי דוגמה 👀"), emoji-as-icon in badges.

---

## Affected Files (by task)

### Task 0 - Infra (executed by orchestrator, single-threaded, committed first)
| File | Action |
|---|---|
| `client/package.json` | add `next-intl@^4.14` |
| `client/next.config.js` | wrap with `createNextIntlPlugin("./src/i18n/request.ts")` |
| `client/src/i18n/routing.ts` | `defineRouting({ locales: ["he","en"], defaultLocale: "he", localePrefix: "as-needed", localeCookie: { maxAge: 1y } })` |
| `client/src/i18n/navigation.ts` | `createNavigation(routing)` → `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` |
| `client/src/i18n/request.ts` | `getRequestConfig` loading `messages/<locale>/*.json` (namespaced, merged) |
| `client/src/i18n/locale.ts` | `Locale` type, `LOCALES`, `dirFor(locale)`, `isLocale()` |
| `client/src/messages/{he,en}/<ns>.json` | namespaces: `common, nav, footer, home, gallery, pricing, profile, editor, auth, share, legal, faq, contact, demo, templates, errors, meta, accessibility` |
| `client/src/middleware.ts` | compose next-intl middleware + existing auth locks (strip locale prefix before matching) |
| `client/src/app/[locale]/layout.tsx` | moved root layout; `lang`/`dir` from locale, `NextIntlClientProvider`, `generateStaticParams`, per-locale `generateMetadata` with `alternates.languages` (hreflang) |
| `client/src/app/[locale]/(main)/**`, `[locale]/(public)/**`, `[locale]/login`, `[locale]/auth/auth-code-error`, `[locale]/not-found.tsx`, `[locale]/error.tsx`, `[locale]/[...rest]/page.tsx` | `git mv` from `src/app/…` (api/, auth/verify/, robots.ts, sitemap.ts, css stay at root) |
| `client/src/app/sitemap.ts` | emit `he` + `/en` URLs with `alternates.languages` |
| `client/src/lib/i18n/server.ts` | `getActionT(ns)` helper for server actions (`getTranslations`) |
| codemod | replace `next/link` → `@/i18n/navigation` (26 files), `useRouter/usePathname/redirect` from `next/navigation` → `@/i18n/navigation` (45 files; keep `notFound`, `useSearchParams`, `useParams` from next) |
| `client/src/components/header/components/LanguageSwitcher.tsx` | pill toggle HE/EN, `router.replace(pathname, { locale })`, persists to profile when signed in |
| `client/src/actions/profile/setLocale.ts` + `db/20260902_add_profile_locale.sql` + `prisma/schema.prisma` | `locale TEXT NOT NULL DEFAULT 'he' CHECK (locale IN ('he','en'))`; `protectedAction` + `validateOrigin` + Zod |
| `client/src/lib/validations/profile.ts` | `localeSchema` |

### Task 1 - Design system tokens (orchestrator)
| File | Action |
|---|---|
| `client/tailwind.config.ts` | **rewrite**: `brand` (terracotta #D85A30 scale), `salmon` (#C47A5A), `cream` (#F5EDE8), keep `navy` (rename semantic `ink` alias), semantic CSS-var colors `surface/surface-raised/ink/ink-muted/accent/accent-hover/accent-soft/line`; delete `primary`/`secondary`; `coral` → alias of `salmon` (legacy compat); fontFamily `display`/`body`; fontSize scale `display-xl…caption` with line-heights; `borderRadius` `control 14px / card 24px / pill`; tinted `boxShadow` `soft/card/lift/glow`; `transitionTimingFunction` `out-quint`; spacing `section` (clamp); keyframes retained |
| `client/src/app/globals.css` | semantic vars (light/dark), body font = Open Sans Hebrew, remove gradient-text utilities (impeccable ban), `.btn-*` rewritten on tokens, `.surface-card`, `.section-shell` |
| `client/src/lib/motion.ts` | shared variants: `fadeUp`, `stagger`, `pressable`, `EASE_OUT_QUINT`, `useMotionOk()` (a11y + reduced motion) |
| `client/src/components/ui/Button.tsx`, `Card.tsx`, `Input.tsx` | rebuilt on tokens; Button variants `primary/secondary/ghost/danger`, pill, pressable |

### Task 1+2 - Per-area refactor (parallel Sonnet agents, disjoint folders; each agent: tokens + logical props + string extraction + he/en JSON for its namespace)
| Area | Folders | Namespace |
|---|---|---|
| A. Shell | `components/header`, `components/footer`, `components/welcomeSplash`, `components/cookieBanner`, `components/initialLoader`, `components/accessibility`, `components/theme`, `app/[locale]/not-found.tsx`, `error.tsx` | `nav, footer, common, accessibility` |
| B. Home + Demo | `components/home`, `components/demo`, `app/[locale]/(public)/demo` | `home, demo` |
| C. Gallery | `components/galleryTemplate`, `components/GallerySearchBar`, `app/[locale]/(main)/gallery` | `gallery` |
| D. Editor + Preview | `components/editor`, `app/[locale]/(main)/create`, `preview`, `preview-frame`, `components/ui/UpgradeSlideOver.tsx`, `BottomSheet.tsx` | `editor` |
| E. Pricing + Profile | `components/pricing`, `components/profile`, `app/[locale]/(main)/pricing`, `profile`, `hooks/usePricingUpgrade.ts` | `pricing, profile` |
| F. Auth + Actions | `components/auth`, `contexts`, `actions/*` (server-side messages via `getActionT`), `lib/email/authEmails.ts`, `app/[locale]/login`, `complete-profile`, `auth/auth-code-error` | `auth, errors` |
| G. Content pages | `components/faq`, `contact`, `privacy`, `terms`, `accessibilityPage`, matching routes | `faq, contact, legal` |
| H. Share + Templates chrome | `app/[locale]/(public)/p`, `components/templates/**` (chrome strings only: buttons, labels, fallbacks; never user content), `constants/colors.ts` | `share, templates` |

### Task 3 - Verification
| File | Action |
|---|---|
| `client/e2e/i18n-visual.spec.ts` + `playwright.config.ts` (devDependency `@playwright/test`, already 1.62 via npx) | screenshot matrix: routes × {he,en} × {mobile 390×844, desktop 1440×900}; asserts `html[lang]`, `html[dir]`, no horizontal overflow, no untranslated Hebrew in EN DOM (regex), no `—` |
| `.claude/plans/logs/heartnote-design-refactor-i18n-<ts>.log` | checklist |

---

## Steps

### Task 0 - Infra
- [ ] 0.1 `npm i next-intl@^4.14 -w` (from `client/`), `npm i -D @playwright/test@1.62.1`
- [ ] 0.2 Create `src/i18n/{routing,navigation,request,locale}.ts`, `src/messages/{he,en}/*.json` skeletons (all namespaces, `{}` bodies)
- [ ] 0.3 `git mv` route tree under `src/app/[locale]/`; new `[locale]/layout.tsx` (html/body, `dir`, provider, hreflang metadata), `[locale]/[...rest]/page.tsx` → `notFound()`
- [ ] 0.4 Middleware composition; matcher excludes `api|_next|assets|robots|sitemap|auth/verify|.*\..*`
- [ ] 0.5 Codemod navigation imports; keep `notFound`, `useSearchParams`, `useParams`
- [ ] 0.6 Locale persistence: Prisma column + `db/` migration + `setLocale` action + `LanguageSwitcher`
- [ ] 0.7 `type-check` + `build` green; commit `feat(i18n): locale routing, message catalog skeleton, switcher`

### Task 1 - Tokens
- [ ] 1.1 Rewrite `tailwind.config.ts` + `globals.css` semantic vars; grep-verify no `primary-`/`secondary-` remains
- [ ] 1.2 `src/lib/motion.ts` shared variants + `useMotionOk`
- [ ] 1.3 Rebuild `ui/Button`, `ui/Card`, `ui/Input` on tokens
- [ ] 1.4 `type-check`; commit `feat(design): brand token system, motion primitives, ui primitives`

### Task 1+2 - Areas A..H (parallel Sonnet, one agent per area)
Each agent brief (identical contract):
1. Read `CLAUDE.md`, this plan, `tailwind.config.ts`, `globals.css`, `src/lib/motion.ts`, `src/i18n/*`.
2. For every file in owned folders: replace arbitrary hex + physical direction classes with tokens/logical props; apply type scale, spacing rhythm, shape lock (pill buttons / 24px cards / 14px controls), tinted shadows, motion via `src/lib/motion.ts`; remove emoji-as-icon, `—`.
3. Extract every user-facing Hebrew string to `src/messages/he/<ns>.json`; write natural English in `src/messages/en/<ns>.json` (native romantic-greetings tone, not literal). Use `useTranslations("<ns>")` in client components, `getTranslations` in server components, `getActionT` in actions. Config/constant objects → store message keys, resolve at render.
4. Keep every file ≤150 lines (split when approaching 130). Zero `any`. Explicit return types on exported fns.
5. Run `npm run type-check` from `client/` before reporting. Report: files touched, keys added, assumptions.
- [ ] A  - [ ] B  - [ ] C  - [ ] D  - [ ] E  - [ ] F  - [ ] G  - [ ] H
- [ ] Merge check: `type-check`, `lint`, grep for leftover Hebrew in `.tsx` outside `messages/` (allowed: template *default sample content* fed to previews, `constants/colors.ts` handled via `nameKey`)
- [ ] Commit per area (`feat(design+i18n): <area>`)

### Task 3 - Playwright verification
- [ ] 3.1 Start Postgres (docker compose) + `next dev`; seed check (`templates` rows exist)
- [ ] 3.2 Run spec matrix; review every screenshot for RTL/LTR breaks, clipped English, spacing, motion glitches
- [ ] 3.3 Fix → rerun until clean
- [ ] 3.4 `type-check`, `lint`, `build`; write log with checklist

---

## Risks / Edge Cases / Assumptions (decisions made without asking)

1. **Next 14.2, not 15.** Brief assumed 15; no upgrade performed (out of scope, risky). next-intl 4.14 peer-supports `^14`.
2. **Routing mode `as-needed`:** Hebrew URLs unchanged (`/gallery`, `/p/<id>`), English prefixed (`/en/gallery`). Preserves all shared links and SEO equity. `hreflang` `he-IL`, `en`, `x-default → he`.
3. **First-visit locale:** cookie → `Accept-Language` (next-intl matcher, only exact `en*` match flips to English) → `he`. Signed-in users' DB `locale` is applied by the switcher writing both cookie and profile; cross-device sync only on explicit switch (middleware is edge and cannot query Prisma).
4. **User content is never translated.** Card metadata, sample defaults typed by users, and AI-generated greetings stay as authored. Template *chrome* (buttons, hints, empty states) is translated.
5. **Template default sample text** (preview data, editor placeholders) is translated because it is UI copy the user sees before typing.
6. **Fonts:** Open Sans Hebrew covers Latin; no new font. Glacial Indifference stays for brand wordmark/display Latin. tasteskill's "avoid Inter" satisfied by removing Inter as body default.
7. **Palette:** brief names terracotta/salmon/cream, so the premium-consumer palette ban override applies. Navy ink retained for contrast (WCAG AA on cream).
8. **Dark mode retained** (existing toggle); tokens carry both modes via CSS vars.
9. **Pre-existing >150-line files (58)**: areas split what they touch; untouched template internals are left as-is and listed in the log (splitting all 58 blindly risks regressions in canvas/animation templates).
10. **Server-action error strings**: translated via request locale (`getTranslations`); `useServerAction` unchanged.
11. **`(public)/p/[slug]` forces light mode and renders inside `[locale]`**; `dir` follows the viewer's locale, but template internals that are inherently Hebrew content keep `dir="auto"` on text nodes (`unicode-bidi: plaintext` already present).
12. **Playwright run needs a live DB.** If Postgres is unreachable, DB-backed routes (gallery, create, p/) are verified against the demo/preview data and the gap is reported.
13. **`impeccable` gates** (PRODUCT.md, shape approval) intentionally bypassed; its design laws (no gradient text, no side-stripe borders, OKLCH-tinted neutrals, no em dashes) applied.
14. **Em dash** appears in existing Hebrew copy occasionally; catalog rewrites use `-` or punctuation per tasteskill §9.G.

## Rollback
- All work on `dev`, one commit per task/area. `git revert <sha>` per commit; infra commit reverts route move cleanly (`git mv` preserved history).
- DB: `ALTER TABLE profiles DROP COLUMN locale;` (migration file documents reverse).
- No `main` interaction.
