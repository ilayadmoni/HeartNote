/**
 * Template Components Barrel Export
 * All HeartNote interactive template components
 */

// Types
export * from "./types";

// Registry
export {
  TEMPLATE_REGISTRY,
  getTemplateComponent,
  templateIdToComponentKey,
  componentKeyToTemplateId,
} from "./registry";

// Components
export { DateInvite } from "./DateInvite/DateInvite";
export { ScratchCard } from "./ScratchCard/ScratchCard";
export { Timeline } from "./Timeline/Timeline";
export { LoveCoupons } from "./LoveCoupons/LoveCoupons";
export { RelationshipQuiz } from "./RelationshipQuiz/RelationshipQuiz";
export { OpenWhen } from "./OpenWhen/OpenWhen";
export { SurpriseGift } from "./SurpriseGift/SurpriseGift";

// Dynamic Renderer
export { TemplateRenderer, type TemplateRendererProps } from "./TemplateRenderer";
