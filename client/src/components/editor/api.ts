/**
 * Editor API Functions
 * Uses the centralized API client for creation.
 * Aligned with new DB schema (creations table, slug-based templates).
 */

import { api, type CreateCreationResponse } from "@/lib/api/client";

interface CreateCreationResult {
  id: string;
  url: string;
  expiresAt: string | null;
}

/**
 * Create a new user creation.
 *
 * @param templateSlug - The template slug (e.g. "steam_window")
 * @param data - The metadata payload matching the template's config_schema
 */
export async function createUserCreation(
  templateSlug: string,
  data: Record<string, unknown>
): Promise<CreateCreationResult> {
  // Look up the template by slug to get its UUID
  const template = await api.templates.getBySlug(templateSlug);

  // Create the creation via the backend (quota check happens server-side)
  const response: CreateCreationResponse = await api.creations.create({
    template_id: template.id,
    metadata: data,
  });

  // Build shareable URL
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

  return {
    id: response.id,
    url: `${appUrl}/c/${response.id}`,
    expiresAt: response.expires_at,
  };
}
