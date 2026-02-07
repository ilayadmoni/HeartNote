/**
 * Editor Component Types
 * Type definitions for the template editor
 */

import type { DateInviteData } from "@/components/templates/types";

// Editor field types
export type EditorFieldType = 
  | "text"
  | "textarea"
  | "color"
  | "image"
  | "select"
  | "toggle";

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

// Color presets
export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "קורל", primary: "#d4826f", secondary: "#e8917a" },
  { name: "כחול", primary: "#3b82f6", secondary: "#60a5fa" },
  { name: "סגול", primary: "#8b5cf6", secondary: "#a78bfa" },
  { name: "ורוד", primary: "#ec4899", secondary: "#f472b6" },
];
