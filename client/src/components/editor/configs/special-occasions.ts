import type { EditorConfig } from "../types";

export const SPECIAL_OCCASIONS_CONFIGS: Record<string, EditorConfig> = {
  "bar-bat-mitzvah": {
    templateId: "bar-bat-mitzvah",
    titleKey: "templates.bar-bat-mitzvah.title",
    descriptionKey: "templates.bar-bat-mitzvah.description",
    fields: [
      {
        key: "kind",
        labelKey: "fields.bar-bat-mitzvah.kind.label",
        type: "select",
        options: [
          { value: "bar", labelKey: "fields.bar-bat-mitzvah.kind.options.bar" },
          { value: "bat", labelKey: "fields.bar-bat-mitzvah.kind.options.bat" },
        ],
      },
      { key: "introTitle", labelKey: "fields.bar-bat-mitzvah.introTitle.label", type: "text", placeholderKey: "fields.bar-bat-mitzvah.introTitle.placeholder", maxLength: 60 },
      { key: "introSubtitle", labelKey: "fields.bar-bat-mitzvah.introSubtitle.label", type: "text", placeholderKey: "fields.bar-bat-mitzvah.introSubtitle.placeholder", maxLength: 120 },
      { key: "blessingTitle", labelKey: "fields.bar-bat-mitzvah.blessingTitle.label", type: "text", placeholderKey: "fields.bar-bat-mitzvah.blessingTitle.placeholder", maxLength: 80 },
      { key: "blessingMessage", labelKey: "fields.bar-bat-mitzvah.blessingMessage.label", type: "textarea", placeholderKey: "fields.bar-bat-mitzvah.blessingMessage.placeholder", maxLength: 300 },
      { key: "tapHintLabel", labelKey: "fields.bar-bat-mitzvah.tapHintLabel.label", type: "text", placeholderKey: "fields.bar-bat-mitzvah.tapHintLabel.placeholder", maxLength: 60 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      kind: "bat" as const,
      introTitle: "defaults.bar-bat-mitzvah.introTitle",
      introSubtitle: "defaults.bar-bat-mitzvah.introSubtitle",
      blessingTitle: "defaults.bar-bat-mitzvah.blessingTitle",
      blessingMessage: "defaults.bar-bat-mitzvah.blessingMessage",
      tapHintLabel: "defaults.bar-bat-mitzvah.tapHintLabel",
      primaryColor: "#d4826f",
    },
  },
};
