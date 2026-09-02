"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface ForgotPasswordSuccessProps {
  onBack: () => void;
}

export function ForgotPasswordSuccess({ onBack }: ForgotPasswordSuccessProps) {
  const t = useTranslations("auth");
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-3">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
        </div>
      </div>
      <h3 className="text-title-sm font-bold text-ink mb-2">{t("forgotPassword.requestReceived")}</h3>
      <p className="text-body-sm text-ink-muted mb-4 leading-relaxed">
        {t("forgotPassword.success")}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 mx-auto text-body-sm text-accent hover:text-accent-hover transition-colors"
      >
        <ArrowRight size={16} className="ltr:-scale-x-100" />
        {t("forgotPassword.back")}
      </button>
    </div>
  );
}
