"use client";

/**
 * EditorMobile Component
 * Mobile layout - preview fills screen, collapsible form at bottom
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Send, X } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { EDITOR_CONFIGS } from "../configs";
import { createUserPage } from "../api";
import type { TemplateEditorProps } from "../types";

export function EditorMobile({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const config = EDITOR_CONFIGS[templateId];
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [data, setData] = useState<Record<string, unknown>>(
    config?.defaultData || {},
  );
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 p-4">
        <div className="text-center">
          <p className="text-2xl mb-4">❌</p>
          <p className="text-gray-600 dark:text-gray-400 text-hebrew-body">
            תבנית לא נמצאה
          </p>
          <button
            onClick={() => router.push("/gallery")}
            className="mt-4 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-hebrew-body"
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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-[#2e3c52] dark:text-gray-300"
          aria-label="סגור"
        >
          <X size={24} />
        </button>

        <h1 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
          {config.title}
        </h1>

        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-1 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-sm text-hebrew-heading disabled:opacity-50"
        >
          {isPublishing ? (
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={14} />
          )}
          <span>שליחה</span>
        </button>
      </header>

      {/* Preview - Full screen direct preview */}
      <div className="flex-1 overflow-hidden">
        <EditorPreview templateId={templateId} data={data} isMobile />
      </div>

      {/* Bottom Sheet Toggle */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 z-30">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full py-3 flex items-center justify-center gap-2"
          aria-label={isFormOpen ? "סגור טופס" : "פתח טופס"}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 text-hebrew-body">
            {isFormOpen ? "סגור עריכה" : "ערוך מאפיינים"}
          </span>
          {isFormOpen ? (
            <ChevronDown className="text-gray-400" size={20} />
          ) : (
            <ChevronUp className="text-gray-400" size={20} />
          )}
        </button>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden max-h-[50vh] overflow-y-auto"
            >
              <EditorSidebar
                config={config}
                data={data}
                onChange={handleChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
