"use client";

import { useEffect, useState } from "react";
import { getPopularTemplates } from "@/actions";
import { TEMPLATES } from "@/components/galleryTemplate/data/templates";
import { logger } from "@/lib/utils/logger";
import type { TeaserCardData } from "../components/GalleryTeaserCard";

export type PopularTemplate = TeaserCardData & { link: string };

interface UsePopularTemplatesResult {
  templates: PopularTemplate[];
  loading: boolean;
}

/** Up to 4 popular templates mapped to teaser card data. */
export function usePopularTemplates(): UsePopularTemplatesResult {
  const [templates, setTemplates] = useState<PopularTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular(): Promise<void> {
      try {
        const result = await getPopularTemplates();
        if ("data" in result) {
          const mapped = result.data
            .map((dbTemplate): PopularTemplate | null => {
              const uiTemplate = TEMPLATES.find((tpl) => tpl.id === dbTemplate.slug);
              if (!uiTemplate) return null;
              return {
                id: uiTemplate.id,
                nameKey: uiTemplate.nameKey,
                descriptionKey: uiTemplate.descriptionKey,
                componentKey: uiTemplate.componentKey,
                isPremium: Boolean(dbTemplate.is_premium),
                link: `/create/${dbTemplate.slug}`,
              };
            })
            .filter((tpl): tpl is PopularTemplate => tpl !== null);
          setTemplates(mapped);
        }
      } catch (err) {
        logger.error("Failed to fetch popular templates", { err });
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  return { templates, loading };
}
