/**
 * Template Component Registry
 *
 * Maps component_key values (from the DB) to the actual React components.
 * Used by the TemplateRenderer and the editor preview.
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTemplateComponent = ComponentType<{ data: any }>;

/**
 * Registry: component_key → React component.
 *
 * The keys here MUST match the `component_key` column in the
 * `templates` database table.
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
};

/**
 * Convert a kebab-case templateId (URL-friendly) to a PascalCase
 * component_key (DB-friendly).
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
 * Convert a PascalCase component_key to a kebab-case templateId.
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
