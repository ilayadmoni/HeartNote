"use client";

/**
 * ConfirmModalHeader — avatar, title/subtitle, and the free/pro tier picker
 * for CreationConfirmModal. Extracted for modularity (150-line file cap).
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TierCard } from "./TierCard";

type QuotaPreference = "free" | "pro";

interface ConfirmModalHeaderProps {
  avatar?: string | null;
  initials: string;
  isPremiumTemplate: boolean;
  isPaidTier: boolean;
  selectedQuota: QuotaPreference;
  freeUsed: number;
  proUsed: number;
  freeTotalAllowed: number;
  proTotalAllowed: number | null;
  freeRemaining: number;
  proRemaining: number | typeof Infinity;
  onSelectTier: (tier: QuotaPreference) => void;
}

export function ConfirmModalHeader({
  avatar, initials, isPremiumTemplate, isPaidTier, selectedQuota,
  freeUsed, proUsed, freeTotalAllowed, proTotalAllowed, freeRemaining, proRemaining, onSelectTier,
}: ConfirmModalHeaderProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 300 }} className="flex justify-center mb-2">
        {avatar
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover border-3 border-accent/25 shadow-soft" />
          : <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-base font-bold text-accent-ink shadow-soft border-3 border-accent/25">{initials}</div>
        }
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-3">
        <h2 className="text-title-sm font-bold text-ink mb-0.5">{t("confirmModal.title")}</h2>
        <p className="text-caption text-ink-muted">{t("confirmModal.subtitle")}</p>
      </motion.div>

      {!isPremiumTemplate && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="mb-3">
          <p className="text-caption font-bold text-ink text-end mb-1.5">{t("confirmModal.tierSectionTitle")}</p>
          <div className="grid grid-cols-2 gap-3">
            <TierCard tier="free" used={freeUsed} totalAllowed={freeTotalAllowed}
              isSelected={selectedQuota === "free"} isDisabled={freeRemaining === 0}
              isUpgradeRequired={false} onSelect={() => onSelectTier("free")} />
            <TierCard tier="pro" used={proUsed} totalAllowed={proTotalAllowed}
              isSelected={selectedQuota === "pro"} isDisabled={proRemaining === 0}
              isUpgradeRequired={!isPaidTier} onSelect={() => onSelectTier("pro")} />
          </div>
        </motion.div>
      )}
    </>
  );
}
