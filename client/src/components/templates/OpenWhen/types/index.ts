/**
 * OpenWhen Component Types
 * Re-exports shared types + local component props
 */

export type {
  OpenWhenData,
  OpenWhenEnvelope,
  TemplateComponentProps,
} from "@/components/templates/types";

export interface OpenWhenViewProps {
  data: import("@/components/templates/types").OpenWhenData;
}
