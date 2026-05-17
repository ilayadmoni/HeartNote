/**
 * Template Component Registry
 *
 * Maps PascalCase keys to the actual React components.
 * The DB stores kebab-case slugs (e.g. "scratch-card");
 * use templateIdToComponentKey() to convert before lookup.
 */

import type { ComponentType } from "react";

import { DateInvite } from "./DateInvite/DateInvite";
import { ScratchCard } from "./ScratchCard/ScratchCard";
import { Timeline } from "./Timeline/Timeline";
import { LoveCoupons } from "./LoveCoupons/LoveCoupons";
import { RelationshipQuiz } from "./RelationshipQuiz/RelationshipQuiz";
import { OpenWhen } from "./OpenWhen/OpenWhen";
import { DecisionWheel } from "./DecisionWheel/DecisionWheel";
import { SurpriseGift } from "./SurpriseGift/SurpriseGift";
import { SlotMachine } from "./SlotMachine/SlotMachine";
import { PunchingBag } from "./PunchingBag/PunchingBag";
import { ApologySearch } from "./ApologySearch/ApologySearch";
import { ExcuseGenerator } from "./ExcuseGenerator/ExcuseGenerator";
import { BarBatMitzvah } from "./BarBatMitzvah/BarBatMitzvah";
import { BirthdayCandlesInteractive } from "./interactive-events/BirthdayCandlesInteractive";
import { WeddingGlassInteractive } from "./interactive-events/WeddingGlassInteractive";
import { HolidayRoshHashanahInteractive } from "./interactive-events/HolidayRoshHashanahInteractive";
import { HolidayPassoverInteractive } from "./interactive-events/HolidayPassoverInteractive";
import { HolidayPurimInteractive } from "./interactive-events/HolidayPurimInteractive";
import { HolidayShavuotInteractive } from "./interactive-events/HolidayShavuotInteractive";
import { HolidaySukkotInteractive } from "./interactive-events/HolidaySukkotInteractive";
import { HolidayHanukkahInteractive } from "./interactive-events/HolidayHanukkahInteractive";

export type AnyTemplateComponent = ComponentType<{
  data: unknown;
  creationId?: string;
  verificationCode?: string | null;
}>;

/**
 * Registry: PascalCase key → React component.
 *
 * The keys here MUST correspond to the DB `slug` column
 * after kebab-to-PascalCase conversion.
 */
export const TEMPLATE_REGISTRY: Record<string, AnyTemplateComponent> = {
  DateInvite: DateInvite as AnyTemplateComponent,
  ScratchCard: ScratchCard as AnyTemplateComponent,
  Timeline: Timeline as AnyTemplateComponent,
  LoveCoupons: LoveCoupons as AnyTemplateComponent,
  RelationshipQuiz: RelationshipQuiz as AnyTemplateComponent,
  OpenWhen: OpenWhen as AnyTemplateComponent,
  DecisionWheel: DecisionWheel as AnyTemplateComponent,
  SurpriseGift: SurpriseGift as AnyTemplateComponent,
  SlotMachine: SlotMachine as AnyTemplateComponent,
  PunchingBag: PunchingBag as AnyTemplateComponent,
  ApologySearch: ApologySearch as AnyTemplateComponent,
  ExcuseGenerator: ExcuseGenerator as AnyTemplateComponent,
  BarBatMitzvah: BarBatMitzvah as AnyTemplateComponent,
  BirthdayCandlesInteractive: BirthdayCandlesInteractive as AnyTemplateComponent,
  WeddingGlassInteractive: WeddingGlassInteractive as AnyTemplateComponent,
  HolidayRoshHashanahInteractive: HolidayRoshHashanahInteractive as AnyTemplateComponent,
  HolidayPassoverInteractive: HolidayPassoverInteractive as AnyTemplateComponent,
  HolidayPurimInteractive: HolidayPurimInteractive as AnyTemplateComponent,
  HolidayShavuotInteractive: HolidayShavuotInteractive as AnyTemplateComponent,
  HolidaySukkotInteractive: HolidaySukkotInteractive as AnyTemplateComponent,
  HolidayHanukkahInteractive: HolidayHanukkahInteractive as AnyTemplateComponent,
};

/**
 * Convert a kebab-case slug to a PascalCase registry key.
 *
 * e.g. "date-invite" → "DateInvite"
 */
export function templateIdToComponentKey(templateId: string): string {
  return templateId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
}

/**
 * Convert a PascalCase registry key to a kebab-case slug.
 *
 * e.g. "DateInvite" → "date-invite"
 */
export function componentKeyToTemplateId(componentKey: string): string {
  return componentKey
    .replace(/([A-Z])/g, (match, _p1, offset) =>
      offset > 0 ? `-${match}` : match
    )
    .toLowerCase();
}

/**
 * Look up a component from the registry.
 * Returns `undefined` if no match.
 */
export function getTemplateComponent(
  componentKey: string
): AnyTemplateComponent | undefined {
  return TEMPLATE_REGISTRY[componentKey];
}
