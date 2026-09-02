"use client";

/**
 * PricingHeader Component
 * Header section with title and subtitle
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { transitions } from "@/lib/motion";
import type { PricingHeaderProps } from "../types";

export function PricingHeader({ className = "" }: PricingHeaderProps): JSX.Element {
  const t = useTranslations("pricing");

  return (
    <div className={`text-center mb-12 lg:mb-16 ${className}`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.enter}
        className="text-display-lg font-black text-ink mb-4"
      >
        {t("header.title")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transitions.enter, delay: 0.1 }}
        className="text-body-lg text-ink-muted max-w-prose mx-auto"
      >
        {t("header.subtitle")}
      </motion.p>
    </div>
  );
}
