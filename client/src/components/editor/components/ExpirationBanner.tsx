/**
 * ExpirationBanner Component
 * Premium-styled banner showing the creation's expiration date
 * Displayed at the top of the editor for time-limited templates
 */

"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useExpirationPolicy } from "@/hooks/useExpirationPolicy";

interface ExpirationBannerProps {
  slug: string;
}

export function ExpirationBanner({ slug }: ExpirationBannerProps) {
  const { expirationDate, loading } = useExpirationPolicy(slug);

  if (loading || !expirationDate) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative overflow-hidden rounded-xl
        bg-gradient-to-l from-[#d4826f]/10 via-[#e8917a]/8 to-[#C7CEEA]/10
        dark:from-[#d4826f]/15 dark:via-[#e8917a]/10 dark:to-[#C7CEEA]/15
        border border-[#d4826f]/20 dark:border-[#d4826f]/30
        px-4 py-3
      "
    >
      {/* Decorative gradient line at top */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-[#d4826f] via-[#e8917a] to-[#C7CEEA]" />

      <div className="flex items-center gap-2.5 text-right">
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-[#d4826f]/15 dark:bg-[#d4826f]/25">
          <Clock size={14} className="text-[#d4826f] dark:text-[#e8917a]" />
        </span>
        <p className="text-sm font-medium text-[#2e3c52] dark:text-gray-200 text-hebrew-body">
          <span className="text-gray-500 dark:text-gray-400">
            תוקף היצירה:{" "}
          </span>
          <span className="font-bold text-[#d4826f] dark:text-[#e8917a]">
            {expirationDate}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
