"use client";

/**
 * GalleryTemplateMobile Component
 * Mobile view for the gallery template page (single column).
 * Receives pre-filtered templates and all filter state as props.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  FilterTabs,
  TemplateCard,
  GalleryEmptyState,
  GalleryErrorState,
  GallerySkeletonGrid,
} from "../components";
import { GallerySearchBar } from "@/components/GallerySearchBar";
import { fadeUp, useMotionOk } from "@/lib/motion";
import type { GalleryTemplateViewProps } from "../types";

export function GalleryTemplateMobile({
  className = "",
  templates,
  loading,
  error,
  activeTab,
  onTabChange,
  tabs,
  searchQuery,
  onSearchChange,
  onTemplateClick,
}: GalleryTemplateViewProps): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();

  return (
    <section className={`min-h-[100dvh] bg-surface transition-colors duration-base ${className}`}>
      <div className="px-gutter py-section-sm">
        <motion.div
          initial={motionOk ? "hidden" : false}
          animate="visible"
          variants={fadeUp}
          className="mb-6 text-center"
        >
          <h1 className="text-title-lg text-ink mb-2">{t("header.title")}</h1>
          <p className="text-body-sm text-ink-muted">{t("header.subtitle")}</p>
        </motion.div>

        <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} className="mb-6 -mx-gutter px-gutter" />

        <GallerySearchBar value={searchQuery} onChange={onSearchChange} className="mb-6" />

        {loading ? (
          <GallerySkeletonGrid count={4} />
        ) : error ? (
          <GalleryErrorState />
        ) : templates.length === 0 ? (
          <GalleryEmptyState />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${searchQuery}`}
              initial={motionOk ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4"
            >
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={motionOk ? { opacity: 0, y: 15 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TemplateCard template={template} onClick={onTemplateClick} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
