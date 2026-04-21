"use client";

/**
 * EditorMobile Component
 * Mobile layout - Preview card on top, draggable bottom sheet for edit form
 * Uses global Header/Footer from layout.tsx
 */

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Eye, Edit2, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { LoginModal } from "@/components/auth";
import { EditorSidebar } from "../components/EditorSidebar";
import { EditorPreview } from "../components/EditorPreview";
import { SuccessModal } from "../components/SuccessModal";
import { QuotaModal } from "../components/QuotaModal";
import { PaidQuotaModal } from "../components/PaidQuotaModal";
import { PremiumTemplateUpgradeModal } from "../components/PremiumTemplateUpgradeModal";
import { UpgradeSlideOver } from "@/components/ui/UpgradeSlideOver";
import { CreationConfirmModal } from "../components/CreationConfirmModal";
import { validateQuizQuestions } from "../components/QuestionsEditor";
import { EDITOR_CONFIGS } from "../configs";
import { submitGenericCreation } from "@/actions/creations";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfileComplete";
import { useProfile } from "@/hooks/useProfile";
import { useTemplateData } from "@/hooks/useTemplateData";
import { useTemplateBySlug } from "@/hooks/useTemplatesQuery";
import { saveGuestDraft } from "@/lib/draftServices";
import { createClient } from "@/lib/supabase/client";
import { claimGuestDraft } from "@/actions/draftActions";
import { toast } from "sonner";
import type { TemplateEditorProps } from "../types";
import type { QuizQuestion } from "@/components/templates/types";
import {
  isSubscriptionEffectivelyFree,
  resolveBlockedModalFromCreationResult,
} from "@/lib/creation-flow/errors";

type BlockingModal = "none" | "quota" | "paid-quota" | "upgrade";
type ActiveModal = "none" | "confirm" | "upgrade" | "quota" | "paid-quota";

