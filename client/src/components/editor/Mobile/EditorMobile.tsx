"use client";

/**
 * EditorMobile Component
 * Mobile layout - Preview card on top, edit form sliding up from bottom
 * Uses global Header/Footer from layout.tsx
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Send } from "lucide-react";
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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 p-4">
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
    <div className="min-h-[calc(100vh-140px)] bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Compact Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
            {config.title}
          </h1>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-sm font-semibold text-hebrew-heading disabled:opacity-50 shadow-sm shadow-[#d4826f]/20 transition-all"
          >
            {isPublishing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span>שליחה</span>
          </button>
        </div>
      </div>

      {/* Preview Area - Takes most of the screen */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ paddingBottom: "60px" }}
      >
        <EditorPreview templateId={templateId} data={data} isMobile />
      </div>

      {/* Bottom Sheet - Edit Form */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-[28px] shadow-[0_-4px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.3)] border-t border-gray-100 dark:border-gray-700 z-40 transition-all duration-300 ${
          isFormOpen ? "max-h-[65vh]" : ""
        }`}
      >
        {/* Handle Bar */}
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full py-3 flex flex-col items-center gap-1"
          aria-label={isFormOpen ? "סגור עריכה" : "פתח עריכה"}
        >
          {/* Visual Handle */}
          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-1" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 text-hebrew-body">
              {isFormOpen ? "סגור עריכה" : "ערוך מאפיינים"}
            </span>
            {isFormOpen ? (
              <ChevronDown className="text-gray-400" size={18} />
            ) : (
              <ChevronUp className="text-gray-400" size={18} />
            )}
          </div>
        </button>

        {/* Form Content with Animation */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="max-h-[50vh] overflow-y-auto pb-safe">
                <EditorSidebar
                  config={config}
                  data={data}
                  onChange={handleChange}
                />
              </div>
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
