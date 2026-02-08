"use client";

/**
 * EditorPreview Component
 * Live template preview - direct rendering for mobile, iframe for desktop
 */

import { useEffect, useRef, useState } from "react";
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

export function EditorPreview({
  templateId,
  data,
  isMobile,
}: EditorPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Store data in sessionStorage for iframe to read (desktop only)
  useEffect(() => {
    if (!isMobile) {
      sessionStorage.setItem(`preview_${templateId}`, JSON.stringify(data));
    }
  }, [templateId, data, isMobile]);

  // Update iframe when data changes (desktop only)
  useEffect(() => {
    if (!isMobile && iframeRef.current && loaded) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          { type: "UPDATE_DATA", data },
          "*",
        );
      } catch {
        // Fallback handled by sessionStorage polling
      }
    }
  }, [data, loaded, isMobile]);

  // Mobile: Render component directly for proper sizing
  if (isMobile) {
    const Component = TEMPLATE_COMPONENTS[templateId];

    if (!Component) {
      return (
        <div className="h-full flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
          <p className="text-gray-400 text-sm text-hebrew-body">
            תבנית לא נמצאה
          </p>
        </div>
      );
    }

    return (
      <div className="h-full w-full overflow-auto bg-[#faf7f5] dark:bg-gray-900">
        <Component data={data} />
      </div>
    );
  }

  // Desktop: Use iframe for isolated viewport
  return (
    <div className="h-full w-full bg-gray-900 overflow-hidden">
      <iframe
        ref={iframeRef}
        src={`/preview-frame/${templateId}`}
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0 block"
        title="תצוגה מקדימה"
      />
    </div>
  );
}
