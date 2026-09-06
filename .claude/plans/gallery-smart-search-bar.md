# Gallery Smart Search Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real-time, RTL-aware smart search bar to the gallery page that filters templates by title, description, and categories, combined with the existing tab filter.

**Architecture:** State lifted to `GalleryTemplate` (index.tsx) — `activeTab`, `searchQuery`, `enrichedTemplates`, and `filteredTemplates` all live there. Desktop and Mobile become pure display components receiving pre-filtered data. `useGallerySearch` hook owns all filter logic (tab + debounced search). `GallerySearchBar` is a controlled input component rendered inside Desktop and Mobile after FilterTabs.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS 3.4, Framer Motion 11, Vitest + Testing Library, `@/lib/utils.ts` debounce utility (already exists).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `client/src/components/GallerySearchBar/GallerySearchBar.types.ts` | Props + internal types for search bar |
| Create | `client/src/components/GallerySearchBar/useGallerySearch.ts` | Debounced filter logic (tab + query) |
| Create | `client/src/components/GallerySearchBar/GallerySearchBar.tsx` | Controlled RTL input UI with search icon + clear button |
| Create | `client/src/components/GallerySearchBar/useGallerySearch.test.ts` | Unit tests for filter hook |
| Create | `client/src/components/GallerySearchBar/index.ts` | Barrel export |
| Modify | `client/src/components/galleryTemplate/types/index.ts` | Add `GalleryTemplateViewProps` interface |
| Modify | `client/src/components/galleryTemplate/index.tsx` | Lift state: activeTab, searchQuery, useActiveTemplates, tabs, useGallerySearch |
| Modify | `client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx` | Accept `GalleryTemplateViewProps`, remove inline filter logic, add `GallerySearchBar` |
| Modify | `client/src/components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx` | Accept `GalleryTemplateViewProps`, remove inline filter logic, add `GallerySearchBar` |

---

## Task 1: Types — GallerySearchBar.types.ts + GalleryTemplateViewProps

**Files:**
- Create: `client/src/components/GallerySearchBar/GallerySearchBar.types.ts`
- Modify: `client/src/components/galleryTemplate/types/index.ts`

- [ ] **Step 1: Create GallerySearchBar.types.ts**

```typescript
// client/src/components/GallerySearchBar/GallerySearchBar.types.ts

export interface GallerySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
```

- [ ] **Step 2: Add GalleryTemplateViewProps to galleryTemplate/types/index.ts**

Add at the bottom of `client/src/components/galleryTemplate/types/index.ts` (after line 90):

```typescript
export interface GalleryTemplateViewProps {
  className?: string;
  onTemplateClick?: (template: Template) => void;
  templates: Template[];
  loading: boolean;
  error: string | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: FilterTab[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/GallerySearchBar/GallerySearchBar.types.ts
git add client/src/components/galleryTemplate/types/index.ts
git commit -m "feat(gallery-search): add GallerySearchBarProps and GalleryTemplateViewProps types"
```

---

## Task 2: useGallerySearch hook + tests

**Files:**
- Create: `client/src/components/GallerySearchBar/useGallerySearch.ts`
- Create: `client/src/components/GallerySearchBar/useGallerySearch.test.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// client/src/components/GallerySearchBar/useGallerySearch.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGallerySearch } from "./useGallerySearch";
import type { Template } from "@/components/galleryTemplate/types";

const makeTemplate = (
  id: string,
  title: string,
  description: string,
  categories: string[]
): Template => ({
  id,
  title,
  description,
  categories,
  link: `/create/${id}`,
  componentKey: "DateInvite",
});

const TEMPLATES: Template[] = [
  makeTemplate("t1", "קופוני אהבה", "כרטיסים רומנטיים", ["romantic"]),
  makeTemplate("t2", "חידון חברות", "בחן ידע על זוגיות", ["romantic", "fun"]),
  makeTemplate("t3", "עוגת יום הולדת", "חגיגה מיוחדת", ["birthday"]),
];

describe("useGallerySearch", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns all templates when tab=all and query empty", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "")
    );
    expect(result.current.filteredTemplates).toHaveLength(3);
  });

  it("filters by activeTab", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "birthday", "")
    );
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });

  it("filters by debounced search query after 200ms", async () => {
    const { result, rerender } = renderHook(
      ({ q }) => useGallerySearch(TEMPLATES, "all", q),
      { initialProps: { q: "" } }
    );
    expect(result.current.filteredTemplates).toHaveLength(3);
    rerender({ q: "חידון" });
    // Before debounce fires — still 3
    expect(result.current.filteredTemplates).toHaveLength(3);
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t2");
  });

  it("applies tab filter AND search query combined", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "romantic", "חידון")
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t2");
  });

  it("returns empty array when nothing matches", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "xyz_no_match")
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(0);
  });

  it("matches against description field", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "חגיגה")
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });

  it("matches against categories field", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "birthday")
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });
});
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
cd client && npx vitest run src/components/GallerySearchBar/useGallerySearch.test.ts
```

