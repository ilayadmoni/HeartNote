"use client";

/**
 * useActiveTemplates Hook
 * Fetches active templates from Supabase with their categorization and premium status.
 * Maps the database data to the local UI registry by slug.
 */

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
import type { Template } from "@/components/galleryTemplate/types";

export interface SupabaseTemplateRow {
  slug: string;
  category: string[] | null;
  is_premium: boolean;
  is_active: boolean;
}

export interface TemplateMetadata {
  slug: string;
  categories: string[];
  isPremium: boolean;
}

export interface UseActiveTemplatesReturn {
  /** Array of template metadata fetched from DB */
  metadata: TemplateMetadata[];
  /** Loading state */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** Enriched templates with DB data merged into UI templates */
  enrichedTemplates: Template[];
}

/**
 * Fetch active templates from Supabase and map to local UI registry
 * @param uiTemplates - The local UI template registry (TEMPLATES)
 * @returns Metadata, loading state, error, and enriched templates
 */
export function useActiveTemplates(
  uiTemplates: Template[]
): UseActiveTemplatesReturn {
  const [metadata, setMetadata] = useState<TemplateMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActiveTemplates() {
      try {
        setLoading(true);
        setError(null);

        // Fetch only active templates with slug, category, and is_premium
        const { data, error: fetchError } = await supabase
          .from("templates")
          .select("slug, category, is_premium, is_active")
          .eq("is_active", true);

        if (fetchError) {
          throw new Error(`Failed to fetch templates: ${fetchError.message}`);
        }

        // Transform Supabase rows to metadata
        const dbMetadata: TemplateMetadata[] = (data || [])
          .map((row: SupabaseTemplateRow) => ({
            slug: row.slug,
            categories: row.category || [],
            isPremium: row.is_premium,
          }));

        setMetadata(dbMetadata);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching active templates:", message);
      } finally {
        setLoading(false);
      }
    }

    fetchActiveTemplates();
  }, []);

  // Merge DB metadata with UI templates by matching slug to id
  // Sort: free templates first, then premium
  const enrichedTemplates = uiTemplates
    .map((template) => {
      const dbData = metadata.find((m) => m.slug === template.id);
      if (!dbData) return null; // Filter out templates not in DB

      // Update badge based on premium status
      const badge = dbData.isPremium
        ? { type: "premium" as const, color: "#f59e0b" }
        : { type: "free" as const, color: "#22c55e" };

      return {
        ...template,
        isPremium: dbData.isPremium,
        isFree: !dbData.isPremium,
        categories: dbData.categories, // Store array of categories
        badge,
      } as Template & { categories: string[] };
    })
    .filter((t) => t !== null) as (Template & { categories: string[] })[];

  // Sort: free first, premium last
  enrichedTemplates.sort((a, b) => {
    if (a.isPremium === b.isPremium) return 0;
    return a.isPremium ? 1 : -1;
  });

  return { metadata, loading, error, enrichedTemplates };
}
