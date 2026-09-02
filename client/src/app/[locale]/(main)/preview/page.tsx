"use client";

/**
 * Template Preview Page
 * Internal QA tool for previewing template components in isolation.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  DateInvite,
  ScratchCard,
  Timeline,
  LoveCoupons,
  RelationshipQuiz,
  OpenWhen,
} from "@/components/templates";
import { SAMPLE_DATA, PREVIEW_TEMPLATES, type PreviewTemplateKey } from "./preview.sample-data";

export default function TemplatePreviewPage(): JSX.Element {
  const t = useTranslations("editor");
  const [activeTemplate, setActiveTemplate] = useState<PreviewTemplateKey>("DateInvite");

  return (
    <div className="min-h-[100dvh] bg-surface-sunken">
      {/* Template Selector */}
      <div className="sticky top-0 z-50 bg-surface-raised/80 backdrop-blur-md border-b border-line">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {PREVIEW_TEMPLATES.map(({ key, labelKey }) => (
              <button
                key={key}
                onClick={() => setActiveTemplate(key)}
                className={`px-4 py-2 rounded-pill text-body-sm font-bold whitespace-nowrap transition-colors ${
                  activeTemplate === key
                    ? "bg-accent text-accent-ink"
                    : "bg-surface-sunken text-ink-muted hover:bg-line"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Template Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTemplate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTemplate === "DateInvite" && <DateInvite data={SAMPLE_DATA.DateInvite} />}
          {activeTemplate === "ScratchCard" && <ScratchCard data={SAMPLE_DATA.ScratchCard} />}
          {activeTemplate === "Timeline" && <Timeline data={SAMPLE_DATA.Timeline} />}
          {activeTemplate === "LoveCoupons" && <LoveCoupons data={SAMPLE_DATA.LoveCoupons} />}
          {activeTemplate === "RelationshipQuiz" && <RelationshipQuiz data={SAMPLE_DATA.RelationshipQuiz} />}
          {activeTemplate === "OpenWhen" && <OpenWhen data={SAMPLE_DATA.OpenWhen} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
