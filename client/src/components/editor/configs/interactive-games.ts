import type { EditorConfig } from "../types";

export const INTERACTIVE_GAME_CONFIGS: Record<string, EditorConfig> = {
  "slot-machine": {
    templateId: "slot-machine",
    titleKey: "templates.slot-machine.title",
    descriptionKey: "templates.slot-machine.description",
    fields: [
      { key: "title", labelKey: "fields.slot-machine.title.label", type: "text", placeholderKey: "fields.slot-machine.title.placeholder", maxLength: 60 },
      { key: "subtitle", labelKey: "fields.slot-machine.subtitle.label", type: "text", placeholderKey: "fields.slot-machine.subtitle.placeholder" },
      { key: "reel1Options", labelKey: "fields.slot-machine.reel1Options.label", type: "options" },
      { key: "reel2Options", labelKey: "fields.slot-machine.reel2Options.label", type: "options" },
      { key: "reel3Options", labelKey: "fields.slot-machine.reel3Options.label", type: "options" },
      { key: "targetReel1", labelKey: "fields.slot-machine.targetReel1.label", type: "text", maxLength: 40 },
      { key: "targetReel2", labelKey: "fields.slot-machine.targetReel2.label", type: "text", maxLength: 40 },
      { key: "targetReel3", labelKey: "fields.slot-machine.targetReel3.label", type: "text", maxLength: 40 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "defaults.slot-machine.title",
      subtitle: "defaults.slot-machine.subtitle",
      reel1Options: [
        "defaults.slot-machine.reel1Options.1",
        "defaults.slot-machine.reel1Options.2",
        "defaults.slot-machine.reel1Options.3",
        "defaults.slot-machine.reel1Options.4",
      ],
      reel2Options: [
        "defaults.slot-machine.reel2Options.1",
        "defaults.slot-machine.reel2Options.2",
        "defaults.slot-machine.reel2Options.3",
        "defaults.slot-machine.reel2Options.4",
      ],
      reel3Options: [
        "defaults.slot-machine.reel3Options.1",
        "defaults.slot-machine.reel3Options.2",
        "defaults.slot-machine.reel3Options.3",
        "defaults.slot-machine.reel3Options.4",
      ],
      targetReel1: "defaults.slot-machine.reel1Options.1",
      targetReel2: "defaults.slot-machine.reel2Options.2",
      targetReel3: "defaults.slot-machine.reel3Options.2",
      primaryColor: "#d4826f",
    },
  },
  "excuse-generator": {
    templateId: "excuse-generator",
    titleKey: "templates.excuse-generator.title",
    descriptionKey: "templates.excuse-generator.description",
    fields: [
      { key: "title", labelKey: "fields.excuse-generator.title.label", type: "text", placeholderKey: "fields.excuse-generator.title.placeholder", maxLength: 60 },
      { key: "subtitle", labelKey: "fields.excuse-generator.subtitle.label", type: "text", placeholderKey: "fields.excuse-generator.subtitle.placeholder", maxLength: 120 },
      { key: "excuses", labelKey: "fields.excuse-generator.excuses.label", type: "options", min: 1, max: 8, maxLength: 80 },
      { key: "buttonLabel", labelKey: "fields.excuse-generator.buttonLabel.label", type: "text", placeholderKey: "fields.excuse-generator.buttonLabel.placeholder", maxLength: 40 },
      { key: "disclaimer", labelKey: "fields.excuse-generator.disclaimer.label", type: "textarea", placeholderKey: "fields.excuse-generator.disclaimer.placeholder", maxLength: 60 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "defaults.excuse-generator.title",
      subtitle: "defaults.excuse-generator.subtitle",
      excuses: [
        "defaults.excuse-generator.excuses.1",
        "defaults.excuse-generator.excuses.2",
        "defaults.excuse-generator.excuses.3",
        "defaults.excuse-generator.excuses.4",
        "defaults.excuse-generator.excuses.5",
      ],
      buttonLabel: "defaults.excuse-generator.buttonLabel",
      disclaimer: "defaults.excuse-generator.disclaimer",
      primaryColor: "#d4826f",
    },
  },
};
