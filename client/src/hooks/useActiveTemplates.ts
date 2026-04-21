"use client";

/**
 * useActiveTemplates Hook
 * Reads active templates from the shared React Query cache (`useTemplatesQuery`)
 * and merges them with the local UI registry by slug.
 */

import { useEffect } from "react";
import { toast } from "sonner";
import { useTemplatesQuery } from "./useTemplatesQuery";
import type { Template } from "@/components/galleryTemplate/types";

export interface TemplateMetadata {
  slug: string;
  categories: string[];
  isPremium: boolean;
}

export interface UseActiveTemplatesReturn {
  metadata: TemplateMetadata[];
  loading: boolean;
  error: string | null;
  enrichedTemplates: Template[];
}

export function useActiveTemplates(
  uiTemplates: Template[],
): UseActiveTemplatesReturn {
  const { data, isLoading, error } = useTemplatesQuery();

  useEffect(() => {
    if (error) toast.error("לא הצלחנו לטעון את רשימת התבניות. נסו שוב.");
  }, [error]);

  const metadata: TemplateMetadata[] = (data ?? []).map((row) => ({
    slug: row.slug,
    categories: row.category ?? [],
    isPremium: row.is_premium,
  }));

  const enrichedTemplates = uiTemplates
    .map((template) => {
      const dbData = metadata.find((m) => m.slug === template.id);
      if (!dbData) return null;

      const badge = dbData.isPremium
        ? { type: "premium" as const, color: "#f59e0b" }
        : { type: "free" as const, color: "#22c55e" };

      return {
        ...template,
        isPremium: dbData.isPremium,
        isFree: !dbData.isPremium,
        categories: dbData.categories,
        badge,
      } as Template & { categories: string[] };
    })
    .filter((t) => t !== null) as (Template & { categories: string[] })[];

  enrichedTemplates.sort((a, b) => {
    if (a.isPremium === b.isPremium) return 0;
    return a.isPremium ? 1 : -1;
  });

  return {
    metadata,
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    enrichedTemplates,
  };
}
