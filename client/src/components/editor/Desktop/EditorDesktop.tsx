"use client";

/**
 * EditorDesktop Component
 * Desktop layout - preview fills main area, sidebar on right
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { QuotaModal } from "../components/QuotaModal";
import { CreationConfirmModal } from "../components/CreationConfirmModal";
import { EDITOR_CONFIGS } from "../configs";
import { submitGenericCreation } from "@/actions/creations";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplateData } from "@/hooks/useTemplateData";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const config = EDITOR_CONFIGS[templateId];
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  const {
    userChoices: data,
    updateChoice: handleChange,
    logData,
  } = useTemplateData(templateId, config?.defaultData || {});
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string | null;
  } | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Store the deferred upload function from ImageUploader (via sidebar)
  const pendingUploadRef = useRef<(() => Promise<string | null>) | null>(null);

  const handleFileReady = useCallback(
    (uploadFn: (() => Promise<string | null>) | null) => {
      pendingUploadRef.current = uploadFn;
    },
    [],
  );

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

  // Show confirmation modal instead of immediately creating
  const handlePublish = () => {
    setShowConfirmModal(true);
  };

  // Handle the actual creation after confirmation
  const handleConfirmCreation = async () => {
    logData("שליחה");
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("templateSlug", templateId);
      formData.append("metadata", JSON.stringify(data));

      const blobUrl = Object.values(data).find(
        (value) => typeof value === "string" && value.startsWith("blob:"),
      ) as string | undefined;

      if (blobUrl) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = blob.type.split("/")[1] || "jpeg";
        const file = new File([blob], `upload.${ext}`, {
          type: blob.type || "image/jpeg",
        });
        formData.append("file", file);
        formData.append("bucketName", "image_steamy_Window");
      }

      const result = await submitGenericCreation(formData);

      if (!result.success) {
        if (result.code === 403 && result.error === "QUOTA_EXCEEDED") {
          setShowQuotaModal(true);
          setShowConfirmModal(false);
          return;
        }

        if (result.code === 402 && result.error === "TEMPLATE_NOT_ALLOWED") {
          alert(
            "תבנית זו אינה זמינה במנוי הנוכחי שלך. שדרג את המנוי כדי להשתמש בה.",
          );
          setShowConfirmModal(false);
          return;
        }

        alert("שגיאה ביצירת הכרטיס. נסה שוב.");
        return;
      }


      // Show success modal with shareable link instead of redirecting
      setShowConfirmModal(false);
      setSuccessData({
        url: `${window.location.origin}/p/${result.data.creationId}`,
        expiresAt: null,
      });
    } catch (error: unknown) {
      console.error("Failed to publish:", error);
      alert("שגיאה ביצירת הכרטיס. נסה שוב.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-[200px] bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Compact Toolbar */}
      <div className="flex-shrink-0 bg-[#faf7f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
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
          <span>{isPublishing ? "יוצר..." : "יצירה"}</span>
        </motion.button>
      </div>

      {/* Main Content - Grid layout for aligned heights */}
      <div className="flex-1 flex p-6 gap-6 items-stretch">
        {/* Preview Area - Auto height with responsive minimum */}
        <main className="flex-1 min-h-[390px] flex flex-col">
          <EditorPreview ref={previewRef} templateId={templateId} data={data} />
        </main>

        {/* Sidebar - Max height matches preview, scrolls when content exceeds */}
        <aside
          className="w-80 bg-faf7f5 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-y-auto flex-shrink-0"
          style={{ height: previewHeight ? `${previewHeight}px` : "auto" }}
        >
          <EditorSidebar
            config={config}
            data={data}
            onChange={handleChange}
            userId={user?.id}
            onFileReady={handleFileReady}
          />
        </aside>
      </div>

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

      {/* Creation Confirmation Modal */}
      <CreationConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmCreation}
        templateSlug={templateId}
        templateName={config.title}
      />
    </div>
  );
}
