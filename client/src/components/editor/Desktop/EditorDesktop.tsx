"use client";

/**
 * EditorDesktop Component
 * Desktop layout - preview fills main area, sidebar on right
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { EDITOR_CONFIGS } from "../configs";
import { createUserPage } from "../api";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const config = EDITOR_CONFIGS[templateId];
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  const [data, setData] = useState<Record<string, unknown>>(
    config?.defaultData || {},
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);

  // Track preview height to sync sidebar max-height
  useEffect(() => {
    if (!previewRef.current) return;

    const updateHeight = () => {
      if (previewRef.current) {
        setPreviewHeight(previewRef.current.offsetHeight);
      }
    };

    // Initial measurement
    updateHeight();

    // Use ResizeObserver for dynamic updates
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(previewRef.current);

    return () => resizeObserver.disconnect();
  }, [data]);

  if (!config) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">
            תבנית לא נמצאה
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-hebrew-body transition-colors"
          >
            חזרה לגלריה
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await createUserPage(templateId, data);
      setSuccessData({ url: result.url, expiresAt: result.expiresAt });
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("שגיאה ביצירת הכרטיס. נסה שוב.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-180px)] bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Compact Toolbar */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          {config.title}
        </h1>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-5 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full shadow-md transition-colors text-hebrew-heading disabled:opacity-50"
        >
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          <span>{isPublishing ? "יוצר..." : "שליחה"}</span>
        </motion.button>
      </div>

      {/* Main Content - Grid layout for aligned heights */}
      <div className="flex-1 flex p-6 gap-6 items-stretch">
        {/* Preview Area - Auto height with responsive minimum */}
        <main
          ref={previewRef}
          className="flex-1 min-h-[calc(100vh-250px)] flex flex-col"
        >
          <EditorPreview templateId={templateId} data={data} />
        </main>

        {/* Sidebar - Max height matches preview, scrolls when content exceeds */}
        <aside
          className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-y-auto flex-shrink-0"
          style={{ maxHeight: previewHeight ? `${previewHeight}px` : "auto" }}
        >
          <EditorSidebar config={config} data={data} onChange={handleChange} />
        </aside>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        url={successData?.url || ""}
        expiresAt={successData?.expiresAt || ""}
      />
    </div>
  );
}
