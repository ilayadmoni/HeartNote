"use client";

/**
 * EnvelopesEditor Component
 * Timeline-style editor for OpenWhen envelopes — up to 6 items
 * Each item: title (headline), dateOpen, content (textarea)
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandCalendar } from "@/components/ui/BrandCalendar";
import type { OpenWhenEnvelope } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

const MAX_ENVELOPES = 6;

/** Default emoji choices for new envelopes (internal, not shown to user) */
const FALLBACK_EMOJIS = ["💌", "😢", "😊", "💪", "🎉", "💖"];

interface EnvelopesEditorProps {
  envelopes: OpenWhenEnvelope[];
  onChange: (envelopes: OpenWhenEnvelope[]) => void;
}

export function EnvelopesEditor({ envelopes = [], onChange }: EnvelopesEditorProps) {
  const canAddMore = envelopes.length < MAX_ENVELOPES;

  const addEnvelope = () => {
    if (!canAddMore) return;
    const newEnvelope: OpenWhenEnvelope = {
      id: `env-${Date.now()}`,
      title: "",
      content: "",
      dateOpen: new Date().toISOString().split("T")[0],
    };
    onChange([...envelopes, newEnvelope]);
  };

  const removeEnvelope = (id: string) => {
    onChange(envelopes.filter((e) => e.id !== id));
  };

  const updateEnvelope = (id: string, field: keyof OpenWhenEnvelope, value: string) => {
    onChange(envelopes.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {envelopes.map((env, index) => (
          <EnvelopeItem
            key={env.id}
            envelope={env}
            index={index}
            onRemove={removeEnvelope}
            onUpdate={updateEnvelope}
          />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addEnvelope}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-[#d4826f] bg-[#d4826f]/10 hover:bg-[#d4826f]/20 rounded-xl transition-colors text-hebrew-body"
        >
          <Plus size={16} />
          <span>הוסף מעטפה ({envelopes.length}/{MAX_ENVELOPES})</span>
        </motion.button>
      )}
    </div>
  );
}

/** Single envelope editing card */
interface EnvelopeItemProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof OpenWhenEnvelope, value: string) => void;
}

function EnvelopeItem({ envelope, index, onRemove, onUpdate }: EnvelopeItemProps) {
  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 text-hebrew-body">
          מעטפה {index + 1}
        </span>
        <button
          onClick={() => onRemove(envelope.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          title="מחק מעטפה"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Title */}
      <LimitedInput
        value={envelope.title}
        onChange={(v) => onUpdate(envelope.id, "title", v)}
        maxLength={CHAR_LIMITS.ENVELOPE_TITLE}
        placeholder="כותרת (למשל: כשאת עצובה)"
        className={inputClass}
      />

      {/* Date Open */}
      <BrandCalendar
        value={envelope.dateOpen}
        onChange={(val) => onUpdate(envelope.id, "dateOpen", val)}
        className="w-full min-w-0 box-border"
      />

      {/* Content */}
      <LimitedInput
        value={envelope.content}
        onChange={(v) => onUpdate(envelope.id, "content", v)}
        maxLength={CHAR_LIMITS.BODY}
        placeholder="תוכן המכתב..."
        className={`${inputClass} resize-none`}
        multiline
        rows={3}
      />
    </motion.div>
  );
}
