"use client";

import { useTranslations } from "next-intl";

interface CompleteProfileReasonAlertProps {
  reason: string | null;
}

/** Contextual banner shown when middleware redirected here for a specific reason. */
export function CompleteProfileReasonAlert({ reason }: CompleteProfileReasonAlertProps) {
  const t = useTranslations("auth");

  if (reason === "profile_access") {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-control p-3 mb-4">
        <p className="text-body-sm text-amber-800 dark:text-amber-200 text-center">
          {t("completeProfile.reasonProfileAccess")}
        </p>
      </div>
    );
  }

  if (reason === "incomplete_profile") {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-control p-3 mb-4">
        <p className="text-body-sm text-blue-800 dark:text-blue-200 text-center">
          {t("completeProfile.reasonIncompleteProfile")}
        </p>
      </div>
    );
  }

  return null;
}
