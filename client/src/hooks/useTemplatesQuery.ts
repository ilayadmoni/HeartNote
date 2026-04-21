"use client";

/**
 * useTemplatesQuery
 *
 * Single source of truth for template metadata in the client.
 * Fetches the full active-templates list once via the `getTemplates`
 * server action and caches it under a shared key, so per-slug consumers
 * (editor, expiration policy, gallery) read synchronously from cache
 * instead of issuing duplicate Supabase round-trips on every mount.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTemplates } from "@/actions/templates";
import type { TemplateResponse } from "@/lib/validations";

export const templateKeys = {
  all: ["templates"] as const,
  list: () => [...templateKeys.all, "list"] as const,
  detail: (slug: string) => [...templateKeys.all, "detail", slug] as const,
};

async function fetchActiveTemplates(): Promise<TemplateResponse[]> {
  const res = await getTemplates();
  if ("error" in res) throw new Error(res.error);
  return res.data;
}

const TEMPLATES_STALE_TIME = 1000 * 60 * 15; // 15 minutes
const TEMPLATES_GC_TIME = 1000 * 60 * 30; // 30 minutes

export function useTemplatesQuery() {
  return useQuery({
    queryKey: templateKeys.list(),
    queryFn: fetchActiveTemplates,
    staleTime: TEMPLATES_STALE_TIME,
    gcTime: TEMPLATES_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/**
 * Reads a single template from the shared list cache by slug.
 * Returns `undefined` while the list is loading or if no match is found.
 */
export function useTemplateBySlug(slug: string | null | undefined) {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useTemplatesQuery();

  const template = slug
    ? (data ?? queryClient.getQueryData<TemplateResponse[]>(templateKeys.list()))
        ?.find((t) => t.slug === slug)
    : undefined;

  return { template, isLoading, error };
}
