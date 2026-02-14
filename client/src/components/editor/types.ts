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
  /** Custom character limit for text/textarea fields (overrides default) */
  maxLength?: number;
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

// =============================================================================
// Structured Template User Data
// =============================================================================

/**
 * Represents the complete state of a user's customised template.
 * `userChoices` is intentionally flexible — each template populates
 * it with its own set of fields (text, colors, arrays, booleans, etc.).
 */
export interface TemplateUserData {
  /** Slug identifier of the template being edited (e.g. "date-invite") */
  templateId: string;
  /** Dynamic key-value map of all user-provided values for this template */
  userChoices: Record<string, unknown>;
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
