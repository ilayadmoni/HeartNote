"use client";

/** Renders the "text" and "textarea" EditorField variants, including the
 * optional AI-assist button above an aiAssist textarea. Split out of
 * EditorField.tsx to keep that file under the project's line limit. */

import type { EditorField as EditorFieldType } from "../types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";
import { AiAssistButton } from "./AiAssistButton";

interface TextEditorFieldsProps {
  field: EditorFieldType;
  value: unknown;
  onChange: (value: unknown) => void;
  templateId?: string;
  className: string;
}

export function TextEditorFields({ field, value, onChange, templateId, className }: TextEditorFieldsProps) {
  if (field.type === "text") {
    return (
      <LimitedInput
        value={(value as string) || ""}
        onChange={(v) => onChange(v)}
        maxLength={field.maxLength || CHAR_LIMITS.TITLE}
        placeholder={field.placeholder}
        className={className}
      />
    );
  }

  if (field.type === "textarea") {
    return (
      <>
        {field.aiAssist && templateId && (
          <AiAssistButton
            templateId={templateId}
            fieldKey={field.key}
            onGenerated={(text) => onChange(text)}
          />
        )}
        <LimitedInput
          value={(value as string) || ""}
          onChange={(v) => onChange(v)}
          maxLength={field.maxLength || CHAR_LIMITS.BODY}
          placeholder={field.placeholder}
          className={`${className} resize-none`}
          multiline
          rows={3}
        />
      </>
    );
  }

  return null;
}
