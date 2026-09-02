import type { TemplateComponentKey } from "@/components/galleryTemplate/types";

export interface Step1CardMeta {
  key: "dateInvite" | "scratchCard" | "timeline" | "wheel";
  badgeVariant: "free" | "new";
  componentKey?: TemplateComponentKey;
}

export const STEP1_CARDS: Step1CardMeta[] = [
  { key: "dateInvite", badgeVariant: "free", componentKey: "DateInvite" },
  { key: "scratchCard", badgeVariant: "new", componentKey: "ScratchCard" },
  { key: "timeline", badgeVariant: "free", componentKey: "Timeline" },
  { key: "wheel", badgeVariant: "free" },
];

export const STEP1_FILTERS = ["all", "romantic", "games", "memories", "gifts"] as const;
