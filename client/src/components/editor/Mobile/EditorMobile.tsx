"use client";

/**
 * EditorMobile Component
 * Mobile layout - Preview card on top, draggable bottom sheet for edit form
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { LoginModal } from "@/components/auth";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { QuotaModal } from "../components/QuotaModal";
import { CreationConfirmModal } from "../components/CreationConfirmModal";
import { BottomSheet } from "@/components/ui";
import { EDITOR_CONFIGS } from "../configs";
import { submitGenericCreation } from "@/actions/creations";
import { useAuth } from "@/contexts/AuthContext";
import { useTemplateData } from "@/hooks/useTemplateData";
import {
  clearDraft,
  clearPendingCreation,
  getPendingCreation,
  loadDraft,
  saveDraft,
  setPendingCreation,
} from "@/lib/pendingCreation";
import type { TemplateEditorProps } from "../types";

export function EditorMobile({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const config = EDITOR_CONFIGS[templateId];
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {
    userChoices: data,
    updateChoice: handleChange,
    setChoices,
    logData,
  } = useTemplateData(templateId, config?.defaultData || {});
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string | null;
  } | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const hasHydratedDraftRef = useRef(false);
  const hasResumedPendingRef = useRef(false);

  // Store the deferred upload function from ImageUploader (via sidebar)
  const pendingUploadRef = useRef<(() => Promise<string | null>) | null>(null);

  const handleFileReady = useCallback(
    (uploadFn: (() => Promise<string | null>) | null) => {
      pendingUploadRef.current = uploadFn;
    },
    [],
  );

  useEffect(() => {
    if (hasHydratedDraftRef.current) return;
    const draft = loadDraft(templateId);
    if (draft) {
      setChoices(draft);
    }
    hasHydratedDraftRef.current = true;
  }, [templateId, setChoices]);

  useEffect(() => {
    saveDraft(templateId, data);
  }, [templateId, data]);

  useEffect(() => {
    if (!user || isPublishing || hasResumedPendingRef.current) return;
    const pending = getPendingCreation();
    if (!pending || pending.templateId !== templateId) return;

    hasResumedPendingRef.current = true;
    setChoices(pending.data);
    setShowConfirmModal(false);
    setIsLoginModalOpen(false);

    window.setTimeout(() => {
      void handleConfirmCreation(pending.data);
    }, 50);
  }, [user, templateId, setChoices, isPublishing]);

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

  // Show confirmation modal instead of immediately creating
  const handlePublish = () => {
    if (!user) {
      setShowConfirmModal(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsLoginModalOpen(false);
    setShowConfirmModal(true);
  };

  // Handle the actual creation after confirmation
  const handleConfirmCreation = async (
    submissionData: Record<string, unknown> = data,
  ) => {
    if (!user) {
      setPendingCreation({
        templateId,
        data: submissionData,
        returnPath: `/create/${templateId}`,
        createdAt: Date.now(),
      });
      setShowConfirmModal(false);
      setIsLoginModalOpen(true);
      return;
    }

    logData("שליחה");
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("templateSlug", templateId);
      formData.append("metadata", JSON.stringify(submissionData));

      // Check for blob URLs in data and convert to File
      const blobUrl = Object.values(submissionData).find(
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
      clearPendingCreation();
      clearDraft(templateId);
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
    <div className="bg-[#faf7f5] dark:bg-gray-900">
      {/* Compact Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              {config.title}
            </h1>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2 px-4 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full text-sm font-semibold text-hebrew-heading disabled:opacity-50 shadow-sm shadow-[#d4826f]/20 transition-all"
          >
            <span>{isPublishing ? "יוצר..." : user ? "יצירה" : "יצירה"}</span>
            {isPublishing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Preview Area - Auto height based on template */}
      <div className="overflow-hidden relative">
        <EditorPreview templateId={templateId} data={data} isMobile />
      </div>

      {/* Draggable Bottom Sheet - Properties Panel */}
      <BottomSheet
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        collapsedHeight={72}
        expandedHeight={75}
        label="ערוך מאפיינים"
        expandedLabel="סגור עריכה"
      >
        <EditorSidebar
          config={config}
          data={data}
          onChange={handleChange}
          userId={user?.id}
          onFileReady={handleFileReady}
        />
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

      {/* Creation Confirmation Modal */}
      <CreationConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmCreation}
        templateSlug={templateId}
        templateName={config.title}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectTo={`/create/${templateId}`}
      />
    </div>
  );
}
