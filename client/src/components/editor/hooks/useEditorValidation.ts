"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { validateQuizQuestions } from "@/components/editor/components/QuestionsEditor";
import type { QuizQuestion } from "@/components/templates/types";

interface ProfileSubscriptionShape {
  subscription: {
    creations_count_pro: number;
    creation_limit: number | null;
    additional_creation_pro: number | null;
  };
}

interface UseEditorValidationArgs {
  templateId: string;
  data: Record<string, unknown>;
  isPremiumTemplate: boolean;
  isEffectivelyFreeUser: boolean;
  profile: ProfileSubscriptionShape | null;
}

export type PrePublishGuard = "upgrade" | "paid-quota" | null;

export function useEditorValidation({
  templateId,
  data,
  isPremiumTemplate,
  isEffectivelyFreeUser,
  profile,
}: UseEditorValidationArgs) {
  const validateContent = useCallback(() => {
    if (templateId === "relationship-quiz" && data.questions) {
      const validation = validateQuizQuestions(data.questions as QuizQuestion[]);
      if (!validation.isValid) {
        toast.error(
          validation.errors[0] || "יש להשלים את כל השאלות לפני היצירה",
        );
        return false;
      }
    }
    return true;
  }, [templateId, data]);

  const computeGuard = useCallback((): PrePublishGuard => {
    if (isPremiumTemplate && isEffectivelyFreeUser) return "upgrade";
    if (!isEffectivelyFreeUser && profile) {
      const { creations_count_pro, creation_limit, additional_creation_pro } =
        profile.subscription;
      if (
        creation_limit !== null &&
        creations_count_pro >= creation_limit + (additional_creation_pro ?? 0)
      ) {
        return "paid-quota";
      }
    }
    return null;
  }, [isPremiumTemplate, isEffectivelyFreeUser, profile]);

  return { validateContent, computeGuard };
}
