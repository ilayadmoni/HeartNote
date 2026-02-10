/**
 * Editor API Functions
 * Uses the centralized API client for page creation
 */

import { api, type CreatePageResponse } from "@/lib/api/client";

interface CreatePageResult {
  id: string;
  slug: string;
  url: string;
  expiresAt: string;
}

export async function createUserPage(
  templateId: string,
  data: Record<string, unknown>
): Promise<CreatePageResult> {
  // First get the template UUID from the component key
  const componentKey = templateId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const template = await api.templates.getByKey(componentKey);

  // Create the page
  const response = await api.pages.create({
    template_id: template.id,
    custom_settings: data,
  });

  // Build full URL
  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

  return {
    id: response.id,
    slug: response.route_slug,
    url: `${appUrl}/p/${response.route_slug}`,
    expiresAt: response.expires_at,
  };
}
