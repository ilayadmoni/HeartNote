---
description: HeartNote project coding standards and UI design rules
---

# HeartNote Project Rules

## 1. Typography & Branding

### Hebrew Text (Open Sans)

| Use Case                | Font Weight | File Path                            |
| ----------------------- | ----------- | ------------------------------------ |
| Large & Medium Headings | **Bold**    | `/assets/fonts/OpenSans-Bold.ttf`    |
| Small/Body Text         | Regular     | `/assets/fonts/OpenSans-Regular.ttf` |
| Very Small Text         | Regular     | `/assets/fonts/OpenSans-Regular.ttf` |

### English Text (Glacial Indifference)

| Use Case            | Font Weight | File Path                                       |
| ------------------- | ----------- | ----------------------------------------------- |
| Headings            | **Bold**    | `/assets/fonts/GlacialIndifference-Bold.otf`    |
| Non-headings (Body) | Regular     | `/assets/fonts/GlacialIndifference-Regular.otf` |

### CSS Utility Classes (Available in globals.css)

```css
/* Hebrew Typography */
.text-hebrew-heading {
  font-family: "OpenSans", sans-serif;
  font-weight: 700;
}

.text-hebrew-body {
  font-family: "OpenSans", sans-serif;
  font-weight: 400;
}

.text-hebrew-small {
  font-family: "OpenSans", sans-serif;
  font-weight: 400;
}

/* English Typography */
.text-english-heading {
  font-family: "GlacialIndifference", sans-serif;
  font-weight: 700;
}

.text-english-body {
  font-family: "GlacialIndifference", sans-serif;
  font-weight: 400;
}
```

---

## 2. Code Architecture & Constraints

### File Length Limit

- **Maximum: 150 lines per file**
- If a file exceeds this limit, immediately refactor and split into smaller components

### Modularity Principles

- Decouple **logic**, **styles**, and **components**
- Ensure high **reusability** and **maintainability**
- Use custom hooks for shared logic (e.g., `useMediaQuery`, `useHeader`)
- Extract constants and utilities into separate files

---

## 3. Feature Structure & Responsiveness

### Directory Structure Template

For every feature, follow this structure:

```
src/
└── components/
    └── feature-name/
        ├── Desktop/
        │   └── FeatureDesktop.tsx      # Desktop-specific implementation
        ├── Mobile/
        │   └── FeatureMobile.tsx       # Mobile-specific implementation
        ├── components/                  # Shared sub-components
        │   ├── SubComponent.tsx
        │   └── index.ts                 # Barrel export
        ├── hooks/                       # Feature-specific hooks (optional)
        │   └── useFeature.ts
        ├── types/                       # Feature-specific types
        │   └── index.ts
        ├── constants/                   # Feature-specific constants
        │   └── index.ts
        ├── Feature.tsx                  # Main export with responsive wrapper
        └── index.ts                     # Barrel export
```

### Responsive Wrapper Pattern

**Every feature must have a main component that switches between Desktop and Mobile:**

```tsx
// Feature.tsx
"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FeatureDesktop } from "./Desktop/FeatureDesktop";
import { FeatureMobile } from "./Mobile/FeatureMobile";
import type { FeatureProps } from "./types";

export function Feature(props: FeatureProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <FeatureMobile {...props} />
  ) : (
    <FeatureDesktop {...props} />
  );
}
```

### Breakpoints

| Device  | Breakpoint          | Tailwind Class      |
| ------- | ------------------- | ------------------- |
| Mobile  | `max-width: 768px`  | Default (no prefix) |
| Tablet  | `769px - 1024px`    | `md:` prefix        |
| Desktop | `min-width: 1025px` | `lg:` prefix        |

---

## 4. Dark Mode Support

### Implementation

This project uses **Next.js Themes** with class-based dark mode:

```tsx
// Provided by ThemeProvider in layout.tsx
import { ThemeProvider } from "@/components/theme";
```

### Styling Pattern

Use Tailwind's `dark:` variant for all color-sensitive styles:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

### Color Guidelines

