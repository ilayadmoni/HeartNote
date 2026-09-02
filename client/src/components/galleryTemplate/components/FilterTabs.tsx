"use client";

/**
 * FilterTabs Component
 * Category filter pills for the gallery — horizontal scroll-snap row,
 * each tab an icon + translated label.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMotionOk } from "@/lib/motion";
import type { FilterTabsProps } from "../types";

export function FilterTabs({ tabs, activeTab, onTabChange, className = "" }: FilterTabsProps): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();

  return (
    <div
      className={`flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:justify-center md:overflow-visible ${className}`}
    >
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            type="button"
            initial={motionOk ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
            className={`
              relative shrink-0 snap-start flex items-center gap-1.5
              px-4 py-2 md:px-5 md:py-2.5 rounded-pill text-body-sm font-bold
              transition-colors duration-base ease-out-quint border
              ${
                isActive
                  ? "bg-accent text-accent-ink border-accent shadow-glow-sm"
                  : "bg-surface-raised text-ink-muted border-line hover:border-accent hover:text-accent"
              }
            `}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{t(tab.labelKey)}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
