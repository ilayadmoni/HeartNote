"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import type { AuthUser } from "@/contexts/AuthContext";
import { saveGuestDraft, claimGuestDraft } from "@/actions/draftActions";

interface UseDraftStateArgs {
  templateId: string;
  user: AuthUser | null;
  loading: boolean;
  setChoices: (v: Record<string, unknown>) => void;
  onDraftRestored: () => void;
}

export function useDraftState({
  templateId,
  user,
  loading,
  setChoices,
  onDraftRestored,
}: UseDraftStateArgs) {
  const t = useTranslations("editor");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft_id");

  const [isRestoringDraft, setIsRestoringDraft] = useState(!!draftId);
  const hasClaimed = useRef(false);

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
        const res = await claimGuestDraft(draftId);
        if (res.success && res.metadata) {
          setChoices(res.metadata as Record<string, unknown>);
          onDraftRestored();
          setTimeout(() => router.replace(pathname, { scroll: false }), 150);
        } else if (res.success) {
          setTimeout(() => router.replace(pathname, { scroll: false }), 150);
        } else {
          toast.error(res.error || t("errors.draftRestoreFailed"));
        }
      } catch {
        toast.error(t("errors.draftRestoreError"));
      } finally {
        setIsRestoringDraft(false);
      }
    };

    restoreDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, draftId]);

  const prepareGuestDraft = useCallback(
    async (submissionData: Record<string, unknown>) => {
      return saveGuestDraft(templateId, submissionData);
    },
    [templateId],
  );

  return { isRestoringDraft, prepareGuestDraft };
}