Expected: FAIL — `useGallerySearch` not found.

- [ ] **Step 3: Implement useGallerySearch.ts**

```typescript
// client/src/components/GallerySearchBar/useGallerySearch.ts
"use client";

import { useState, useEffect, useMemo } from "react";
import type { Template } from "@/components/galleryTemplate/types";

interface UseGallerySearchResult {
  filteredTemplates: Template[];
}

export function useGallerySearch(
  templates: Template[],
  activeTab: string,
  searchQuery: string
): UseGallerySearchResult {
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredTemplates = useMemo<Template[]>(() => {
    let result = templates;

    if (activeTab !== "all") {
      result = result.filter(
        (t) => t.categories?.includes(activeTab) ?? false
      );
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.categories ?? []).join(" ").toLowerCase().includes(q)
      );
    }

    return result;
  }, [templates, activeTab, debouncedQuery]);

  return { filteredTemplates };
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
cd client && npx vitest run src/components/GallerySearchBar/useGallerySearch.test.ts
```

Expected: PASS — 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/GallerySearchBar/useGallerySearch.ts
git add client/src/components/GallerySearchBar/useGallerySearch.test.ts
git commit -m "feat(gallery-search): add useGallerySearch hook with debounce + combined tab/text filter"
```

---

## Task 3: GallerySearchBar component + barrel

**Files:**
- Create: `client/src/components/GallerySearchBar/GallerySearchBar.tsx`
- Create: `client/src/components/GallerySearchBar/index.ts`

- [ ] **Step 1: Create GallerySearchBar.tsx**

```tsx
// client/src/components/GallerySearchBar/GallerySearchBar.tsx
"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GallerySearchBarProps } from "./GallerySearchBar.types";

export function GallerySearchBar({
  value,
  onChange,
  className,
}: GallerySearchBarProps): React.ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (): void => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      role="search"
      dir="rtl"
      className={cn(
        "w-full max-w-[640px] mx-auto",
        className
      )}
    >
      <div className="relative flex items-center">
        {/* Search icon — right side (RTL start) */}
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="חיפוש תבניות"
          placeholder="חפש תבניות..."
          className={cn(
            "w-full min-h-[48px] pr-10 pl-10 py-3",
            "rounded-xl border border-gray-200 bg-white",
            "text-right text-gray-800 placeholder:text-gray-400",
            "text-base transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
            "dark:placeholder:text-gray-500"
          )}
          style={{ "--tw-ring-color": "#D85A30" } as React.CSSProperties}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 2px #D85A30";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "";
          }}
        />

        {/* Clear button — left side (RTL end) */}
        <AnimatePresence>
          {value && (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              onClick={handleClear}
              type="button"
              aria-label="נקה חיפוש"
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "p-0.5 rounded-full",
                "text-[#D85A30] hover:text-[#b84e28]",
                "transition-colors duration-150"
              )}
            >
              <X size={18} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create index.ts barrel**

```typescript
// client/src/components/GallerySearchBar/index.ts
export { GallerySearchBar } from "./GallerySearchBar";
export { useGallerySearch } from "./useGallerySearch";
export type { GallerySearchBarProps } from "./GallerySearchBar.types";
```

- [ ] **Step 3: Run type-check**

```bash
cd client && npm run type-check
```

Expected: 0 errors on new files.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/GallerySearchBar/GallerySearchBar.tsx
git add client/src/components/GallerySearchBar/index.ts
git commit -m "feat(gallery-search): add GallerySearchBar controlled input component (RTL, brand focus ring, clear button)"
```

---

## Task 4: Lift state to GalleryTemplate (index.tsx)

**Files:**
- Modify: `client/src/components/galleryTemplate/index.tsx`

Current file: 83 lines. After change: ~120 lines (under 150).

- [ ] **Step 1: Replace index.tsx**

Replace the full content of `client/src/components/galleryTemplate/index.tsx`:

```tsx
"use client";

/**
 * GalleryTemplate Component
 * Main export with responsive wrapper for Desktop/Mobile views.
 * Owns all gallery state: activeTab, searchQuery, tabs derivation, and filtering.
 */

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/auth";
import { useActiveTemplates } from "@/hooks/useActiveTemplates";
import { useGallerySearch } from "@/components/GallerySearchBar";
import { GalleryTemplateDesktop } from "./Desktop/GalleryTemplateDesktop";
import { GalleryTemplateMobile } from "./Mobile/GalleryTemplateMobile";
import { TEMPLATES, CATEGORY_EMOJI_MAP } from "./data/templates";
import type { GalleryTemplateProps, Template, FilterTab } from "./types";

