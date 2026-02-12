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
import { SteamyWindow } from "./SteamyWindow/SteamyWindow";
import { SurpriseGift } from "./SurpriseGift/SurpriseGift";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTemplateComponent = ComponentType<{ data: any }>;

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
  SteamyWindow: SteamyWindow as AnyTemplateComponent,
  SurpriseGift: SurpriseGift as AnyTemplateComponent,
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
