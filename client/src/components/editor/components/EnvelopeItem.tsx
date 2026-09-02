"use client";

/** Single envelope editing card — extracted from EnvelopesEditor.tsx (150-line file cap). */

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import type { OpenWhenEnvelope } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

interface EnvelopeItemProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof OpenWhenEnvelope, value: string) => void;
  canRemove: boolean;
}

const inputClass =
  "w-full px-3 py-2 text-body-sm rounded-control border border-line-strong bg-surface-raised text-ink " +
  "placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25";

export function EnvelopeItem({ envelope, index, onRemove, onUpdate, canRemove }: EnvelopeItemProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-sunken rounded-card p-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-caption font-bold text-ink-muted">{t("envelopes.envelopeLabel", { num: index + 1 })}</span>
        {canRemove && (
          <button
            onClick={() => onRemove(envelope.id)}
            className="p-1 text-ink-subtle hover:text-red-500 transition-colors rounded-control hover:bg-red-50 dark:hover:bg-red-900/20"
            title={t("envelopes.deleteEnvelope")}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <LimitedInput
        value={envelope.title}
        onChange={(v) => onUpdate(envelope.id, "title", v)}
        maxLength={CHAR_LIMITS.ENVELOPE_TITLE}
        placeholder={t("envelopes.titlePlaceholder")}
        className={inputClass}
      />

      <BrandCalendar
        value={envelope.dateOpen}
        onChange={(val) => onUpdate(envelope.id, "dateOpen", val)}
        className="w-full min-w-0 box-border"
      />

      <LimitedInput
        value={envelope.content}
        onChange={(v) => onUpdate(envelope.id, "content", v)}
        maxLength={CHAR_LIMITS.BODY}
        placeholder={t("envelopes.contentPlaceholder")}
        className={`${inputClass} resize-none`}
        multiline
        rows={3}
      />
    </motion.div>
  );
}
