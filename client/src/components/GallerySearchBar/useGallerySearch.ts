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
