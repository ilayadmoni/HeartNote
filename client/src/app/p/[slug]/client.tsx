"use client";

/**
 * UserPageClient Component
 * Renders the template on public page
 */

import { TemplateRenderer } from "@/components/templates";

interface UserPageClientProps {
  templateKey: string;
  contentData: Record<string, unknown>;
}

export function UserPageClient({
  templateKey,
  contentData,
}: UserPageClientProps) {
  // Convert template_key format (e.g., "date-invite") to component key (e.g., "DateInvite")
  const componentKey = templateKey
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return <TemplateRenderer componentKey={componentKey} data={contentData} />;
}
