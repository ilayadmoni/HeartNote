"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Disc3 } from "lucide-react";
import { TemplatePreview } from "../../galleryTemplate/components/TemplatePreview";
import type { Step1CardMeta } from "../constants/step1Cards";

interface Step1CardProps {
  card: Step1CardMeta;
  ctaId?: string;
}

const BADGE_STYLES: Record<Step1CardMeta["badgeVariant"], string> = {
  free: "bg-emerald-500",
  new: "bg-ink",
};

export function Step1Card({ card, ctaId }: Step1CardProps): JSX.Element {
  const t = useTranslations(`demo.step1.cards.${card.key}`);

  return (
    <div className="bg-surface rounded-card shadow-soft border border-line overflow-hidden flex flex-col relative w-full">
      <div className="relative h-[170px] bg-surface-sunken flex items-center justify-center p-4">
        <div className={`absolute top-4 end-4 ${BADGE_STYLES[card.badgeVariant]} text-white text-[12px] font-bold px-3 py-1 rounded-pill z-10 shadow-soft leading-none`}>
          {t("badge")}
        </div>
        {card.componentKey ? (
          <div className="h-full w-full flex items-center justify-center scale-90">
            <TemplatePreview componentKey={card.componentKey} />
          </div>
        ) : (
          <div className="h-24 w-full max-w-[150px] bg-accent-soft rounded-card flex items-center justify-center mx-auto shadow-soft">
            <Disc3 className="text-accent w-10 h-10" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col text-start">
        <h4 className="text-accent text-title-md mb-2 leading-none">{t("title")}</h4>
        <p className="text-body-sm text-ink-muted mb-5 leading-relaxed">{t("description")}</p>
        <motion.button
          id={ctaId}
          type="button"
          className="w-full bg-accent text-accent-ink text-center py-3 rounded-control text-body-md font-bold shadow-soft"
          aria-label={t("ariaCta")}
        >
          {t("cta")}
        </motion.button>
      </div>
    </div>
  );
}
