"use client";

/**
 * useActiveTemplates Hook
 * Reads active templates from the shared React Query cache (`useTemplatesQuery`)
 * and merges them with the local UI registry by slug. `isPremium`/`categories`
 * always come from the DB row; `nameKey`/`descriptionKey` come from the local
 * catalog. `dbName` carries the DB's raw name as a fallback for templates
 * whose catalog translation is missing.
 */

import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useTemplatesQuery } from "./useTemplatesQuery";
import type { Template } from "@/components/galleryTemplate/types";

export interface TemplateMetadata {
  slug: string;
  name: string;
  categories: string[];
  isPremium: boolean;
}

export interface UseActiveTemplatesReturn {
  metadata: TemplateMetadata[];
  loading: boolean;
  error: string | null;
  enrichedTemplates: (Template & { categories: string[]; dbName: string })[];
}

export function useActiveTemplates(
  uiTemplates: Template[],
): UseActiveTemplatesReturn {
  const { data, isLoading, error } = useTemplatesQuery();
  const t = useTranslations("gallery");

  useEffect(() => {
    if (error) toast.error(t("states.toastLoadFailed"));
  }, [error, t]);

  const metadata: TemplateMetadata[] = (data ?? []).map((row) => ({
    slug: row.slug,
    name: row.name,
    categories: row.category ?? [],
    isPremium: row.is_premium,
  }));

  const enrichedTemplates = uiTemplates
    .map((template) => {
      const dbData = metadata.find((m) => m.slug === template.id);
      if (!dbData) return null;

      return {
        ...template,
        isPremium: dbData.isPremium,
        isFree: !dbData.isPremium,
        categories: dbData.categories,
        dbName: dbData.name,
      };
    })
    .filter((entry) => entry !== null) as (Template & { categories: string[]; dbName: string })[];

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
