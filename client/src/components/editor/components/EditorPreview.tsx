"use client";

/**
 * EditorPreview Component
 * Live template preview - no device mockups, just the actual template
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

  // Store data in sessionStorage for iframe to read
  useEffect(() => {
    sessionStorage.setItem(`preview_${templateId}`, JSON.stringify(data));
  }, [templateId, data]);

  // Update iframe when data changes
  useEffect(() => {
    if (iframeRef.current && loaded) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          { type: "UPDATE_DATA", data },
          "*",
        );
      } catch {
        // Fallback handled by sessionStorage polling
      }
    }
  }, [data, loaded]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden w-full h-full
        ${isMobile ? "w-full h-full" : "max-w-4xl mx-auto h-[calc(100vh-140px)]"}
      `}
    >
      <iframe
        ref={iframeRef}
        src={`/preview-frame/${templateId}`}
        onLoad={() => setLoaded(true)}
        className="w-full h-full border-0 block"
        title="תצוגה מקדימה"
      />
    </motion.div>
  );
}
