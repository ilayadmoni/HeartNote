"use client";

/**
 * EditorMobile Component
 * Mobile layout - Preview card on top, draggable bottom sheet for edit form
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { QuotaModal } from "../components/QuotaModal";
import { BottomSheet } from "@/components/ui";
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
  const [showQuotaModal, setShowQuotaModal] = useState(false);

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

  const handleChange = useCallback((key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await createUserPage(templateId, data);
      setSuccessData({ url: result.url, expiresAt: result.expiresAt });
    } catch (error: unknown) {
      const apiError = error as { status?: number; detail?: string };
      if (apiError.status === 403 && apiError.detail === "QUOTA_EXCEEDED") {
        setShowQuotaModal(true);
      } else {
        console.error("Failed to publish:", error);
        alert("שגיאה ביצירת הכרטיס. נסה שוב.");
      }
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
        style={{ paddingBottom: "80px" }}
      >
        <EditorPreview templateId={templateId} data={data} isMobile />
      </div>

      {/* Draggable Bottom Sheet - Properties Panel */}
      <BottomSheet
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        collapsedHeight={72}
        expandedHeight={65}
        label="ערוך מאפיינים"
        expandedLabel="סגור עריכה"
      >
        <EditorSidebar config={config} data={data} onChange={handleChange} />
      </BottomSheet>

      {/* Success Modal */}
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        url={successData?.url || ""}
        expiresAt={successData?.expiresAt || ""}
      />

      {/* Quota Exceeded Modal */}
      <QuotaModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
      />
    </div>
  );
}
