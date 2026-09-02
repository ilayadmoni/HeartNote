"use client";

/** Single timeline-event editing card — extracted from TimelineEventsEditor.tsx (150-line file cap). */

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import type { TimelineEvent } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";
import { TIMELINE_EMOJI_OPTIONS } from "./timelineEventsEditor.constants";

interface TimelineEventItemProps {
  event: TimelineEvent;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof TimelineEvent, value: string) => void;
}

const inputClass =
  "w-full px-3 py-2 text-body-sm rounded-control border border-line-strong bg-surface-raised text-ink " +
  "placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25";

export function TimelineEventItem({ event, index, onRemove, onUpdate }: TimelineEventItemProps): JSX.Element {
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
        <span className="text-caption font-bold text-ink-muted">{t("timeline.eventLabel", { num: index + 1 })}</span>
        <button
          onClick={() => onRemove(event.id)}
          className="p-1 text-ink-subtle hover:text-red-500 transition-colors rounded-control hover:bg-red-50 dark:hover:bg-red-900/20"
          title={t("timeline.deleteEvent")}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {TIMELINE_EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onUpdate(event.id, "icon", emoji)}
            className={`w-7 h-7 rounded-control text-body-sm flex items-center justify-center transition-colors ${
              event.icon === emoji ? "bg-accent shadow-soft scale-110" : "bg-surface-raised hover:bg-surface-sunken"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <BrandCalendar value={event.date} onChange={(val) => onUpdate(event.id, "date", val)} />

      <LimitedInput
        value={event.title}
        onChange={(v) => onUpdate(event.id, "title", v)}
        maxLength={CHAR_LIMITS.TITLE}
        placeholder={t("timeline.titlePlaceholder")}
        className={inputClass}
      />

      <LimitedInput
        value={event.description || ""}
        onChange={(v) => onUpdate(event.id, "description", v)}
        maxLength={CHAR_LIMITS.BODY}
        placeholder={t("timeline.descriptionPlaceholder")}
        className={inputClass}
      />
    </motion.div>
  );
}
