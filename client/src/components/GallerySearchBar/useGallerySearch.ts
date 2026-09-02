"use client";

import { useState, useEffect, useMemo } from "react";
import type { Template } from "@/components/galleryTemplate/types";

interface UseGallerySearchResult {
  filteredTemplates: Template[];
}

export function useGallerySearch(
  templates: Template[],
  activeTab: string,
  searchQuery: string,
  /** Translator bound to the "gallery" namespace, used to search localized copy. */
  t: (key: string) => string
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
        (tpl) => tpl.categories?.includes(activeTab) ?? false
      );
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((tpl) => {
        const name = t(tpl.nameKey).toLowerCase();
        const description = t(tpl.descriptionKey).toLowerCase();
        return (
          name.includes(q) ||
          description.includes(q) ||
          (tpl.categories ?? []).join(" ").toLowerCase().includes(q)
        );
      });
    }

    return result;
  }, [templates, activeTab, debouncedQuery, t]);

  return { filteredTemplates };
}
