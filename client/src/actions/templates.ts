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

// ---------------------------------------------------------------------------
// LIST
// ---------------------------------------------------------------------------

/**
 * GET /templates → getTemplates()
 *
 * Returns all active templates. Public — no auth required.
 */
export async function getTemplates(): Promise<
  { data: TemplateResponse[] } | { error: string; status: number }
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("templates")
      .select(
        "id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy",
      )
      .eq("is_active", true);

    if (error) {
      return { error: error.message, status: 500 };
    }

    const templates: TemplateResponse[] = (data ?? []).map((t) => ({
      id: t.id as string,
      slug: t.slug as string,
      name: t.name as string,
      category: (t.category as string[]) ?? null,
      tags: (t.tags as string) ?? null,
      is_premium: (t.is_premium as boolean) ?? false,
      config_schema: (t.config_schema as Record<string, unknown>) ?? {},
      is_active: (t.is_active as boolean) ?? true,
      expiration_policy:
        (t.expiration_policy as Record<string, unknown>) ?? null,
    }));

    return { data: templates };
  } catch (e) {
    return {
      error: `Failed to fetch templates: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}

// ---------------------------------------------------------------------------
// GET BY SLUG
// ---------------------------------------------------------------------------

/**
 * GET /templates/:slug → getTemplateBySlug(slug)
 *
 * Returns a single active template by slug. Public.
 */
export async function getTemplateBySlug(
  slug: string,
): Promise<{ data: TemplateResponse } | { error: string; status: number }> {
  try {
    const supabase = await createClient();

    const { data: t, error } = await supabase
      .from("templates")
      .select(
        "id, slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !t) {
      return { error: "Template not found", status: 404 };
    }

    return {
      data: {
        id: t.id as string,
        slug: t.slug as string,
        name: t.name as string,
        category: (t.category as string[]) ?? null,
        tags: (t.tags as string) ?? null,
        is_premium: (t.is_premium as boolean) ?? false,
        config_schema: (t.config_schema as Record<string, unknown>) ?? {},
        is_active: (t.is_active as boolean) ?? true,
        expiration_policy:
          (t.expiration_policy as Record<string, unknown>) ?? null,
      },
    };
  } catch (e) {
    return {
      error: `Failed to fetch template: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
