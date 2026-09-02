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
  | "number"
  | "events"
  | "envelopes"
  | "questions"
  | "coupons"
  | "options";

export interface EditorField {
  key: string;
  /**
   * Message key under the `editor` namespace, e.g. `fields.common.recipientName.label`
   * or `fields.<templateSlug>.<key>.label`. Falls back to the DB `config_schema`
   * label only if no client catalog entry exists for this slug + key.
   */
  labelKey: string;
  type: EditorFieldType;
  placeholderKey?: string;
  /**
   * Select options. Use `labelKey` for Hebrew copy that needs translation;
   * use `label` for locale-neutral literals (numbers, codes).
   */
  options?: { value: string; label?: string; labelKey?: string }[];
  defaultValue?: unknown;
  /** Custom character limit for text/textarea fields (overrides default) */
  maxLength?: number;
  /** Min/max item count for options fields */
  min?: number;
  max?: number;
  /** For image fields: enforce a crop modal with this aspect ratio (e.g. 3/4) */
  cropAspect?: number;
  /** Textarea only: show an "AI generate" button (see AI_ASSISTABLE_FIELDS) */
  aiAssist?: boolean;
}

export interface EditorConfig {
  templateId: string;
  /** Message key under `editor`, e.g. `templates.date-invite.title` */
  titleKey?: string;
  descriptionKey?: string;
  /**
   * Raw fallback strings — used only for configs sourced from a shared
   * catalog outside the editor's own message keys (e.g. holiday configs
   * whose copy is owned by the templates chrome namespace).
   */
  title?: string;
  description?: string;
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
