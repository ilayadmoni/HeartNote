"use client";

/**
 * Shared empty / error / loading states for the gallery grid, plus a
 * skeleton loader shaped like TemplateCard so the loading state doesn't jump.
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { SearchX, AlertTriangle } from "lucide-react";
import { fadeIn, useMotionOk } from "@/lib/motion";

export function GalleryEmptyState(): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();

  return (
    <motion.div
      initial={motionOk ? "hidden" : false}
      animate="visible"
      variants={fadeIn}
      className="text-center py-16"
    >
      <SearchX size={40} className="mx-auto mb-4 text-ink-subtle" aria-hidden="true" />
      <p className="text-title-sm text-ink mb-1">{t("states.empty")}</p>
      <p className="text-body-sm text-ink-muted">{t("states.emptyHint")}</p>
    </motion.div>
  );
}

export function GalleryErrorState(): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();

  return (
    <motion.div
      initial={motionOk ? "hidden" : false}
      animate="visible"
      variants={fadeIn}
      className="text-center py-16"
    >
      <AlertTriangle size={40} className="mx-auto mb-4 text-accent" aria-hidden="true" />
      <p className="text-body-lg text-ink-muted">{t("states.error")}</p>
    </motion.div>
  );
}

export function GallerySkeletonGrid({ count = 8 }: { count?: number }): JSX.Element {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-card border border-line bg-surface-raised overflow-hidden animate-pulse">
          <div className="aspect-[7/3] bg-surface-sunken" />
          <div className="p-4 md:p-5 space-y-3">
            <div className="h-4 w-2/3 rounded bg-surface-sunken" />
            <div className="h-3 w-full rounded bg-surface-sunken" />
            <div className="h-9 w-full rounded-pill bg-surface-sunken" />
          </div>
        </div>
      ))}
    </div>
  );
}