export function GalleryTemplate(props: GalleryTemplateProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { enrichedTemplates, loading, error } = useActiveTemplates(TEMPLATES);

  const tabs = useMemo<FilterTab[]>(() => {
    const seen = new Set<string>();
    const dynamic = enrichedTemplates
      .flatMap((t) => t.categories ?? [])
      .filter((cat) => {
        if (seen.has(cat)) return false;
        seen.add(cat);
        return true;
      })
      .map((cat) => ({ id: cat, label: cat, emoji: CATEGORY_EMOJI_MAP[cat] }));
    return [{ id: "all", label: "הכל", emoji: "✨" }, ...dynamic];
  }, [enrichedTemplates]);

  const { filteredTemplates } = useGallerySearch(
    enrichedTemplates,
    activeTab,
    searchQuery
  );

  // Auto-open login modal when redirected from middleware (?login=true)
  useEffect(() => {
    const shouldLogin = searchParams.get("login") === "true";
    const redirectPath = searchParams.get("redirect");
    if (shouldLogin && !user) {
      setPendingLink(redirectPath);
      setIsLoginModalOpen(true);
    }
  }, [searchParams, user]);

  // Redirect after login
  useEffect(() => {
    if (user && pendingLink) {
      setIsLoginModalOpen(false);
      router.push(pendingLink);
      setPendingLink(null);
    }
  }, [user, pendingLink, router]);

  const handleTemplateClick = (template: Template): void => {
    router.push(template.link);
  };

  const handleLoginClose = (): void => {
    setIsLoginModalOpen(false);
    setPendingLink(null);
  };

  const viewProps = {
    ...props,
    templates: filteredTemplates,
    loading,
    error,
    activeTab,
    onTabChange: setActiveTab,
    tabs,
    searchQuery,
    onSearchChange: setSearchQuery,
    onTemplateClick: handleTemplateClick,
  };

  return (
    <>
      {isMobile ? (
        <GalleryTemplateMobile {...viewProps} />
      ) : (
        <GalleryTemplateDesktop {...viewProps} />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
        redirectTo={pendingLink}
      />
    </>
  );
}

export default GalleryTemplate;
```

- [ ] **Step 2: Run type-check**

```bash
cd client && npm run type-check
```

Expected: Errors on Desktop/Mobile (they don't accept the new props yet) — that is expected and will be fixed in Tasks 5 and 6.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/index.tsx
git commit -m "feat(gallery-search): lift activeTab, searchQuery, tabs, filtering state to GalleryTemplate"
```

---

## Task 5: Refactor GalleryTemplateDesktop

**Files:**
- Modify: `client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx`

Current: 139 lines. After refactor: ~105 lines (under 150).

- [ ] **Step 1: Replace GalleryTemplateDesktop.tsx**

```tsx
// client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx
"use client";

/**
 * GalleryTemplateDesktop Component
 * Desktop view for the gallery template page (responsive grid).
 * Receives pre-filtered templates and all filter state as props.
 */

import { motion, AnimatePresence } from "framer-motion";
import { GalleryHeader, FilterTabs, TemplateCard } from "../components";
import { GallerySearchBar } from "@/components/GallerySearchBar";
import type { GalleryTemplateViewProps } from "../types";

export function GalleryTemplateDesktop({
  className = "",
  onTemplateClick,
  templates,
  loading,
  error,
  activeTab,
  onTabChange,
  tabs,
  searchQuery,
  onSearchChange,
}: GalleryTemplateViewProps) {
  return (
    <section
      className={`min-h-screen bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Header Section */}
        <GalleryHeader
          title="בחרו את החוויה הבאה שלכם"
          subtitle="גלריית תבניות אינטראקטיביות שנוצרו באהבה. התאימו אישית, ושלחו!"
          className="mb-10"
        />

        {/* Filter Tabs */}
        <FilterTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          className="mb-10"
        />

        {/* Smart Search Bar */}
        <GallerySearchBar
          value={searchQuery}
          onChange={onSearchChange}
          className="mb-8"
        />

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TemplateCard template={template} onClick={onTemplateClick} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-500 dark:text-gray-400 text-lg text-hebrew-body">
              לא נמצאו תבניות התואמות לחיפוש שלך
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <span className="text-5xl mb-4 block">⚠️</span>
            <p className="text-red-500 dark:text-red-400 text-lg text-hebrew-body">
              אירעה שגיאה בטעינת התבניות. אנא נסו שוב מאוחר יותר.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#d4826f] border-t-transparent rounded-full"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg text-hebrew-body mt-4">
              טוען תבניות...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run type-check**

```bash
cd client && npm run type-check
```

Expected: Only Mobile errors remain.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx
git commit -m "feat(gallery-search): refactor GalleryTemplateDesktop to accept props, add GallerySearchBar"
```

---

## Task 6: Refactor GalleryTemplateMobile

**Files:**
- Modify: `client/src/components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx`

Current: 149 lines. After refactor: ~115 lines (under 150).

- [ ] **Step 1: Replace GalleryTemplateMobile.tsx**

```tsx
// client/src/components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx
"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single column).
 * Receives pre-filtered templates and all filter state as props.
 */

import { motion, AnimatePresence } from "framer-motion";
import { FilterTabs, TemplateCard } from "../components";
import { GallerySearchBar } from "@/components/GallerySearchBar";
import type { GalleryTemplateViewProps } from "../types";

export function GalleryTemplateMobile({
  className = "",
  onTemplateClick,
  templates,
  loading,
  error,
  activeTab,
  onTabChange,
  tabs,
  searchQuery,
  onSearchChange,
}: GalleryTemplateViewProps) {
  return (
    <section
      className={`min-h-screen bg-[#faf7f5] dark:bg-gray-900 transition-colors duration-300 ${className}`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <h1 className="text-2xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
            בחרו את החוויה הבאה
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-hebrew-body">
            תבניות אינטראקטיביות שנוצרו באהבה
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="mb-6 -mx-4 px-4">
          <div className="flex flex-wrap gap-2">
            <FilterTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              className="flex flex-wrap gap-2"
            />
          </div>
        </div>

        {/* Smart Search Bar */}
        <GallerySearchBar
          value={searchQuery}
          onChange={onSearchChange}
          className="mb-6"
        />

        {/* Templates Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${searchQuery}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4"
          >
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TemplateCard template={template} onClick={onTemplateClick} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">🔍</span>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body">
              לא נמצאו תבניות התואמות לחיפוש שלך
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <span className="text-4xl mb-3 block">⚠️</span>
            <p className="text-red-500 dark:text-red-400 text-hebrew-body">
              אירעה שגיאה בטעינת התבניות.
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-8 h-8 border-3 border-[#d4826f] border-t-transparent rounded-full"
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-hebrew-body mt-4">
              טוען תבניות...
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run type-check — expect 0 errors**

```bash
cd client && npm run type-check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx
git commit -m "feat(gallery-search): refactor GalleryTemplateMobile to accept props, add GallerySearchBar"
```

---

## Task 7: Final verification

- [ ] **Step 1: Run all tests**

```bash
cd client && npx vitest run
```

Expected: All tests pass including the 7 `useGallerySearch` tests.

- [ ] **Step 2: Run type-check**

```bash
cd client && npm run type-check
```

Expected: 0 TypeScript errors.

- [ ] **Step 3: Run lint**

```bash
cd client && npm run lint
```

Expected: 0 lint errors.

- [ ] **Step 4: Verify line counts**

```bash
wc -l client/src/components/GallerySearchBar/GallerySearchBar.types.ts \
       client/src/components/GallerySearchBar/useGallerySearch.ts \
       client/src/components/GallerySearchBar/GallerySearchBar.tsx \
       client/src/components/GallerySearchBar/index.ts \
       client/src/components/galleryTemplate/types/index.ts \
       client/src/components/galleryTemplate/index.tsx \
       client/src/components/galleryTemplate/Desktop/GalleryTemplateDesktop.tsx \
       client/src/components/galleryTemplate/Mobile/GalleryTemplateMobile.tsx
```

Expected: All files under 150 lines.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(gallery-search): complete gallery smart search bar — real-time RTL filter with tab+query combined"
```

---

## Post-Execution Checklist

- [ ] No file exceeds 150 lines
- [ ] TypeScript: zero `any`, all return types explicit
- [ ] No `console.*` — `logger.*` used (GalleryLoadingWrapper has a console.error — pre-existing, not in scope)
- [ ] Real-time filtering works (debounced 200ms)
- [ ] Combined filtering (tab + search) correct
- [ ] Empty state in Hebrew when no results
- [ ] Clear × button works
- [ ] RTL layout correct (search icon right, clear button left)
- [ ] Responsive: mobile full-width, desktop max-width 640px
- [ ] Focus ring uses `#D85A30`
- [ ] `aria-label` in Hebrew, `role="search"` on wrapper
- [ ] Filter logic in `useGallerySearch.ts` only
- [ ] Desktop/Mobile inline filter logic removed
- [ ] `dev` branch only, no changes to `main`
- [ ] Plan written to `.claude/plans/gallery-smart-search-bar.md`
