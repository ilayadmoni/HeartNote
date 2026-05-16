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
export { BirthdayCandles } from "./BirthdayCandles/BirthdayCandles";
export { ExcuseGenerator } from "./ExcuseGenerator/ExcuseGenerator";
export { WeddingGlass } from "./WeddingGlass/WeddingGlass";
export { HolidayCard } from "./HolidayCard/HolidayCard";
export { BarBatMitzvah } from "./BarBatMitzvah/BarBatMitzvah";
export { BirthdayCandlesInteractive } from "./interactive-events/BirthdayCandlesInteractive";
export { WeddingGlassInteractive } from "./interactive-events/WeddingGlassInteractive";
export { HolidayRoshHashanahInteractive } from "./interactive-events/HolidayRoshHashanahInteractive";
export { HolidayPassoverInteractive } from "./interactive-events/HolidayPassoverInteractive";
export { HolidayPurimInteractive } from "./interactive-events/HolidayPurimInteractive";
export { HolidayShavuotInteractive } from "./interactive-events/HolidayShavuotInteractive";
export { HolidaySukkotInteractive } from "./interactive-events/HolidaySukkotInteractive";
export { HolidayHanukkahInteractive } from "./interactive-events/HolidayHanukkahInteractive";

// Dynamic Renderer
export { TemplateRenderer, type TemplateRendererProps } from "./TemplateRenderer";
