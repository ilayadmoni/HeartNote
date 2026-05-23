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
