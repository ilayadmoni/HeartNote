"use client";

/**
 * EditorPreview Component
 * Live template preview - direct rendering for proper auto-height
 */

import {
  DateInvite,
  ScratchCard,
  Timeline,
  LoveCoupons,
  RelationshipQuiz,
  OpenWhen,
} from "@/components/templates";

// Template component map for direct rendering
const TEMPLATE_COMPONENTS: Record<
  string,
  React.ComponentType<{ data: unknown }>
> = {
  "date-invite": DateInvite as React.ComponentType<{ data: unknown }>,
  "scratch-card": ScratchCard as React.ComponentType<{ data: unknown }>,
  timeline: Timeline as React.ComponentType<{ data: unknown }>,
  "love-coupons": LoveCoupons as React.ComponentType<{ data: unknown }>,
  "relationship-quiz": RelationshipQuiz as React.ComponentType<{
    data: unknown;
  }>,
  "open-when": OpenWhen as React.ComponentType<{ data: unknown }>,
};

interface EditorPreviewProps {
  templateId: string;
  data: Record<string, unknown>;
  isMobile?: boolean;
}

export function EditorPreview({ templateId, data }: EditorPreviewProps) {
  const Component = TEMPLATE_COMPONENTS[templateId];

  if (!Component) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 rounded-xl">
        <p className="text-gray-400 text-sm text-hebrew-body">תבנית לא נמצאה</p>
      </div>
    );
  }

  // Render component directly for auto-height
  return (
    <div className="w-full flex-1 rounded-xl overflow-hidden shadow-lg">
      <Component data={data} />
    </div>
  );
}
