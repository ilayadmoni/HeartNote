"use client";

/**
 * TemplateCard Component
 * Individual template card with animated preview, name, description,
 * info button, and a premium/free badge.
 */

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Info, Lock } from "lucide-react";
import { TemplatePreview } from "./TemplatePreview";
import { TemplateInfoModal } from "./TemplateInfoModal";
import { infoKeyFor } from "../data/templates";
import { pressable, transitions, useMotionOk } from "@/lib/motion";
import type { TemplateCardProps } from "../types";

export function TemplateCard({ template, className = "", onClick }: TemplateCardProps): JSX.Element {
  const t = useTranslations("gallery");
  const motionOk = useMotionOk();
  const [showInfo, setShowInfo] = useState(false);

  const infoKey = infoKeyFor(template.id);
  const name = t.has(template.nameKey) ? t(template.nameKey) : template.dbName ?? template.id;
  const description = t.has(template.descriptionKey) ? t(template.descriptionKey) : "";

  return (
    <>
      <motion.div
        initial={motionOk ? { opacity: 0, y: 20 } : false}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={transitions.enter}
        className={`relative group bg-surface-raised rounded-card overflow-hidden shadow-card transition-shadow duration-base ease-out-quint border border-line hover:shadow-lift ${className}`}
      >
        <div>
          {/* Preview Container */}
          <div className="relative aspect-[7/3] bg-gradient-to-br from-cream-50 to-cream-200 overflow-hidden">
            {/* Badges */}
            <div className="absolute top-3 start-3 end-3 flex justify-between items-start z-10">
              {template.isPremium ? (
                <span className="px-2.5 py-1 bg-accent text-accent-ink text-caption font-bold rounded-pill shadow-soft flex items-center gap-1">
                  <Lock size={11} aria-hidden="true" />
                  {t("badges.premium")}
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-cream-200 text-ink-muted text-caption font-bold rounded-pill">
                  {t("badges.free")}
                </span>
              )}

              {infoKey && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowInfo(true);
                  }}
                  className="shrink-0 w-8 h-8 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-pill text-ink-subtle hover:text-accent hover:bg-accent-soft transition-colors duration-base -mt-1 -me-1"
                  aria-label={t("card.infoAria", { title: name })}
                >
                  <Info size={18} strokeWidth={2.2} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Animated Preview */}
            <div className="w-full h-full flex items-center justify-center">
              <TemplatePreview componentKey={template.componentKey} />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-base" />
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3 className="text-title-sm text-ink mb-2 group-hover:text-accent transition-colors duration-base">
              {name}
            </h3>

            <p className="text-body-sm text-ink-muted mb-4 line-clamp-2 leading-relaxed">{description}</p>

            {/* CTA Button */}
            <div className="w-full">
              {onClick ? (
                <motion.button
                  {...pressable}
                  onClick={() => onClick(template)}
                  className="w-full py-2.5 rounded-pill font-bold text-body-sm bg-accent text-accent-ink hover:bg-accent-hover transition-colors duration-base"
                >
                  {t("card.cta")}
                </motion.button>
              ) : (
                <Link href={template.link} className="block w-full">
                  <motion.button
                    {...pressable}
                    className="w-full py-2.5 rounded-pill font-bold text-body-sm bg-accent text-accent-ink hover:bg-accent-hover transition-colors duration-base"
                  >
                    {t("card.cta")}
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Info Modal — rendered outside the card to avoid z-index issues */}
      {infoKey && (
        <TemplateInfoModal
          isOpen={showInfo}
          onClose={() => setShowInfo(false)}
          title={name}
          description={description}
          infoText={t(infoKey)}
        />
      )}
    </>
  );
}
