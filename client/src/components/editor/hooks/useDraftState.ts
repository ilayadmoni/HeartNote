"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";
import { saveGuestDraft } from "@/lib/draftServices";
import { createClient } from "@/lib/supabase/client";
import { claimGuestDraft } from "@/actions/draftActions";

interface UseDraftStateArgs {
  templateId: string;
  user: User | null;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft_id");

  const [isRestoringDraft, setIsRestoringDraft] = useState(!!draftId);
  const hasClaimed = useRef(false);
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
          onDraftRestored();
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

  const prepareGuestDraft = useCallback(
    async (submissionData: Record<string, unknown>) => {
      let file: File | undefined;
      const blobUrl = Object.values(submissionData).find(
        (v) => typeof v === "string" && v.startsWith("blob:"),
      ) as string | undefined;
      if (blobUrl) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const ext = blob.type.split("/")[1] || "jpeg";
        file = new File([blob], `upload.${ext}`, {
          type: blob.type || "image/jpeg",
        });
      }
      return saveGuestDraft(templateId, submissionData, file);
    },
    [templateId],
  );

  return { isRestoringDraft, prepareGuestDraft };
}
