/**
 * Accessibility Component
 * Main accessibility statement page content.
 */

import { getTranslations } from "next-intl/server";
import { Settings } from "lucide-react";
import { AccessibilityHeader, AccessibilitySection } from "./components";
import { ACCESSIBILITY_SECTION_IDS } from "./constants";
import type { AccessibilityProps } from "./types";

export async function Accessibility({ className = "" }: AccessibilityProps): Promise<JSX.Element> {
  const t = await getTranslations("legal.accessibilityStatement");

  return (
    <section className={`relative py-section-sm px-gutter min-h-[100dvh] bg-surface ${className}`}>
      {/* Background Decorative Gears */}
      <div className="absolute top-20 start-10 opacity-10 pointer-events-none hidden lg:block">
        <Settings size={160} className="animate-spin-slow text-ink" />
      </div>
      <div className="absolute bottom-20 end-10 opacity-10 pointer-events-none hidden lg:block">
        <Settings size={120} className="animate-spin-slow-reverse text-ink" />
      </div>

      <div className="mx-auto max-w-3xl relative z-10">
        <AccessibilityHeader />

        <div className="bg-surface-raised rounded-card p-6 lg:p-10 shadow-card border border-line">
          {ACCESSIBILITY_SECTION_IDS.map((id) => (
            <AccessibilitySection key={id} id={id} />
          ))}

          <div className="h-px bg-line my-8" />

          <p className="text-center text-caption text-ink-subtle">{t("footerNote")}</p>
        </div>
      </div>
    </section>
  );
}
