"use client";

/**
 * GalleryTemplateDesktop Component
 * Desktop view for the gallery template page (responsive grid).
 * Receives pre-filtered templates and all filter state as props.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  GalleryHeader,
  FilterTabs,
  TemplateCard,
  GalleryEmptyState,
  GalleryErrorState,
  GallerySkeletonGrid,
} from "../components";
import { GallerySearchBar } from "@/components/GallerySearchBar";
import { useMotionOk } from "@/lib/motion";
import type { GalleryTemplateViewProps } from "../types";

export function GalleryTemplateDesktop({
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
      <div className="section-shell py-section-sm">
        <GalleryHeader title={t("header.title")} subtitle={t("header.subtitle")} className="mb-10" />

        <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} className="mb-10" />

        <GallerySearchBar value={searchQuery} onChange={onSearchChange} className="mb-8" />

        {loading ? (
          <GallerySkeletonGrid />
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={motionOk ? { opacity: 0, y: 20 } : false}
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
