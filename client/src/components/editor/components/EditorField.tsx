"use client";

/**
 * EditorField Component
 * Individual form fields for template editing
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EditorField as EditorFieldType } from "../types";
import { ColorPicker } from "./ColorPicker";
import { TimelineEventsEditor } from "./TimelineEventsEditor";
import { EnvelopesEditor } from "./EnvelopesEditor";
import { QuestionsEditor } from "./QuestionsEditor";
import { CouponsEditor } from "./CouponsEditor";
import { OptionsEditor } from "./OptionsEditor";
import { TextEditorFields } from "./TextEditorFields";
import type {
  TimelineEvent,
  OpenWhenEnvelope,
  QuizQuestion,
  LoveCoupon,
} from "@/components/templates/types";

interface EditorFieldProps {
  field: EditorFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
  /** Required when field.aiAssist is set — identifies the template for the allowlist check */
  templateId?: string;
}

const baseInputClass =
  "w-full px-4 py-3 rounded-control border border-line-strong bg-surface-raised text-ink " +
  "placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent " +
  "transition-colors duration-base ease-out-quint";

export function EditorField({ field, value, onChange, templateId }: EditorFieldProps): JSX.Element {
  const t = useTranslations("editor");
  const label = t(field.labelKey);
  const placeholder = field.placeholderKey ? t(field.placeholderKey) : undefined;

  return (
    <div>
      <label className="block text-body-sm font-bold text-ink mb-2">
        {label}
      </label>

      {(field.type === "text" || field.type === "textarea") && (
        <TextEditorFields
          field={field}
          value={value}
          onChange={onChange}
          templateId={templateId}
          className={baseInputClass}
        />
      )}

      {field.type === "select" && (
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.labelKey ? t(option.labelKey) : option.label}
            </option>
          ))}
        </select>
      )}

      {field.type === "number" && (
        <input
          type="number"
          value={(value as number) || 0}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          min={field.min}
          max={field.max}
          className={baseInputClass}
        />
      )}

      {field.type === "color" && (
        <ColorPicker
          value={(value as string) || ""}
          onChange={(c) => onChange(c)}
          label={label}
        />
      )}

      {field.type === "toggle" && (
        <motion.button
          type="button"
          onClick={() => onChange(!value)}
          className={`
            relative w-12 h-6 rounded-full transition-colors duration-200
            ${value ? "bg-accent" : "bg-surface-sunken border border-line-strong"}
          `}
          aria-checked={!!value}
          role="switch"
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            animate={{ x: value ? 26 : 4 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </motion.button>
      )}

      {field.type === "events" && (
        <TimelineEventsEditor
          events={(value as TimelineEvent[]) || []}
          onChange={onChange}
        />
      )}

      {field.type === "envelopes" && (
        <EnvelopesEditor
          envelopes={(value as OpenWhenEnvelope[]) || []}
          onChange={onChange}
        />
      )}

      {field.type === "questions" && (
        <QuestionsEditor
          questions={(value as QuizQuestion[]) || []}
          onChange={onChange}
        />
      )}

      {field.type === "coupons" && (
        <CouponsEditor
          coupons={(value as LoveCoupon[]) || []}
          onChange={onChange}
        />
      )}

      {field.type === "options" && (
        <OptionsEditor
          options={(value as string[]) || []}
          onChange={onChange}
          maxLength={field.maxLength}
        />
      )}

    </div>
  );
}
