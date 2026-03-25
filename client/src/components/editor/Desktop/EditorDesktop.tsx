"use client";

/**
 * EditorDesktop Component
 * Desktop layout - preview fills main area, sidebar on right
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Send } from "lucide-react";
import { LoginModal } from "@/components/auth";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { QuotaModal } from "../components/QuotaModal";
import { CreationConfirmModal } from "../components/CreationConfirmModal";
import { EDITOR_CONFIGS } from "../configs";
import { submitGenericCreation } from "@/actions/creations";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfileComplete";
import { useTemplateData } from "@/hooks/useTemplateData";
import { saveGuestDraft } from "@/lib/draftServices";
import { createClient } from "@/lib/supabase/client";
import { claimGuestDraft } from "@/actions/draftActions";
import { pushToDataLayer } from "@/utils/gtm";
import { toast } from "sonner";
import type { TemplateEditorProps } from "../types";

export function EditorDesktop({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialDraftId = searchParams.get("draft_id");
  const [isRestoringDraft, setIsRestoringDraft] = useState(!!initialDraftId);
  const { user, loading } = useAuth();
  const { isProfileComplete } = useProfileComplete();
  const config = EDITOR_CONFIGS[templateId];
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const hasClaimed = useRef(false);

  const {
    userChoices: data,
    updateChoice: handleChange,
    setChoices,
    logData,
  } = useTemplateData(templateId, config?.defaultData || {});
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [successData, setSuccessData] = useState<{
    url: string;
    expiresAt: string | null;
  } | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(`/create/${templateId}`);
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

  // Extract primitive to avoid unstable searchParams dependency
  const draftId = searchParams.get("draft_id");
  const supabase = createClient();

  // Restore DB draft from auth callback
  useEffect(() => {
    // 1. Strict guard clauses — hasClaimed lock is NOT set until all pass
    if (loading || !user || !draftId || hasClaimed.current) {
      if (!loading && !draftId) setIsRestoringDraft(false);
      if (!loading && !user) setIsRestoringDraft(false);
      return;
    }

    const restoreDraft = async () => {
      // 2. Lock ONLY when authenticated and ready to fetch
      hasClaimed.current = true;
      setIsRestoringDraft(true);

      try {
        // 3. Force mobile browser to settle cookies before the Server Action
        await supabase.auth.getSession();

        const res = await claimGuestDraft(draftId);

        // Clean up the URL via Next.js router to sync React state
        router.replace(pathname, { scroll: false });

        if (res.success && res.metadata) {
          setChoices(res.metadata as Record<string, unknown>);
          setShowConfirmModal(true);
        } else if (res.error?.includes("already claimed")) {
          // Draft was already claimed (URL lingered) — silent recovery
          // The URL is now clean, no error toast needed
        } else {
          toast.error(res.error || "לא הצלחנו לשחזר את הטיוטה.");
        }
      } catch (e) {
        console.error("[EditorDesktop] Draft restore failed:", e);
        toast.error("שגיאה בשחזור הטיוטה. נסו שוב.");
      } finally {
        setIsRestoringDraft(false);
      }
    };

    restoreDraft();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, draftId]);

  const prepareGuestDraft = async (submissionData: Record<string, unknown>) => {
    let file: File | undefined = undefined;
    const blobUrl = Object.values(submissionData).find(
      (value) => typeof value === "string" && value.startsWith("blob:")
    ) as string | undefined;

    if (blobUrl) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] || "jpeg";
      file = new File([blob], `upload.${ext}`, { type: blob.type || "image/jpeg" });
    }
    return await saveGuestDraft(templateId, submissionData, file);
  };

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
  const handlePublish = async () => {
    if (!user) {
      setIsPublishing(true);
      try {
        const draftId = await prepareGuestDraft(data);
        setLoginRedirect(`/create/${templateId}?draft_id=${draftId}`);
        setShowConfirmModal(false);
        setIsLoginModalOpen(true);
      } catch (err) {
        console.error(err);
        alert("שמירת טיוטה נכשלה");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // Action-based guard: user is logged in but profile incomplete.
    // Save their work and redirect to onboarding.
    if (!isProfileComplete) {
      setIsPublishing(true);
      try {
        const draftId = await prepareGuestDraft(data);
        const redirectPath = encodeURIComponent(`/create/${templateId}?draft_id=${draftId}`);
        window.location.href = `/complete-profile?returnTo=${redirectPath}&reason=incomplete_profile`;
      } catch (err) {
        console.error(err);
        alert("שמירת טיוטה נכשלה");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    setIsLoginModalOpen(false);
    setShowConfirmModal(true);
  };

  // Handle the actual creation after confirmation
  const handleConfirmCreation = async (submissionData: Record<string, unknown> = data) => {
    if (!user) {
      setIsPublishing(true);
      try {
        const draftId = await prepareGuestDraft(submissionData);
        setLoginRedirect(`/create/${templateId}?draft_id=${draftId}`);
        setShowConfirmModal(false);
        setIsLoginModalOpen(true);
      } catch (err) {
        console.error(err);
        alert("שמירת טיוטה נכשלה. נסה שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    logData("שליחה");
    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append("templateSlug", templateId);
      formData.append("metadata", JSON.stringify(submissionData));

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
      // TODO: Clear DB draft on success
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

  if (isRestoringDraft) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">משחזר את היצירה שלך...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[200px] 2xl:min-h-[calc(100vh-16rem)] bg-[#faf7f5] dark:bg-gray-900 flex flex-col">
      {/* Compact Toolbar */}
      <div className="flex-shrink-0 bg-[#faf7f5] dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
            {config.title}
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-5 py-2 bg-[#d4826f] hover:bg-[#c4735f] text-white rounded-full shadow-md transition-colors text-hebrew-heading disabled:opacity-50"
        >
          <span>
            {isPublishing ? "יוצר..." : user ? "יצירה" : "יצירה"}
          </span>
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
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

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectTo={loginRedirect}
      />
    </div>
  );
}
