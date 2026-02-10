"use client";

/**
 * UserPageClient Component
 * Renders the template on the public viewer page with:
 * - Full-screen template
 * - Generous spacing between card and footer
 * - Main website Footer at the bottom
 */

import { TemplateRenderer } from "@/components/templates";
import { Footer } from "@/components/footer";

interface UserPageClientProps {
  templateKey: string;
  contentData: Record<string, unknown>;
}

export function UserPageClient({
  templateKey,
  contentData,
}: UserPageClientProps) {
  // API returns kebab-case (e.g. "date-invite") → convert to PascalCase
  const componentKey = templateKey
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Template — fills the viewport */}
      <div className="flex-1 ">
        <TemplateRenderer componentKey={componentKey} data={contentData} />
      </div>

      {/* Main Website Footer */}
      <Footer />
    </div>
  );
}
