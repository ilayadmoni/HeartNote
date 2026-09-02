"use client";

/**
 * CreationDetails — Bottom stats box inside CreationConfirmModal.
 * Shows: template name, expiry date, remaining after this creation, and tier badge.
 * Logic is unchanged from the original modal — only extracted for modularity.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CreationDetailsProps {
  templateName: string;
  expirationDate: string;
  /** Remaining quota after this creation is made */
  remainingAfterCreate: number | typeof Infinity;
  selectedQuota: "free" | "pro";
}

export function CreationDetails({ templateName, expirationDate, remainingAfterCreate, selectedQuota }: CreationDetailsProps): JSX.Element {
  const t = useTranslations("editor");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-surface-sunken rounded-control p-2.5 mb-3"
    >
      {/* Expiry + remaining grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-control bg-surface-raised border border-line p-2 text-end">
          <p className="text-[10px] text-ink-muted mb-0.5">{t("confirmModal.expiryLabel")}</p>
          <p className="text-caption font-bold text-ink">{expirationDate}</p>
        </div>

        <div className="rounded-control bg-surface-raised border border-line p-2 text-end">
          <p className="text-[10px] text-ink-muted mb-0.5">{t("confirmModal.remainingLabel")}</p>
          <motion.p
            key={remainingAfterCreate === Infinity ? "unlimited" : `${selectedQuota}-${remainingAfterCreate}`}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            className="text-caption font-bold text-ink"
          >
            {remainingAfterCreate === Infinity ? t("confirmModal.unlimited") : remainingAfterCreate}
          </motion.p>
        </div>
      </div>

      {/* Tier badge */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-pill text-accent-ink ${selectedQuota === "pro" ? "bg-accent" : "bg-navy-600"}`}>
          {selectedQuota === "pro" ? t("confirmModal.premiumBadge") : t("confirmModal.freeBadge")}
        </span>
      </div>
    </motion.div>
  );
}
