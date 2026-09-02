"use client";

import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface UpdatePasswordStatusProps {
  variant: "expired" | "success";
}

/** Shared expired-link / success confirmation panels for UpdatePasswordForm. */
export function UpdatePasswordStatus({ variant }: UpdatePasswordStatusProps) {
  const t = useTranslations("auth");

  if (variant === "expired") {
    return (
      <div className="text-center py-4">
        <h3 className="text-title-sm font-bold text-ink mb-2">{t("updatePassword.expiredTitle")}</h3>
        <p className="text-body-sm text-ink-muted">{t("updatePassword.expiredMessage")}</p>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
      <h3 className="text-title-sm font-bold text-ink mb-2">{t("updatePassword.success")}</h3>
      <p className="text-body-sm text-ink-muted leading-relaxed">{t("updatePassword.successSubtitle")}</p>
    </div>
  );
}
