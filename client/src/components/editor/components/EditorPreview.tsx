"use client";

/**
 * EditorPreview Component
 * Live template preview — uses the centralized registry.
 */

import React from "react";
import {
  TEMPLATE_REGISTRY,
  templateIdToComponentKey,
} from "@/components/templates/registry";

interface EditorPreviewProps {
  templateId: string;
  data: Record<string, unknown>;
  isMobile?: boolean;
}

export const EditorPreview = React.memo(function EditorPreview({
  templateId,
  data,
}: EditorPreviewProps) {
  // Convert kebab-case templateId to PascalCase registry key
  const componentKey = templateIdToComponentKey(templateId);
  const Component = TEMPLATE_REGISTRY[componentKey];

  if (!Component) {
    return (
      <div className="min-h-[390px] flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 rounded-xl">
        <p className="text-gray-400 text-sm text-hebrew-body">תבנית לא נמצאה</p>
      </div>
    );
  }

  // Render component directly for auto-height
  return (
    <div className="w-full min-h-[390px] rounded-xl overflow-hidden shadow-lg">
      <Component data={data} />
    </div>
  );
});