| Element         | Light Mode                             | Dark Mode                              |
| --------------- | -------------------------------------- | -------------------------------------- |
| **Backgrounds** | `bg-[#faf7f5]` / `bg-white`            | `bg-gray-900` / `bg-[#252d3b]`         |
| **Text**        | `text-[#2e3c52]` / `text-gray-600`     | `text-white` / `text-gray-300`         |
| **Borders**     | `border-gray-200` / `border-[#ebe7e0]` | `border-gray-700` / `border-[#2e3c52]` |
| **Accents**     | `text-[#d4826f]` / `bg-[#d4826f]`      | `text-[#e8917a]` / `bg-[#d4826f]`      |

---

## 5. Current Architecture

### Global Layout Structure

```tsx
// app/layout.tsx
<ThemeProvider>
  <Header /> {/* Sticky header with navigation */}
  <main>{children}</main>
  <Footer /> {/* Footer on every page */}
</ThemeProvider>
```

### Existing Components

| Component            | Path                          | Responsive        | Dark Mode |
| -------------------- | ----------------------------- | ----------------- | --------- |
| **Header**           | `/components/header`          | ✅ Desktop/Mobile | ✅        |
| **Footer**           | `/components/footer`          | ✅ Desktop/Mobile | ✅        |
| **Gallery Template** | `/components/galleryTemplate` | ✅ Desktop/Mobile | ✅        |
| **Theme Toggle**     | `/components/theme`           | ✅                | ✅        |

### Custom Hooks

| Hook            | Path                                    | Purpose                                      |
| --------------- | --------------------------------------- | -------------------------------------------- |
| `useMediaQuery` | `/hooks/useMediaQuery.ts`               | Detect screen size for responsive components |
| `useHeader`     | `/components/header/hooks/useHeader.ts` | Header state management                      |

---

## 6. Execution Priorities

1. **Clean Code** - Readable, maintainable, well-documented
2. **Visual Hierarchy** - Follow typography weights and organizational rules
3. **Responsiveness** - Seamless transitions between all screen sizes using Desktop/Mobile pattern
4. **Dark Mode** - All components must support both light and dark modes
5. **Modularity** - Small, focused, reusable components (max 150 lines)
6. **Hebrew First** - Use `text-hebrew-*` classes for all Hebrew text
7. **Accessibility** - WCAG 2.1 AA compliance (see section 7)

---

## 7. Accessibility (נגישות)

### Core Principles

- **Semantic HTML** - Use proper HTML5 elements (`nav`, `main`, `header`, `footer`, `button`)
- **ARIA Labels** - Add Hebrew ARIA labels for screen readers
- **Keyboard Navigation** - All interactive elements must be keyboard accessible
- **Focus Management** - Visible focus indicators and proper focus trapping for modals

### Available Components

Import from `@/components/accessibility`:

| Component        | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `SkipLinks`      | Skip navigation links for keyboard users |
| `VisuallyHidden` | Hide content visually but keep for SR    |
| `LiveRegion`     | Announce dynamic content changes         |
| `FocusTrap`      | Trap focus within modals/dialogs         |

### Required ARIA Attributes

```tsx
// Buttons with icon-only content
<button aria-label="פתח תפריט">
  <MenuIcon />
</button>

// Expandable elements
<button aria-expanded={isOpen} aria-controls="menu-id">
  Toggle
</button>

// Navigation
<nav aria-label="ניווט ראשי">
  {/* links */}
</nav>

// Main content landmark
<main id="main-content" role="main" tabIndex={-1}>
  {/* page content */}
</main>
```

### Focus Styles

All interactive elements automatically receive focus styles via `globals.css`:

```css
*:focus-visible {
  outline: 2px solid rgb(212, 130, 111);
  outline-offset: 2px;
}
```

### Reduced Motion Support

Animations are automatically disabled for users who prefer reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations disabled */
}
```

### Touch Target Sizing

On touch devices, interactive elements have minimum 44x44px touch targets.

---

## 8. Common Patterns

### Navigation Links

```tsx
<Link
  href="/path"
  className="text-[#2e3c52] dark:text-gray-200 hover:text-[#c4735f] dark:hover:text-[#e8917a] transition-colors duration-200 text-hebrew-body"
>
  קישור
</Link>
```

### Buttons

```tsx
<button className="bg-[#d4826f] hover:bg-[#c4735f] text-white px-5 py-2 rounded-full text-hebrew-body transition-all duration-200">
  לחץ כאן
</button>
```

### Cards

```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300">
  {/* Card content */}
</div>
```
