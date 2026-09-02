import type { EditorConfig } from "../types";

export const ROMANCE_CONFIGS: Record<string, EditorConfig> = {
  "date-invite": {
    templateId: "date-invite",
    titleKey: "templates.date-invite.title",
    descriptionKey: "templates.date-invite.description",
    fields: [
      { key: "title", labelKey: "fields.date-invite.title.label", type: "text", placeholderKey: "fields.date-invite.title.placeholder" },
      { key: "question", labelKey: "fields.date-invite.question.label", type: "text", placeholderKey: "fields.date-invite.question.placeholder" },
      { key: "successMessage", labelKey: "fields.date-invite.successMessage.label", type: "text", placeholderKey: "fields.date-invite.successMessage.placeholder" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "defaults.date-invite.title",
      question: "defaults.date-invite.question",
      yesText: "defaults.date-invite.yesText",
      noText: "defaults.date-invite.noText",
      successMessage: "defaults.date-invite.successMessage",
      primaryColor: "#d4826f",
    },
  },
  "scratch-card": {
    templateId: "scratch-card",
    titleKey: "templates.scratch-card.title",
    descriptionKey: "templates.scratch-card.description",
    fields: [
      { key: "title", labelKey: "fields.scratch-card.title.label", type: "text", placeholderKey: "fields.scratch-card.title.placeholder" },
      { key: "prizeContent", labelKey: "fields.scratch-card.prizeContent.label", type: "textarea", placeholderKey: "fields.scratch-card.prizeContent.placeholder", aiAssist: true },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "defaults.scratch-card.title",
      prizeContent: "defaults.scratch-card.prizeContent",
      primaryColor: "#d4826f",
    },
  },
  "apology-search": {
    templateId: "apology-search",
    titleKey: "templates.apology-search.title",
    descriptionKey: "templates.apology-search.description",
    fields: [
      { key: "searchQuery", labelKey: "fields.apology-search.searchQuery.label", type: "text", placeholderKey: "fields.apology-search.searchQuery.placeholder", maxLength: 70 },
      { key: "resultTitle", labelKey: "fields.apology-search.resultTitle.label", type: "text", placeholderKey: "fields.apology-search.resultTitle.placeholder", maxLength: 30 },
      { key: "resultSubtitle", labelKey: "fields.apology-search.resultSubtitle.label", type: "textarea", placeholderKey: "fields.apology-search.resultSubtitle.placeholder", maxLength: 100 },
      { key: "startButtonLabel", labelKey: "fields.apology-search.startButtonLabel.label", type: "text", placeholderKey: "fields.apology-search.startButtonLabel.placeholder", maxLength: 40 },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      searchQuery: "defaults.apology-search.searchQuery",
      resultTitle: "defaults.apology-search.resultTitle",
      resultSubtitle: "defaults.apology-search.resultSubtitle",
      startButtonLabel: "defaults.apology-search.startButtonLabel",
      typingSpeedMs: 80,
      primaryColor: "#d4826f",
    },
  },
};
