"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileComplete } from "@/hooks/useProfileComplete";
import { useProfile } from "@/hooks/useProfile";
import { useTemplateData } from "@/hooks/useTemplateData";
import { useTemplateBySlug } from "@/hooks/useTemplatesQuery";
import { EDITOR_CONFIGS } from "@/components/editor/configs";
import {
  isSubscriptionEffectivelyFree,
  resolveBlockedModalFromCreationResult,
} from "@/lib/creation-flow/errors";
import { useEditorModals } from "./useEditorModals";
import { useDraftState } from "./useDraftState";
import { useEditorValidation } from "./useEditorValidation";
import { runCreationSubmission } from "./helpers/submitCreation";

export function useEditorState(templateId: string) {
  const t = useTranslations("editor");
  const { user, loading } = useAuth();
  const { isProfileComplete } = useProfileComplete();
  const { profile, loading: profileLoading } = useProfile();

  const config = EDITOR_CONFIGS[templateId];
  const { userChoices: data, updateChoice: handleChange, setChoices, logData } =
    useTemplateData(templateId, config?.defaultData || {});

  const { template: cachedTemplate } = useTemplateBySlug(templateId);
  const isPremiumTemplate = Boolean(cachedTemplate?.is_premium);
  const templateFreeDays = useMemo(() => {
    if (!cachedTemplate) return 0;
    const policy = cachedTemplate.expiration_policy as { free_days?: number } | null;
    if (policy?.free_days == null) {
      throw new Error(`Template "${templateId}" is missing expiration_policy.free_days`);
    }
    return policy.free_days;
  }, [cachedTemplate, templateId]);

  const modals = useEditorModals(templateId);
  const [isPublishing, setIsPublishing] = useState(false);

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

  const { isRestoringDraft, prepareGuestDraft } = useDraftState({
    templateId, user, loading, setChoices,
    onDraftRestored: () => modals.setActiveModal("confirm"),
  });
  const { validateContent, computeGuard } = useEditorValidation({
    templateId, data, isPremiumTemplate, isEffectivelyFreeUser, profile,
  });

  const saveDraftAndRedirect = async (
    submissionData: Record<string, unknown>,
    onSuccess: (id: string) => void,
    errorMsg: string,
  ) => {
    setIsPublishing(true);
    try { onSuccess(await prepareGuestDraft(submissionData)); }
    catch { toast.error(errorMsg); }
    finally { setIsPublishing(false); }
  };

  const openLoginFlow = (id: string) => {
    modals.setLoginRedirect(`/create/${templateId}?draft_id=${id}`);
    modals.setActiveModal("none");
    modals.setIsLoginModalOpen(true);
  };

  const handlePublish = async () => {
    if (isSubscriptionLoading) return;
    if (!validateContent()) return;
    if (!user) return saveDraftAndRedirect(data, openLoginFlow, t("errors.draftSaveFailed"));

    const guard = computeGuard();
    if (guard === "upgrade") { modals.setActiveModal("upgrade"); return; }

    if (!isProfileComplete) {
      return saveDraftAndRedirect(data, (id) => {
        const redirectPath = encodeURIComponent(`/create/${templateId}?draft_id=${id}`);
        modals.setActiveModal("none");
        window.location.href = `/complete-profile?returnTo=${redirectPath}&reason=incomplete_profile`;
      }, t("errors.draftSaveFailed"));
    }

    if (guard === "paid-quota") { modals.setActiveModal("paid-quota"); return; }
    modals.setActiveModal("confirm");
    modals.setIsLoginModalOpen(false);
  };

  const handleConfirmCreation = async (
    quotaPreference: "free" | "pro",
    submissionData: Record<string, unknown> = data,
  ) => {
    if (!user) return saveDraftAndRedirect(submissionData, openLoginFlow, t("errors.draftSaveFailed"));
    if (isPremiumTemplate && isEffectivelyFreeUser) { modals.setActiveModal("upgrade"); return; }

    logData("submit");
    setIsPublishing(true);
    try {
      const result = await runCreationSubmission(templateId, submissionData, quotaPreference);
      const blockedModal = resolveBlockedModalFromCreationResult(result);
      if (blockedModal) { modals.showBlockingModal(blockedModal); return; }
      if (!result.success) { toast.error(t("errors.creationFailed")); return; }
      modals.setActiveModal("none");
      modals.setSuccessData({
        url: `${window.location.origin}/p/${result.data.creationId}`,
        expiresAt: null,
        verificationCode: result.data.verification_code ?? null,
      });
    } catch { toast.error(t("errors.creationFailed")); }
    finally { setIsPublishing(false); }
  };

  return {
    config, data, handleChange,
    user, profile, isPremiumTemplate, templateFreeDays,
    isEffectivelyFreeUser, isPaidQuotaFull, isSubscriptionLoading,
    isPublishing, isRestoringDraft,
    handlePublish, handleConfirmCreation,
    ...modals,
  };
}

export type EditorState = ReturnType<typeof useEditorState>;
