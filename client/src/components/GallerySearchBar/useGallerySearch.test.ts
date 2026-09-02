import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGallerySearch } from "./useGallerySearch";
import type { Template } from "@/components/galleryTemplate/types";

const makeTemplate = (
  id: string,
  nameKey: string,
  descriptionKey: string,
  categories: string[]
): Template => ({
  id,
  nameKey,
  descriptionKey,
  categories,
  link: `/create/${id}`,
  componentKey: "DateInvite",
});

const TEMPLATES: Template[] = [
  makeTemplate("t1", "t1.name", "t1.description", ["romantic"]),
  makeTemplate("t2", "t2.name", "t2.description", ["romantic", "fun"]),
  makeTemplate("t3", "t3.name", "t3.description", ["birthday"]),
];

/** Test-only translator standing in for next-intl's `t`. */
const messages: Record<string, string> = {
  "t1.name": "קופוני אהבה",
  "t1.description": "כרטיסים רומנטיים",
  "t2.name": "חידון חברות",
  "t2.description": "בחן ידע על זוגיות",
  "t3.name": "עוגת יום הולדת",
  "t3.description": "חגיגה מיוחדת",
};
const t = (key: string): string => messages[key] ?? key;

describe("useGallerySearch", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("returns all templates when tab=all and query empty", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "", t)
    );
    expect(result.current.filteredTemplates).toHaveLength(3);
  });

  it("filters by activeTab", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "birthday", "", t)
    );
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });

  it("filters by debounced search query after 200ms", async () => {
    const { result, rerender } = renderHook(
      ({ q }) => useGallerySearch(TEMPLATES, "all", q, t),
      { initialProps: { q: "" } }
    );
    expect(result.current.filteredTemplates).toHaveLength(3);
    rerender({ q: "חידון" });
    expect(result.current.filteredTemplates).toHaveLength(3);
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t2");
  });

  it("applies tab filter AND search query combined", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "romantic", "חידון", t)
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t2");
  });

  it("returns empty array when nothing matches", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "xyz_no_match", t)
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(0);
  });

  it("matches against description field", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "חגיגה", t)
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });

  it("matches against categories field", () => {
    const { result } = renderHook(() =>
      useGallerySearch(TEMPLATES, "all", "birthday", t)
    );
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.filteredTemplates).toHaveLength(1);
    expect(result.current.filteredTemplates[0].id).toBe("t3");
  });
});
