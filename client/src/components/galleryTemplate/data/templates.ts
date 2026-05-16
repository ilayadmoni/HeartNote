/**
 * Template Data — barrel
 * Assembles and re-exports all template data from focused sub-modules.
 * Consumers import from this file; sub-modules are an implementation detail.
 */

export { CATEGORY_EMOJI_MAP, FILTER_TABS } from "./categoryConfig";
export { PREVIEW_DATA } from "./previewData";
export { TEMPLATE_INFO_TEXT } from "./templateInfoText";

import { BASE_TEMPLATES } from "./baseTemplates";
import { INTERACTIVE_EVENT_TEMPLATES } from "./interactiveEventTemplates";
import type { Template } from "../types";

export { INTERACTIVE_EVENT_TEMPLATES };

export const TEMPLATES: Template[] = [
  ...BASE_TEMPLATES,
  ...INTERACTIVE_EVENT_TEMPLATES,
];