export function EditorMobile({ templateId }: TemplateEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialDraftId = searchParams.get("draft_id");
  const [isRestoringDraft, setIsRestoringDraft] = useState(!!initialDraftId);
  const { user, loading } = useAuth();
  const { isProfileComplete } = useProfileComplete();
  const { profile, loading: profileLoading } = useProfile();
  const config = EDITOR_CONFIGS[templateId];
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");
  const [isPublishing, setIsPublishing] = useState(false);
  const { template: cachedTemplate } = useTemplateBySlug(templateId);
  const isPremiumTemplate = Boolean(cachedTemplate?.is_premium);
  const templateFreeDays = useMemo(() => {
    const policy = cachedTemplate?.expiration_policy as { free_days?: number } | null;
    return Number(policy?.free_days ?? 1) || 1;
  }, [cachedTemplate?.expiration_policy]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(`/create/${templateId}`);
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const hasClaimed = useRef(false);

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

  const pendingUploadRef = useRef<(() => Promise<string | null>) | null>(null);

  const handleFileReady = useCallback(
    (uploadFn: (() => Promise<string | null>) | null) => {
      pendingUploadRef.current = uploadFn;
    },
    [],
  );

  const isEffectivelyFreeUser = useMemo(
    () =>
      isSubscriptionEffectivelyFree(
        profile?.subscription.tier,
        profile?.subscription.premium_expiry,
      ),
    [profile?.subscription.premium_expiry, profile?.subscription.tier],
  );

  const isPaidQuotaFull = useMemo(() => {
    if (!profile || isEffectivelyFreeUser) return false;
    const { creations_count_pro, creation_limit, additional_creation_pro } = profile.subscription;
    if (creation_limit === null) return false;
    return creations_count_pro >= creation_limit + (additional_creation_pro ?? 0);
  }, [profile, isEffectivelyFreeUser]);

  const isSubscriptionLoading = loading || profileLoading;

  const showBlockingModal = useCallback(
    (modal: Exclude<ActiveModal, "none" | "confirm">) => {
      setActiveModal(modal);
    },
    [],
  );

  const draftId = searchParams.get("draft_id");
  const supabase = createClient();

  useEffect(() => {
    if (loading || !user || !draftId || hasClaimed.current) {
      if (!loading && !draftId) setIsRestoringDraft(false);
      if (!loading && !user) setIsRestoringDraft(false);
      return;
    }

    const restoreDraft = async () => {
      hasClaimed.current = true;
      setIsRestoringDraft(true);

      try {
        await supabase.auth.getSession();
        const res = await claimGuestDraft(draftId);

        if (res.success && res.metadata) {
          setChoices(res.metadata as Record<string, unknown>);
          setActiveModal("confirm");
          setTimeout(() => {
            router.replace(pathname, { scroll: false });
          }, 150);
        } else if (res.success) {
          setTimeout(() => {
            router.replace(pathname, { scroll: false });
          }, 150);
        } else {
          toast.error(res.error || "לא הצלחנו לשחזר את הטיוטה.");
        }
      } catch (error) {
        toast.error("שגיאה בשחזור הטיוטה. נסו שוב.");
      } finally {
        setIsRestoringDraft(false);
      }
    };

    restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, draftId]);

  const prepareGuestDraft = async (submissionData: Record<string, unknown>) => {
    let file: File | undefined;
    const blobUrl = Object.values(submissionData).find(
      (value) => typeof value === "string" && value.startsWith("blob:"),
    ) as string | undefined;

    if (blobUrl) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] || "jpeg";
      file = new File([blob], `upload.${ext}`, { type: blob.type || "image/jpeg" });
    }

    return saveGuestDraft(templateId, submissionData, file);
  };

  if (!config) {
    return (
      <div className="flex items-center justify-center bg-[#faf7f5] dark:bg-gray-900 p-4">
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

  const handlePublish = async () => {
    if (isSubscriptionLoading) {
      return;
    }

    if (templateId === "relationship-quiz" && data.questions) {
      const validation = validateQuizQuestions(data.questions as QuizQuestion[]);
      if (!validation.isValid) {
        toast.error(validation.errors[0] || "יש להשלים את כל השאלות לפני היצירה");
        return;
      }
    }

    if (!user) {
      setIsPublishing(true);
      try {
        const createdDraftId = await prepareGuestDraft(data);
        setLoginRedirect(`/create/${templateId}?draft_id=${createdDraftId}`);
        setActiveModal("none");
        setIsLoginModalOpen(true);
      } catch (error) {
        toast.error("שמירת טיוטה נכשלה. נסו שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (isPremiumTemplate && isEffectivelyFreeUser) {
      setActiveModal("upgrade");
      return;
    }

    if (!isProfileComplete) {
      setIsPublishing(true);
      try {
        const createdDraftId = await prepareGuestDraft(data);
        const redirectPath = encodeURIComponent(
          `/create/${templateId}?draft_id=${createdDraftId}`,
        );
        setActiveModal("none");
        window.location.href = `/complete-profile?returnTo=${redirectPath}&reason=incomplete_profile`;
      } catch (error) {
        toast.error("שמירת טיוטה נכשלה. נסו שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    // Proactive paid-quota guard: block before the confirm dialog if the user
    // is a paid subscriber with an active subscription but no remaining slots.
    if (!isEffectivelyFreeUser && profile) {
      const { creations_count_pro, creation_limit, additional_creation_pro } = profile.subscription;
      const proTotalAllowed = creation_limit + (additional_creation_pro ?? 0);
      if (creations_count_pro >= proTotalAllowed) {
        setActiveModal("paid-quota");
        return;
      }
    }

    setActiveModal("confirm");
    setIsLoginModalOpen(false);
  };

  const handleConfirmCreation = async (
    quotaPreference: "free" | "pro",
    submissionData: Record<string, unknown> = data,
  ) => {
    if (!user) {
      setIsPublishing(true);
      try {
        const createdDraftId = await prepareGuestDraft(submissionData);
        setLoginRedirect(`/create/${templateId}?draft_id=${createdDraftId}`);
        setActiveModal("none");
        setIsLoginModalOpen(true);
      } catch (error) {
        toast.error("שמירת טיוטה נכשלה. נסה שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (isPremiumTemplate && isEffectivelyFreeUser) {
      setActiveModal("upgrade");
      return;
    }

    logData("שליחה");
    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("templateSlug", templateId);
      formData.append("metadata", JSON.stringify(submissionData));
      formData.append("quotaPreference", quotaPreference);

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
      const blockedModal = resolveBlockedModalFromCreationResult(result);

      if (blockedModal) {
        showBlockingModal(blockedModal);
        return;
      }

      if (!result.success) {
        toast.error("שגיאה ביצירת הכרטיס. נסה שוב.");
        return;
      }

      setActiveModal("none");
      setSuccessData({
        url: `${window.location.origin}/p/${result.data.creationId}`,
        expiresAt: null,
      });
    } catch (error) {
      toast.error("שגיאה ביצירת הכרטיס. נסה שוב.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isRestoringDraft) {
    return (
      <div className="flex w-full flex-col items-center justify-center bg-gray-50/80">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">משחזר את היצירה שלך...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#faf7f5] dark:bg-gray-900">
      {/* Sticky top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-2.5 border-b"
        style={{
          backgroundColor: "var(--header-bg)",
          borderColor: "var(--header-border)",
        }}
      >
               <button
          onClick={() => router.push("/gallery")}
          className="inline-flex items-center gap-1.5 bg-transparent text-[#9a6a52] hover:text-[#4a2e1e] font-normal text-[15px] text-hebrew-body px-1.5 py-[11px] border-none transition-colors duration-150"
        >
          <ChevronRight size={14} strokeWidth={2} />
          <span>חזרה</span>
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing || isSubscriptionLoading}
          className="inline-flex items-center gap-2 bg-[#C47A5A] hover:bg-[#a86244] hover:-translate-y-px active:scale-[0.97] text-white font-medium text-[15px] text-hebrew-heading px-5 py-[11px] rounded-[10px] transition-all duration-150 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          <span>{isPublishing || isSubscriptionLoading ? "טוען..." : "יצירה"}</span>
          {isPublishing || isSubscriptionLoading ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={14} strokeWidth={2} />
          )}
        </button>

 
      </div>

      {/* Tab bar */}
      <div className="flex mx-4 my-3 p-1 rounded-xl bg-coral-50 dark:bg-navy-800">
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 text-center text-xs py-2 px-2 rounded-lg transition-colors text-hebrew-small flex items-center justify-center gap-1.5 ${
            activeTab === "preview"
              ? "font-bold bg-white dark:bg-navy-700 text-coral-600 dark:text-coral-400 shadow-sm"
              : "font-medium text-navy-400 dark:text-gray-400 hover:text-coral-500"
          }`}
        >
          
          <span>תצוגה מקדימה</span>
          <Eye size={14} />
        </button>
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 text-center text-xs py-2 px-2 rounded-lg transition-colors text-hebrew-small flex items-center justify-center gap-1.5 ${
            activeTab === "edit"
              ? "font-bold bg-white dark:bg-navy-700 text-coral-600 dark:text-coral-400 shadow-sm"
              : "font-medium text-navy-400 dark:text-gray-400 hover:text-coral-500"
          }`}
        >
          
          <span>עריכה</span>
          <Edit2 size={14} />
        </button>
      </div>

      {/* Scrollable content — both tabs mounted to preserve state, one hidden */}
      <div className="flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <div className={` ${activeTab === "edit" ? "block" : "hidden"}`}>
          <EditorSidebar
            config={config}
            data={data}
            onChange={handleChange}
            userId={user?.id}
            onFileReady={handleFileReady}
          />
        </div>
        <div className={` ${activeTab === "preview" ? "block" : "hidden"}`}>
          <EditorPreview templateId={templateId} data={data} isMobile />
        </div>
      </div>



      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        url={successData?.url || ""}
        expiresAt={successData?.expiresAt || ""}
      />

      <QuotaModal
        isOpen={activeModal === "quota"}
        onClose={() => setActiveModal("none")}
      />

      <PaidQuotaModal
        isOpen={activeModal === "paid-quota"}
        onClose={() => setActiveModal("none")}
        onRequestUpgrade={() => { setActiveModal("none"); setIsSlideOverOpen(true); }}
      />

      <PremiumTemplateUpgradeModal
        isOpen={activeModal === "upgrade"}
        onClose={() => setActiveModal("none")}
      />

      <CreationConfirmModal
        isOpen={activeModal === "confirm"}
        onClose={() => setActiveModal("none")}
        onConfirm={handleConfirmCreation}
        templateSlug={templateId}
        templateName={config.title}
        isPremiumTemplate={isPremiumTemplate}
        templateFreeDays={templateFreeDays}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectTo={loginRedirect}
      />

      <UpgradeSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        tier={profile?.subscription.tier === "premium" ? "premium" : "lite"}
        creationLimit={
          profile
            ? (profile.subscription.creation_limit ?? 0) + (profile.subscription.additional_creation_pro ?? 0)
            : 0
        }
        expiryDate={profile?.subscription.premium_expiry ?? null}
      />
    </div>
  );
}
