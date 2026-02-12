"use client";

/**
 * LivePreview Component
 * Renders the actual template component scaled-down as a gallery preview fallback.
 * Used when no hand-crafted miniature exists for a given componentKey.
 */

import { Suspense, useMemo } from "react";
import {
  getTemplateComponent,
  type AnyTemplateComponent,
} from "@/components/templates/registry";
import { PREVIEW_DATA } from "../data/templates";
import type { TemplateComponentKey } from "../types";

interface LivePreviewProps {
  componentKey: TemplateComponentKey;
}

export function LivePreview({ componentKey }: LivePreviewProps) {
  const Component: AnyTemplateComponent | undefined = useMemo(
    () => getTemplateComponent(componentKey),
    [componentKey],
  );

  const data = useMemo(
    () =>
      (PREVIEW_DATA as Record<string, unknown>)[componentKey] ?? {},
    [componentKey],
  );

  if (!Component) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4">
        <span className="text-gray-400 dark:text-gray-500 text-sm text-hebrew-body">
          תצוגה מקדימה
        </span>
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
              <div className="w-6 h-6 border-2 border-[#d4826f] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Component data={data} />
        </Suspense>
      </div>
    </div>
  );
}
