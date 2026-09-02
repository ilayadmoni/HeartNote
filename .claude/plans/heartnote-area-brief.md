# Area Agent Contract - HeartNote design refactor + i18n

You are one of eight parallel Sonnet executors. You own ONLY the folders listed in your task prompt. Never edit files outside them (other agents own them; conflicts will be discarded). Do NOT run the dev server, do NOT git commit, do NOT install packages, do NOT ask questions. Make decisions and note them in your final report.

## Read first (in this order)
1. `D:\HeartNote\CLAUDE.md` (conventions; 150-line file cap; zero `any`; logger not console; `@/` aliases)
2. `D:\HeartNote\.claude\plans\heartnote-design-refactor-i18n.md` (plan + design read + assumptions)
3. `client/tailwind.config.ts`, `client/src/styles/tokens/palette.ts`, `client/src/styles/tokens/type.ts`, `client/src/app/globals.css`
4. `client/src/lib/motion.ts`, `client/src/components/ui/Button.tsx`, `Card.tsx`, `Input.tsx`
5. `client/src/i18n/*.ts`, `client/src/lib/i18n/server.ts`, `client/src/messages/he/common.json`, `en/common.json`, `he/nav.json`, `en/nav.json`, `he/meta.json`, `en/meta.json`

## Stack facts
- Next.js 14.2 App Router, React 18, TypeScript strict, Tailwind 3.4, Framer Motion 11, next-intl 4, lucide-react, sonner. Plain Postgres via Prisma (no Supabase).
- Routes live under `client/src/app/[locale]/…`. Hebrew = default locale, unprefixed. English = `/en/...`.
- Navigation: import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (never `next/link` / `next/navigation` for those). `notFound`, `useSearchParams`, `useParams` still come from `next/navigation`.
- Translations: client components `const t = useTranslations("<ns>")` from `next-intl`; server components `const t = await getTranslations("<ns>")` from `next-intl/server`; server actions `const t = await getActionT("<ns>")` from `@/lib/i18n/server`. Locale: `useLocale()` / `getLocale()`. Direction: `dirFor(locale)` from `@/i18n/locale`.
- Page metadata: `export async function generateMetadata({ params })` → `const { locale } = await params; return buildPageMetadata({ locale, path: "/gallery", key: "gallery" })` from `@/lib/seo/metadata` (keys already exist in `messages/*/meta.json`: home, gallery, pricing, faq, contact, privacy, terms, accessibility, profile, demo, create, share, login, completeProfile, notFound). Add `setRequestLocale(locale)` at the top of server pages that use `generateStaticParams`-able routes.
- Message files: `client/src/messages/he/<ns>.json` and `client/src/messages/en/<ns>.json`. Namespaces exist as empty `{}` files: common, nav, footer, home, gallery, pricing, profile, editor, auth, share, legal, faq, contact, demo, templates, errors, meta, accessibility. Only edit the namespaces assigned to you (plus reading `common` for shared actions like close/cancel/copy).
- ICU syntax: `{name}`, plurals `{count, plural, one {# greeting} other {# greetings}}`. Rich text: `t.rich("key", { b: (c) => <b>{c}</b> })`.

