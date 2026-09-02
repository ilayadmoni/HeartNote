"use client";

/**
 * LivePreview Component
 * Renders the actual template component scaled-down as a gallery preview fallback.
 * Used when no hand-crafted miniature exists for a given componentKey.
 */

import { Suspense, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  getTemplateComponent,
  type AnyTemplateComponent,
} from "@/components/templates/registry";
import { buildPreviewData } from "../data/previewData";
import type { TemplateComponentKey } from "../types";

interface LivePreviewProps {
  componentKey: TemplateComponentKey;
}

export function LivePreview({ componentKey }: LivePreviewProps): JSX.Element {
  const t = useTranslations("gallery");

  const Component: AnyTemplateComponent | undefined = useMemo(
    () => getTemplateComponent(componentKey),
    [componentKey],
  );

  const data = useMemo(
    () => (buildPreviewData(t) as Record<string, unknown>)[componentKey] ?? {},
    [componentKey, t],
  );

  if (!Component) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <span className="text-body-sm text-ink-subtle">{t("states.previewUnavailable")}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Scaled-down container — visual only, non-interactive */}
      <div
        className="pointer-events-none select-none origin-top-left"
        style={{
          width: "300%",
          height: "300%",
          transform: "scale(0.333)",
        }}
      >
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Component data={data} />
        </Suspense>
      </div>
    </div>
  );
}
