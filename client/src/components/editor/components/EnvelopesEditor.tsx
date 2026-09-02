"use client";

/**
 * EnvelopesEditor Component
 * Timeline-style editor for OpenWhen envelopes — up to 6 items.
 * The single-item card lives in EnvelopeItem.tsx (150-line file cap).
 */

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { OpenWhenEnvelope } from "@/components/templates/types";
import { EnvelopeItem } from "./EnvelopeItem";

const MAX_ENVELOPES = 6;
const MIN_ENVELOPES = 1;

interface EnvelopesEditorProps {
  envelopes: OpenWhenEnvelope[];
  onChange: (envelopes: OpenWhenEnvelope[]) => void;
}

export function EnvelopesEditor({ envelopes = [], onChange }: EnvelopesEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const canAddMore = envelopes.length < MAX_ENVELOPES;
  const canRemove = envelopes.length > MIN_ENVELOPES;

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
    if (!canRemove) return;
    onChange(envelopes.filter((e) => e.id !== id));
  };

  const updateEnvelope = (id: string, field: keyof OpenWhenEnvelope, value: string) => {
    onChange(envelopes.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {envelopes.map((env, index) => (
          <EnvelopeItem key={env.id} envelope={env} index={index} onRemove={removeEnvelope} onUpdate={updateEnvelope} canRemove={canRemove} />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addEnvelope}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-body-sm font-bold text-accent bg-accent-soft hover:bg-accent-soft/70 rounded-control transition-colors"
        >
          <Plus size={16} />
          <span>{t("envelopes.addEnvelope", { count: envelopes.length, max: MAX_ENVELOPES })}</span>
        </motion.button>
      )}
    </div>
  );
}