## Design rules (tasteskill + impeccable, non-negotiable)
- Tokens only. Replace every `bg-[#…]`, `text-[#…]`, `border-[#…]`, `from-[#…]`, inline `style={{ color/background/fontFamily }}` in UI chrome with: `bg-surface`, `bg-surface-raised`, `bg-surface-sunken`, `text-ink`, `text-ink-muted`, `text-ink-subtle`, `bg-accent`, `text-accent`, `bg-accent-soft`, `border-line`, `border-line-strong`, or brand scales `brand-*`, `salmon-*`, `cream-*`, `navy-*`. Dark mode is handled by the CSS variables, so drop paired `dark:` classes when a semantic token covers both. Exception: colors chosen BY THE USER inside a card template (metadata colors) stay dynamic.
- Typography: `text-display-xl/lg/md`, `text-title-lg/md/sm`, `text-body-lg/md/sm`, `text-caption`, `text-overline`. Never raw `text-4xl font-black` stacks. Body copy `max-w-prose`. Remove `.text-hebrew-heading` / `.text-hebrew-body` usages (fonts are global now); use `font-display` for the wordmark / hero display only.
- Spacing rhythm: sections `py-section` or `py-section-sm`, shells `section-shell` (or `max-w-shell mx-auto px-gutter`). No ad-hoc `py-7`, `px-9`, `mt-[13px]`.
- Shape lock: buttons `rounded-pill`, cards `rounded-card`, inputs/controls `rounded-control`. Nothing else.
- Elevation: `shadow-soft`, `shadow-card`, `shadow-lift`, `shadow-glow` / `shadow-glow-sm` (accent CTAs). Never `shadow-black/...` or pure black.
- Motion: use `fadeUp`, `stagger`, `pressable`, `transitions`, `viewportOnce`, `useMotionOk()` from `@/lib/motion`. Gate every animation on `useMotionOk()` (replaces `useAccessibility().settings.stopAnimations` checks). Hover lift `y: -2`, press `scale: 0.98`. No `hover:scale-105`, no infinite loops on informational content.
- RTL/LTR: replace physical direction classes with logical ones: `pl-`→`ps-`, `pr-`→`pe-`, `ml-`→`ms-`, `mr-`→`me-`, `left-`→`start-`, `right-`→`end-`, `border-l`→`border-s`, `border-r`→`border-e`, `rounded-l-*`→`rounded-s-*`, `rounded-r-*`→`rounded-e-*`, `text-left`→`text-start`, `text-right`→`text-end`, `space-x-*`→`gap-*` (with flex) . Remove hardcoded `dir="rtl"` on layout containers (html/body already carry it); keep `dir` only where content direction is intentionally fixed (e.g. an LTR phone number or an English wordmark). Directional icons (ArrowLeft/ArrowRight, chevrons) must flip: use `<ArrowLeft className="rtl:rotate-0 ltr:rotate-180" />` style or pick the icon from `locale`; simplest: `className="ltr:-scale-x-100"` on an arrow drawn for RTL. Verify `translate-x` animations are direction-aware (negate for LTR via `useLocale()` or use `rtl:`/`ltr:` variants).
- Mobile: inputs keep ≥16px (global rule, don't override font-size on inputs/selects/textareas). Any `fixed` element (modal, bottom sheet, toast, sticky bar) that lives under a Framer Motion `transform` ancestor must render through `createPortal(document.body)`. Use `min-h-[100dvh]` never `h-screen` for full-height sections.
- Copy: no emoji as icons or inside buttons (use lucide). No em dashes (`—`) or en dashes anywhere in messages; use `-`, commas or periods. Max 1 accent color. No gradient text (`bg-clip-text`). No `border-l-4` style side stripes. No three-identical-card feature rows without visual variation.
- Premium feel: Lite/Premium tiers should read as an upgrade (accent surfaces, badge, elevated card), Free as the calm baseline. Watermark / lock states should feel gentle, not punitive.

## i18n rules
- Extract EVERY user-facing Hebrew string in your folders (JSX text, `aria-label`, `title`, `placeholder`, `alt`, toast messages, `ActionError` messages that reach the client, constants files, config label/placeholder/hint fields, metadata). Grep with `python -c` or ripgrep for the Hebrew block `[\u0590-\u05FF]` and work through every hit.
- Constants/config objects (e.g. `NAV_ITEMS`, `PRICING_PLANS`, editor field configs, FAQ data): replace literal strings with message KEYS (e.g. `labelKey: "fields.recipientName"`) and resolve with `t(labelKey)` where rendered. If a config is consumed in many places, export a hook like `useLocalizedPlans()` that maps keys → strings once.
- Content that a user typed, AI-generated greeting text, or template metadata rendered for the recipient is NEVER translated. Sample/default/placeholder copy that ships with the product IS translated.
- English must read like a native copywriter for a warm, playful greeting-card brand. Not literal. Keep the Hebrew voice: friendly, second person plural becomes natural English "you". Keep interpolations identical in both files.
- Keys: camelCase, grouped by screen section (`hero.title`, `hero.cta`, `steps.1.title`). Same key tree in `he` and `en`; every key present in both.
- After extraction, run this from `client/` and make sure it reports zero hits for your folders (except user-content defaults you deliberately kept, which you must list): `python -c "import re,sys,os;heb=re.compile('[\u0590-\u05FF]');[print(p,i+1,l.strip()[:80]) for p in sys.argv[1:] for i,l in enumerate(open(p,encoding='utf-8')) if heb.search(l)]" <files>`.
- Keep RTL-only typographic hacks (e.g. `unicode-bidi: plaintext` classes) only if they don't break LTR.

## File discipline
- Hard cap 150 lines per file. If a file you touch is above 130 lines, split it (sub-components into `components/`, logic into `hooks/`, data into `constants/`). Barrel `index.ts` re-exports only.
- Zero `any`. Explicit return types on exported functions (`: JSX.Element`, `: Promise<ActionResult<T>>`).
- Server actions keep `protectedAction` + `validateOrigin()` + Zod. Never throw raw errors to the client.
- Keep `"use client"` only where needed.

## Verification before you report
1. `cd D:\HeartNote\client && npm run type-check` must pass (fix anything in YOUR folders; if a failure is in another agent's folder, mention it and continue).
2. Hebrew grep on your folders → zero (or listed exceptions).
3. Physical-direction grep on your folders → zero: `grep -rnE "\b(pl|pr|ml|mr|left|right|border-l|border-r|rounded-l|rounded-r|text-left|text-right)-[a-z0-9\[]" <folders>` (exclude `rtl:`/`ltr:` variant usages you added intentionally and CSS transforms like `-translate-x`).
4. Arbitrary hex grep on your folders → only user-selected template colors remain.

## Report format (final message, concise)
- Files changed / created / split (paths)
- Namespaces + key count added (he/en)
- Design changes summary (3-6 bullets)
- Assumptions & anything left untranslated (with reason)
- type-check result
