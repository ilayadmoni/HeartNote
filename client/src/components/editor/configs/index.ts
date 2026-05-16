/**
 * Editor Configurations — barrel export.
 * Config for each template's editable fields.
 *
 * NOTE: The `config_schema` in the database is the source of truth for
 * validation. This file drives the editor UI and provides defaults.
 * Fields of type "color" will render the restricted 12-swatch palette.
 */

import type { EditorConfig } from "../types";
import { ROMANCE_CONFIGS } from "./romance";
import { RELATIONSHIPS_CONFIGS } from "./relationships";
import { INTERACTIVE_CONFIGS } from "./interactive";
import { INTERACTIONS_CONFIGS } from "./interactions";
import { CELEBRATIONS_CONFIGS } from "./celebrations";
import { SPECIAL_OCCASIONS_CONFIGS } from "./special-occasions";
import { INTERACTIVE_EVENT_CONFIGS } from "./interactive-events";

export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
  ...ROMANCE_CONFIGS,
  ...RELATIONSHIPS_CONFIGS,
  ...INTERACTIVE_CONFIGS,
  ...INTERACTIONS_CONFIGS,
  ...CELEBRATIONS_CONFIGS,
  ...SPECIAL_OCCASIONS_CONFIGS,
  ...INTERACTIVE_EVENT_CONFIGS,
};
