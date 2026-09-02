/**
 * ExpirationBanner Component
 * Premium-styled banner showing the creation's expiration date
 * Displayed at the top of the editor for time-limited templates
 */

"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExpirationPolicy } from "@/hooks/useExpirationPolicy";

interface ExpirationBannerProps {
  slug: string;
}

export function ExpirationBanner({ slug }: ExpirationBannerProps): JSX.Element | null {
  const t = useTranslations("editor");
  const { expirationDate, loading } = useExpirationPolicy(slug);

  if (loading || !expirationDate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-control bg-accent-soft border border-accent/20 px-4 py-3"
    >
      {/* Decorative accent line at top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-accent" />

      <div className="flex items-center gap-2.5 text-end">
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-accent/15">
          <Clock size={14} className="text-accent" />
        </span>
        <p className="text-body-sm font-medium text-ink">
          <span className="text-ink-muted">{t("expiration.label")} </span>
          <span className="font-bold text-accent">{expirationDate}</span>
        </p>
      </div>
    </motion.div>
  );
}
