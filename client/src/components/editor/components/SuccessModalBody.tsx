"use client";

/** Verification code + share-link block for SuccessModal. Extracted for the 150-line file cap. */

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useTranslations } from "next-intl";

interface SuccessModalBodyProps {
  shareUrl: string;
  verificationCode?: string | null;
  copied: boolean;
  onCopy: () => void;
}

export function SuccessModalBody({ shareUrl, verificationCode, copied, onCopy }: SuccessModalBodyProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <div className="p-4">
      {verificationCode && (
        <div className="mb-4">
          <label className="block text-caption font-medium text-ink-muted mb-2">{t("success.verificationLabel")}</label>
          <div className="flex justify-center gap-2 mb-2" dir="ltr" aria-label={t("success.verificationAria")}>
            {verificationCode.split("").map((digit, idx) => (
              <span key={idx} className="w-10 h-12 flex items-center justify-center rounded-control bg-accent-soft border-2 border-accent/30 text-xl font-bold text-ink font-mono">
                {digit}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-ink-muted text-center leading-relaxed">{t("success.verificationHint")}</p>
        </div>
      )}

      <label className="block text-caption font-medium text-ink-muted mb-2">{t("success.linkLabel")}</label>
      <div className="flex gap-1.5 mb-4">
        <input
          type="text" value={shareUrl} readOnly
          className="flex-1 min-w-0 px-3 py-2 bg-surface-sunken text-ink rounded-control text-body-md border-0 font-mono"
          dir="ltr"
        />
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className={`flex-shrink-0 px-3 py-2 rounded-control transition-colors ${
            copied ? "bg-green-500 text-white" : "bg-accent hover:bg-accent-hover text-accent-ink"
          }`}
          aria-label={t("success.copyAria")}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </motion.button>
      </div>
    </div>
  );
}
