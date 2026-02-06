# HeartNote - Project Summary

> 🎨 **מפעל הברכות הדיגיטלי** - A digital greeting card factory built with Next.js

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Components](#components)
- [Design System](#design-system)
- [Accessibility](#accessibility)
- [Getting Started](#getting-started)

---

## 🎯 Project Overview

HeartNote is a modern, Hebrew-first (RTL) web application for creating and sharing digital greeting cards. The project emphasizes:

- **Premium Design** - Modern UI with animations, gradients, and glassmorphism
- **Accessibility** - WCAG 2.1 AA compliant with full keyboard navigation
- **Responsiveness** - Seamless experience across iPhone, iPad, and Desktop
- **Dark Mode** - Full support for light and dark themes
- **Hebrew First** - RTL layout with proper Hebrew typography

---

## 🛠 Tech Stack

| Category       | Technology                   |
| -------------- | ---------------------------- |
| **Framework**  | Next.js 14 (App Router)      |
| **Language**   | TypeScript                   |
| **Styling**    | Tailwind CSS                 |
| **Animations** | Framer Motion                |
| **Icons**      | Lucide React                 |
| **Fonts**      | Open Sans (Hebrew optimized) |

---

## 📁 Project Structure

```
client/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── accessibility/      # Accessibility statement
│   │   ├── contact/            # Contact form page
│   │   ├── pricing/            # Pricing plans page
│   │   ├── privacy/            # Privacy policy page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/
│   │   ├── accessibility/      # Skip links, focus trap, live region
│   │   ├── accessibilityPage/  # Accessibility statement components
│   │   ├── auth/               # Login modal, auth inputs
│   │   ├── contact/            # Contact form components
│   │   ├── footer/             # Footer (Desktop/Mobile)
│   │   ├── header/             # Header, nav, theme toggle
│   │   ├── home/               # Home page sections
│   │   ├── pricing/            # Pricing cards and layout
│   │   ├── privacy/            # Privacy policy components
│   │   ├── theme/              # Theme provider
│   │   └── ui/                 # Shared UI components
│   │
│   └── hooks/                  # Custom React hooks
│
└── public/
    └── assets/
        └── fonts/              # Open Sans font files
```

---

## 📄 Pages

### Home (`/`)

- Hero section with animated text and CTA
- "How it Works" steps section
- Gallery teaser with card previews
- Responsive Desktop/Mobile layouts

### Pricing (`/pricing`)

- Three-tier pricing cards (Free, Manager, Business)
- Featured plan highlighting
- Feature comparison with icons
- Hebrew pricing labels

### Contact (`/contact`)

- Contact form with validation
- Fields: Name, Email, Subject, Message
- Hebrew error messages
- Success/error feedback

### Accessibility (`/accessibility`)

- Accessibility statement (הצהרת נגישות)
- Six accessibility features listed
- Contact information for issues
- WCAG 2.1 compliance statement

### Privacy (`/privacy`)

- Privacy policy (מדיניות פרטיות)
- Seven sections covering data handling
- Contact information
- Last updated date

---

## 🧩 Components

### Header

| Component             | Description                         |
| --------------------- | ----------------------------------- |
| `Header.tsx`          | Main header with sticky positioning |
| `Logo.tsx`            | HeartNote logo with gradient        |
| `NavLinks.tsx`        | Navigation links                    |
| `ThemeToggle.tsx`     | Light/dark mode toggle              |
| `AuthButtons.tsx`     | Login and CTA buttons               |
| `HamburgerButton.tsx` | Mobile menu toggle                  |
| `MobileMenu.tsx`      | Slide-out mobile navigation         |

### Footer

| Component              | Description           |
| ---------------------- | --------------------- |
| `FooterDesktop.tsx`    | Desktop footer layout |
| `FooterMobile.tsx`     | Mobile footer layout  |
| `SocialIcons.tsx`      | Social media links    |
| `FooterLinkColumn.tsx` | Link group column     |

### Auth

| Component        | Description           |
| ---------------- | --------------------- |
| `LoginModal.tsx` | Login modal with form |
| `AuthInput.tsx`  | Styled form input     |

### Accessibility

| Component            | Description                        |
| -------------------- | ---------------------------------- |
| `SkipLinks.tsx`      | Skip navigation for keyboard users |
| `VisuallyHidden.tsx` | Screen reader only content         |
| `LiveRegion.tsx`     | Dynamic content announcements      |
| `FocusTrap.tsx`      | Focus trap for modals              |

### UI

| Component    | Description                   |
| ------------ | ----------------------------- |
| `Button.tsx` | Reusable button with variants |

---

## 🎨 Design System

### Colors

| Name             | Light     | Dark       | Usage             |
| ---------------- | --------- | ---------- | ----------------- |
| **Primary Navy** | `#2e3c52` | -          | Text, backgrounds |
| **Coral**        | `#d4826f` | `#e8917a`  | Accents, CTAs     |
| **Background**   | `#faf7f5` | `gray-900` | Page backgrounds  |
| **Header**       | cream     | navy       | Header background |

### Typography

| Element      | Font      | Weight        |
| ------------ | --------- | ------------- |
| **Headings** | Open Sans | Bold (700)    |
| **Body**     | Open Sans | Regular (400) |

```css
.text-hebrew-heading  /* Bold headings */
.text-hebrew-body     /* Regular text */
```

### Spacing & Layout

- **Max Width**: `max-w-7xl` for containers
- **Padding**: `px-4` mobile, `px-6 lg:px-12` desktop
- **Border Radius**: `rounded-xl` to `rounded-2xl`

---

## ♿ Accessibility

### Features Implemented

1. **Skip Links** - Jump to main content, navigation, footer
2. **Keyboard Navigation** - Full Tab navigation support
3. **Focus Indicators** - Coral outline on focus-visible
4. **Screen Reader Support** - ARIA labels in Hebrew
5. **Reduced Motion** - Respects `prefers-reduced-motion`
6. **High Contrast** - Enhanced styles for high contrast mode
7. **Touch Targets** - 44x44px minimum on touch devices
8. **Focus Trap** - Proper modal focus management

### ARIA Labels (Hebrew)

```tsx
aria-label="ניווט ראשי"      // Main navigation
aria-label="כותרת ראשית"     // Main header
aria-label="פתח תפריט"       // Open menu
aria-label="סגור תפריט"      // Close menu
aria-label="תחתית האתר"      // Footer
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Run development server
npm run dev

# Run on LAN (for mobile testing)
npm run dev:lan
```

### Build

```bash
# Production build
npm run build

# Start production server
npm start
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Size   | Device           |
| ---------- | ------ | ---------------- |
| `sm`       | 640px  | Mobile landscape |
| `md`       | 768px  | Tablet           |
| `lg`       | 1024px | Desktop          |
| `xl`       | 1280px | Large desktop    |

### Component Pattern

```tsx
// Responsive wrapper pattern
export function Component() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile ? <ComponentMobile /> : <ComponentDesktop />;
}
```

---

## 📝 Project Rules

All development follows `.agent/workflows/project-rules.md`:

1. **Max 150 lines per file** - Split into smaller components
2. **Modular structure** - types/, constants/, components/ per feature
3. **Hebrew first** - All UI text in Hebrew
4. **Dark mode required** - All components support both themes
5. **Accessibility required** - WCAG 2.1 AA compliance

---

## 🎉 Summary

HeartNote is a fully functional, accessible, and beautifully designed Hebrew web application featuring:

- ✅ 5 complete pages (Home, Pricing, Contact, Accessibility, Privacy)
- ✅ Responsive header with mobile menu
- ✅ Login modal with validation
- ✅ Dark/Light theme toggle
- ✅ Full accessibility support
- ✅ RTL Hebrew layout
- ✅ Modern animations and transitions
- ✅ Production-ready code structure

---

**Built with ❤️ by HeartNote Team**

© 2026 HeartNote. All rights reserved.
