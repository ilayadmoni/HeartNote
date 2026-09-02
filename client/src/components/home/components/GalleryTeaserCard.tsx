"use client";

/**
 * GalleryTeaserCard Component
 * Template preview card for the home page gallery teaser bento grid.
 */

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { TemplatePreview } from "@/components/galleryTemplate/components";
import { fadeUp, transitions } from "@/lib/motion";
import type { TemplateComponentKey } from "@/components/galleryTemplate/types";

export interface TeaserCardData {
  id: string;
  nameKey: string;
  descriptionKey: string;
  isPremium: boolean;
  componentKey: TemplateComponentKey;
}

interface GalleryTeaserCardProps {
  template: TeaserCardData;
  onClick?: () => void;
  featured?: boolean;
}

export function GalleryTeaserCard({ template, onClick, featured = false }: GalleryTeaserCardProps): JSX.Element {
  const t = useTranslations("home.gallery");
  const tGallery = useTranslations("gallery");

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={transitions.spring}
      onClick={onClick}
      className="group bg-surface-raised rounded-card overflow-hidden border border-line hover:border-accent/40 hover:shadow-lift transition-shadow duration-base ease-out-quint cursor-pointer flex flex-col"
    >
      <div className={`relative w-full bg-surface-sunken border-b border-line ${featured ? "h-56" : "h-40"}`}>
        <TemplatePreview componentKey={template.componentKey} />

        {template.isPremium && (
          <div className="absolute top-3 end-3 bg-accent text-accent-ink p-1.5 rounded-pill shadow-soft z-20">
            <Crown size={14} fill="currentColor" />
          </div>
        )}

        <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity duration-base flex items-center justify-center">
          <span className="text-white border border-white px-4 py-2 rounded-pill text-body-sm font-bold group-hover:bg-white group-hover:text-ink transition-colors">
            {t("viewTemplate")}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className={`text-title-sm text-ink group-hover:text-accent transition-colors mb-2 ${featured ? "text-title-md" : ""}`}>
          {tGallery(template.nameKey)}
        </h3>
        <p className="text-body-sm text-ink-muted">{tGallery(template.descriptionKey)}</p>
      </div>
    </motion.div>
  );
}
