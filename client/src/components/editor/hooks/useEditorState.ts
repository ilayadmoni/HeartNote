"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfileComplete";
import { useProfile } from "@/hooks/useProfile";
import { useTemplateData } from "@/hooks/useTemplateData";
import { useTemplateBySlug } from "@/hooks/useTemplatesQuery";
import { saveGuestDraft } from "@/lib/draftServices";
import { createClient } from "@/lib/supabase/client";
import { claimGuestDraft } from "@/actions/draftActions";
import { submitGenericCreation } from "@/actions/creations";
import { validateQuizQuestions } from "@/components/editor/components/QuestionsEditor";
import { EDITOR_CONFIGS } from "@/components/editor/configs";
import {
  isSubscriptionEffectivelyFree,
  resolveBlockedModalFromCreationResult,
} from "@/lib/creation-flow/errors";
import { useEditorModals } from "./useEditorModals";
import type { QuizQuestion } from "@/components/templates/types";

export function useEditorState(templateId: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft_id");

  const { user, loading } = useAuth();
  const { isProfileComplete } = useProfileComplete();
  const { profile, loading: profileLoading } = useProfile();

  const config = EDITOR_CONFIGS[templateId];
  const {
    userChoices: data,
    updateChoice: handleChange,
    setChoices,
    logData,
  } = useTemplateData(templateId, config?.defaultData || {});

  const { template: cachedTemplate } = useTemplateBySlug(templateId);
  const isPremiumTemplate = Boolean(cachedTemplate?.is_premium);
  const templateFreeDays = useMemo(() => {
    const policy = cachedTemplate?.expiration_policy as { free_days?: number } | null;
    return Number(policy?.free_days ?? 1) || 1;
  }, [cachedTemplate?.expiration_policy]);

  const modals = useEditorModals(templateId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRestoringDraft, setIsRestoringDraft] = useState(!!draftId);
  const hasClaimed = useRef(false);
  const pendingUploadRef = useRef<(() => Promise<string | null>) | null>(null);

  const handleFileReady = useCallback(
    (uploadFn: (() => Promise<string | null>) | null) => {
      pendingUploadRef.current = uploadFn;
    },
    [],
  );

  const isEffectivelyFreeUser = useMemo(
    () => isSubscriptionEffectivelyFree(profile?.subscription.tier, profile?.subscription.premium_expiry),
    [profile?.subscription.premium_expiry, profile?.subscription.tier],
  );

  const isPaidQuotaFull = useMemo(() => {
    if (!profile || isEffectivelyFreeUser) return false;
    const { creations_count_pro, creation_limit, additional_creation_pro } = profile.subscription;
    if (creation_limit === null) return false;
    return creations_count_pro >= creation_limit + (additional_creation_pro ?? 0);
  }, [profile, isEffectivelyFreeUser]);

  const isSubscriptionLoading = loading || profileLoading;

  // ── Draft restoration ────────────────────────────────────────────────
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
          modals.setActiveModal("confirm");
          setTimeout(() => router.replace(pathname, { scroll: false }), 150);
        } else if (res.success) {
          setTimeout(() => router.replace(pathname, { scroll: false }), 150);
        } else {
          toast.error(res.error || "לא הצלחנו לשחזר את הטיוטה.");
        }
      } catch {
        toast.error("שגיאה בשחזור הטיוטה. נסו שוב.");
      } finally {
        setIsRestoringDraft(false);
      }
    };

    restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, draftId]);

  // ── Guest draft helper ───────────────────────────────────────────────
  const prepareGuestDraft = async (submissionData: Record<string, unknown>) => {
    let file: File | undefined;
    const blobUrl = Object.values(submissionData).find(
      (v) => typeof v === "string" && v.startsWith("blob:"),
    ) as string | undefined;
    if (blobUrl) {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1] || "jpeg";
      file = new File([blob], `upload.${ext}`, { type: blob.type || "image/jpeg" });
    }
    return saveGuestDraft(templateId, submissionData, file);
  };

  // ── Publish flow ─────────────────────────────────────────────────────
  const handlePublish = async () => {
    if (isSubscriptionLoading) return;

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
        modals.setLoginRedirect(`/create/${templateId}?draft_id=${createdDraftId}`);
        modals.setActiveModal("none");
        modals.setIsLoginModalOpen(true);
      } catch {
        toast.error("שמירת טיוטה נכשלה. נסו שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (isPremiumTemplate && isEffectivelyFreeUser) { modals.setActiveModal("upgrade"); return; }

    if (!isProfileComplete) {
      setIsPublishing(true);
      try {
        const createdDraftId = await prepareGuestDraft(data);
        const redirectPath = encodeURIComponent(`/create/${templateId}?draft_id=${createdDraftId}`);
        modals.setActiveModal("none");
        window.location.href = `/complete-profile?returnTo=${redirectPath}&reason=incomplete_profile`;
      } catch {
        toast.error("שמירת טיוטה נכשלה. נסו שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (!isEffectivelyFreeUser && profile) {
      const { creations_count_pro, creation_limit, additional_creation_pro } = profile.subscription;
      if (creations_count_pro >= creation_limit + (additional_creation_pro ?? 0)) {
        modals.setActiveModal("paid-quota");
        return;
      }
    }

    modals.setActiveModal("confirm");
    modals.setIsLoginModalOpen(false);
  };

  // ── Confirm creation ─────────────────────────────────────────────────
  const handleConfirmCreation = async (
    quotaPreference: "free" | "pro",
    submissionData: Record<string, unknown> = data,
  ) => {
    if (!user) {
      setIsPublishing(true);
      try {
        const createdDraftId = await prepareGuestDraft(submissionData);
        modals.setLoginRedirect(`/create/${templateId}?draft_id=${createdDraftId}`);
        modals.setActiveModal("none");
        modals.setIsLoginModalOpen(true);
      } catch {
        toast.error("שמירת טיוטה נכשלה. נסה שוב.");
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    if (isPremiumTemplate && isEffectivelyFreeUser) { modals.setActiveModal("upgrade"); return; }

    logData("שליחה");
    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("templateSlug", templateId);
      formData.append("metadata", JSON.stringify(submissionData));
      formData.append("quotaPreference", quotaPreference);

      const blobUrl = Object.values(submissionData).find(
        (v) => typeof v === "string" && v.startsWith("blob:"),
      ) as string | undefined;
      if (blobUrl) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = blob.type.split("/")[1] || "jpeg";
        formData.append("file", new File([blob], `upload.${ext}`, { type: blob.type || "image/jpeg" }));
        formData.append("bucketName", "image_steamy_Window");
      }

      const result = await submitGenericCreation(formData);
      const blockedModal = resolveBlockedModalFromCreationResult(result);
      if (blockedModal) { modals.showBlockingModal(blockedModal); return; }
      if (!result.success) { toast.error("שגיאה ביצירת הכרטיס. נסה שוב."); return; }

      modals.setActiveModal("none");
      modals.setSuccessData({
        url: `${window.location.origin}/p/${result.data.creationId}`,
        expiresAt: null,
        verificationCode: result.data.verification_code ?? null,
      });
    } catch {
      toast.error("שגיאה ביצירת הכרטיס. נסה שוב.");
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    // template
    config,
    data,
    handleChange,
    handleFileReady,
    // auth / profile
    user,
    profile,
    isPremiumTemplate,
    templateFreeDays,
    isEffectivelyFreeUser,
    isPaidQuotaFull,
    isSubscriptionLoading,
    // loading states
    isPublishing,
    isRestoringDraft,
    // actions
    handlePublish,
    handleConfirmCreation,
    // modal state (spread from useEditorModals)
    ...modals,
  };
}

export type EditorState = ReturnType<typeof useEditorState>;
