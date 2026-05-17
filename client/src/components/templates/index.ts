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
export { SlotMachine } from "./SlotMachine/SlotMachine";
export { PunchingBag } from "./PunchingBag/PunchingBag";
export { ApologySearch } from "./ApologySearch/ApologySearch";
export { ExcuseGenerator } from "./ExcuseGenerator/ExcuseGenerator";
export { BarBatMitzvah } from "./BarBatMitzvah/BarBatMitzvah";
export { BirthdayCandlesInteractive } from "./BirthdayCandlesInteractive";
export { WeddingGlassInteractive } from "./WeddingGlassInteractive";
export { HolidayRoshHashanahInteractive } from "./HolidayRoshHashanahInteractive";
export { HolidayPassoverInteractive } from "./HolidayPassoverInteractive";
export { HolidayPurimInteractive } from "./HolidayPurimInteractive";
export { HolidayShavuotInteractive } from "./HolidayShavuotInteractive";
export { HolidaySukkotInteractive } from "./HolidaySukkotInteractive";
export { HolidayHanukkahInteractive } from "./HolidayHanukkahInteractive";

// Dynamic Renderer
export { TemplateRenderer, type TemplateRendererProps } from "./TemplateRenderer";
