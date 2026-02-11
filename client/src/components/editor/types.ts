/**
 * Editor Component Types
 * Type definitions for the template editor
 */

// Editor field types — must cover all types used in config_schema JSONB
export type EditorFieldType =
  | "text"
  | "textarea"
  | "color"
  | "image_url"
  | "image"
  | "select"
  | "toggle"
  | "events"
  | "envelopes"
  | "questions"
  | "coupons"
  | "options";

export interface EditorField {
  key: string;
  label: string;
  type: EditorFieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
}

export interface EditorConfig {
  templateId: string;
  title: string;
  description: string;
  fields: EditorField[];
  defaultData: Record<string, unknown>;
}

// Props for editor components
export interface TemplateEditorProps {
  templateId: string;
}

export interface EditorSidebarProps {
  config: EditorConfig;
  data: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  /** User ID — forwarded to image upload fields */
  userId?: string;
}

export interface EditorPreviewProps {
  templateId: string;
  data: Record<string, unknown>;
}

export interface EditorFieldProps {
  field: EditorField;
  value: unknown;
  onChange: (value: unknown) => void;
}
