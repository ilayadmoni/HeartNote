"use client";

/**
 * EditorDesktop Component
 * Desktop layout - preview fills main area, sidebar on right
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send, ArrowRight } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { EDITOR_CONFIGS } from "../configs";
import { createUserPage } from "../api";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const config = EDITOR_CONFIGS[templateId];

  const [data, setData] = useState<Record<string, unknown>>(
    config?.defaultData || {},
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string;
  } | null>(null);

  if (!config) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
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
    <div className="h-screen overflow-hidden bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#2e3c52] dark:text-gray-300 hover:text-[#d4826f] dark:hover:text-[#e8917a] transition-colors"
          aria-label="חזרה"
        >
          <ArrowRight size={20} />
          <span className="text-sm text-hebrew-body">חזרה</span>
        </button>

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
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area - Full width except sidebar */}
        <main className="flex-1 p-6 overflow-auto">
          <EditorPreview templateId={templateId} data={data} />
        </main>

        {/* Sidebar */}
        <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
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
