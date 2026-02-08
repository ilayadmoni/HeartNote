"use client";

/**
 * TimelineEventsEditor Component
 * Dynamic editor for timeline events - add/remove up to 7 events
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimelineEvent } from "@/components/templates/types";

interface TimelineEventsEditorProps {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
}

const EMOJI_OPTIONS = [
  "📅",
  "💖",
  "⭐",
  "🎉",
  "💍",
  "🏠",
  "✈️",
  "🎂",
  "💕",
  "🌟",
];
const MAX_EVENTS = 7;

export function TimelineEventsEditor({
  events = [],
  onChange,
}: TimelineEventsEditorProps) {
  const canAddMore = events.length < MAX_EVENTS;

  const addEvent = () => {
    if (!canAddMore) return;
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: "",
      description: "",
      icon: EMOJI_OPTIONS[events.length % EMOJI_OPTIONS.length],
    };
    onChange([...events, newEvent]);
  };

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const updateEvent = (
    id: string,
    field: keyof TimelineEvent,
    value: string,
  ) => {
    onChange(events.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-3">
      {/* Events List */}
      <AnimatePresence mode="popLayout">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2"
          >
            {/* Event Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 text-hebrew-body">
                אירוע {index + 1}
              </span>
              <button
                onClick={() => removeEvent(event.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                title="מחק אירוע"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Icon Picker */}
            <div className="flex gap-1 flex-wrap">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => updateEvent(event.id, "icon", emoji)}
                  className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    event.icon === emoji
                      ? "bg-[#d4826f] shadow-sm scale-110"
                      : "bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Date Input */}
            <input
              type="date"
              value={event.date}
              onChange={(e) => updateEvent(event.id, "date", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50"
            />

            {/* Title Input */}
            <input
              type="text"
              value={event.title}
              onChange={(e) => updateEvent(event.id, "title", e.target.value)}
              placeholder="כותרת האירוע"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body"
            />

            {/* Description Input */}
            <input
              type="text"
              value={event.description || ""}
              onChange={(e) =>
                updateEvent(event.id, "description", e.target.value)
              }
              placeholder="תיאור קצר (אופציונלי)"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add Event Button */}
      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addEvent}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-[#d4826f] bg-[#d4826f]/10 hover:bg-[#d4826f]/20 rounded-xl transition-colors text-hebrew-body"
        >
          <Plus size={16} />
          <span>
            הוסף אירוע ({events.length}/{MAX_EVENTS})
          </span>
        </motion.button>
      )}

      {/* Max Events Warning */}
      {!canAddMore && (
        <p className="text-xs text-center text-gray-400 text-hebrew-body">
          הגעת למקסימום {MAX_EVENTS} אירועים
        </p>
      )}
    </div>
  );
}
