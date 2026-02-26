/**
 * Templates Server Actions
 *
 * Port of:
 *   server/app/api/v1/endpoints/templates.py
 *
 * DB columns (templates table – 005_destructive_reset.sql):
 *   id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy
 *
 * Templates are public data — the anon-key RLS policy allows SELECT for everyone.
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import type { TemplateResponse } from "@/lib/validations";

const TEMPLATE_COLUMNS =
  "id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy" as const;

/** Shared mapper: DB row → TemplateResponse */
function mapTemplateRow(t: Record<string, unknown>): TemplateResponse {
  return {
    id: t.id as string,
    slug: t.slug as string,
    name: t.name as string,
    category: (t.category as string[]) ?? null,
    tags: (t.tags as string) ?? null,
    is_premium: (t.is_premium as boolean) ?? false,
    config_schema: (t.config_schema as Record<string, unknown>) ?? {},
    is_active: (t.is_active as boolean) ?? true,
    expiration_policy: (t.expiration_policy as Record<string, unknown>) ?? null,
  };
}

/** GET /templates → getTemplates() – Returns all active templates. Public. */
export async function getTemplates(): Promise<
  { data: TemplateResponse[] } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("templates")
      .select(TEMPLATE_COLUMNS)
      .eq("is_active", true);

    if (error) return { error: error.message, status: 500 };
    return { data: (data ?? []).map(mapTemplateRow) };
  } catch (e) {
    return {
      error: `Failed to fetch templates: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/** GET /templates?tags=popular → getPopularTemplates() – Up to 4, free-first. Public. */
export async function getPopularTemplates(): Promise<
  { data: TemplateResponse[] } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("templates")
      .select(TEMPLATE_COLUMNS)
      .eq("is_active", true)
      .eq("tags", "popular")
      .order("is_premium", { ascending: true })
      .limit(4);

    if (error) return { error: error.message, status: 500 };
    return { data: (data ?? []).map(mapTemplateRow) };
  } catch (e) {
    return {
      error: `Failed to fetch popular templates: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

/** GET /templates/:slug → getTemplateBySlug(slug) – Single active template. Public. */
export async function getTemplateBySlug(
  slug: string,
): Promise<{ data: TemplateResponse } | { error: string; status: number }> {
  try {
    const supabase = await createClient();
    const { data: t, error } = await supabase
      .from("templates")
      .select(TEMPLATE_COLUMNS)
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !t) return { error: "Template not found", status: 404 };
    return { data: mapTemplateRow(t) };
  } catch (e) {
    return {
      error: `Failed to fetch template: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
