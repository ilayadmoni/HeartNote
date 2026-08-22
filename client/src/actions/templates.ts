/**
 * Templates Server Actions
 *
 * Templates are public data — no auth required for any of these.
 */

"use server";

import { prisma } from "@/lib/prisma";
import type { Template } from "@prisma/client";
import type { TemplateResponse } from "@/lib/validations";

/** Shared mapper: Prisma row → TemplateResponse */
function mapTemplateRow(t: Template): TemplateResponse {
  return {
    id: t.id,
    slug: t.slug,
    name: t.name,
    category: t.category.length ? t.category : null,
    tags: t.tags,
    is_premium: t.isPremium,
    config_schema: (t.configSchema as Record<string, unknown>) ?? {},
    is_active: t.isActive,
    expiration_policy: (t.expirationPolicy as Record<string, unknown>) ?? null,
  };
}

/** GET /templates → getTemplates() – Returns all active templates. Public. */
export async function getTemplates(): Promise<
  { data: TemplateResponse[] } | { error: string; status: number }
> {
  try {
    const templates = await prisma.template.findMany({ where: { isActive: true } });
    return { data: templates.map(mapTemplateRow) };
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
    const templates = await prisma.template.findMany({
      where: { isActive: true, tags: "popular" },
      orderBy: { isPremium: "asc" },
      take: 4,
    });
    return { data: templates.map(mapTemplateRow) };
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
    const template = await prisma.template.findFirst({
      where: { slug, isActive: true },
    });
    if (!template) return { error: "Template not found", status: 404 };
    return { data: mapTemplateRow(template) };
  } catch (e) {
    return {
      error: `Failed to fetch template: ${e instanceof Error ? e.message : String(e)}`,
      status: 500,
    };
  }
}
