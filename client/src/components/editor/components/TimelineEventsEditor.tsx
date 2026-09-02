"use client";

/**
 * TimelineEventsEditor Component
 * Dynamic editor for timeline events - add/remove up to 7 events.
 * The single-item card lives in TimelineEventItem.tsx (150-line file cap).
 */

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { TimelineEvent } from "@/components/templates/types";
import { TimelineEventItem } from "./TimelineEventItem";
import { TIMELINE_EMOJI_OPTIONS, MAX_TIMELINE_EVENTS } from "./timelineEventsEditor.constants";

interface TimelineEventsEditorProps {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
}

export function TimelineEventsEditor({ events = [], onChange }: TimelineEventsEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const canAddMore = events.length < MAX_TIMELINE_EVENTS;

  const addEvent = () => {
    if (!canAddMore) return;
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      icon: TIMELINE_EMOJI_OPTIONS[events.length % TIMELINE_EMOJI_OPTIONS.length],
    };
    onChange([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    onChange(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <TimelineEventItem key={event.id} event={event} index={index} onRemove={removeEvent} onUpdate={updateEvent} />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addEvent}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-body-sm font-bold text-accent bg-accent-soft hover:bg-accent-soft/70 rounded-control transition-colors"
        >
          <Plus size={16} />
          <span>{t("timeline.addEvent", { count: events.length, max: MAX_TIMELINE_EVENTS })}</span>
        </motion.button>
      )}

      {!canAddMore && (
        <p className="text-caption text-center text-ink-subtle">{t("timeline.maxReached", { max: MAX_TIMELINE_EVENTS })}</p>
      )}
    </div>
  );
}
