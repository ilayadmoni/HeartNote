"use client";

/**
 * EditorSidebar Component
 * Form fields for editing template data
 * Compact mobile-friendly design with scrollable content
 */

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { EditorField } from "./EditorField";
import { ExpirationBanner } from "./ExpirationBanner";
import type { EditorSidebarProps } from "../types";

export function EditorSidebar({
  config,
  data,
  onChange,
}: EditorSidebarProps): JSX.Element {
  const t = useTranslations("editor");
  // Deduplicate fields by key — prevents duplicate form inputs when the
  // config_schema accidentally contains repeated keys.
  const uniqueFields = config.fields.filter(
    (field, index, arr) => arr.findIndex((f) => f.key === field.key) === index,
  );
  const description = config.description ?? (config.descriptionKey ? t(config.descriptionKey) : "");

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header - Fixed */}
      <div className="flex-shrink-0 px-4 sm:px-5 pt-2 pb-3 border-b border-line">
        <h2 className="text-body-md font-bold text-ink">
          {t("sidebar.heading")}
        </h2>
        <p className="text-caption text-ink-subtle mt-0.5">
          {description}
        </p>
      </div>

      {/* Form Fields - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
        <ExpirationBanner slug={config.templateId} />
        {uniqueFields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <EditorField
              field={field}
              value={data[field.key]}
              onChange={(value) => onChange(field.key, value)}
              templateId={config.templateId}
            />
          </motion.div>
        ))}
      </div>

      {/* Footer Hint - Fixed */}
      <div className="flex-shrink-0 px-4 sm:px-5 py-3 border-t border-line bg-surface-sunken/50">
        <p className="text-caption text-ink-subtle text-center flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-accent" />
          <span>{t("sidebar.livePreview")}</span>
        </p>
      </div>
    </div>
  );
}
