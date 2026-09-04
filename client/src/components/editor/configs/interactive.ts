import type { EditorConfig } from "../types";

export const INTERACTIVE_CONFIGS: Record<string, EditorConfig> = {
  "relationship-quiz": {
    templateId: "relationship-quiz",
    titleKey: "templates.relationship-quiz.title",
    descriptionKey: "templates.relationship-quiz.description",
    fields: [
      { key: "title", labelKey: "fields.relationship-quiz.title.label", type: "text", placeholderKey: "fields.relationship-quiz.title.placeholder" },
      { key: "questions", labelKey: "fields.relationship-quiz.questions.label", type: "questions" },
    ],
    defaultData: {
      title: "defaults.relationship-quiz.title",
      questions: [
        {
          id: "q-1",
          question: "defaults.relationship-quiz.questions.1.question",
          options: [
            "defaults.relationship-quiz.questions.1.options.1",
            "defaults.relationship-quiz.questions.1.options.2",
            "defaults.relationship-quiz.questions.1.options.3",
            "defaults.relationship-quiz.questions.1.options.4",
          ],
          correctIndex: 0,
        },
        {
          id: "q-2",
          question: "defaults.relationship-quiz.questions.2.question",
          options: [
            "defaults.relationship-quiz.questions.2.options.1",
            "defaults.relationship-quiz.questions.2.options.2",
            "defaults.relationship-quiz.questions.2.options.3",
            "defaults.relationship-quiz.questions.2.options.4",
          ],
          correctIndex: 0,
        },
        {
          id: "q-3",
          question: "defaults.relationship-quiz.questions.3.question",
          options: [
            "defaults.relationship-quiz.questions.3.options.1",
            "defaults.relationship-quiz.questions.3.options.2",
            "defaults.relationship-quiz.questions.3.options.3",
            "defaults.relationship-quiz.questions.3.options.4",
          ],
          correctIndex: 0,
        },
      ],
      scoreMessages: [
        { minScore: 80, message: "defaults.relationship-quiz.scoreMessages.1" },
        { minScore: 50, message: "defaults.relationship-quiz.scoreMessages.2" },
        { minScore: 0, message: "defaults.relationship-quiz.scoreMessages.3" },
      ],
      primaryColor: "#d4826f",
    },
  },
  "decision-wheel": {
    templateId: "decision-wheel",
    titleKey: "templates.decision-wheel.title",
    descriptionKey: "templates.decision-wheel.description",
    fields: [
      { key: "title", labelKey: "fields.decision-wheel.title.label", type: "text", placeholderKey: "fields.decision-wheel.title.placeholder" },
      { key: "subtitle", labelKey: "fields.decision-wheel.subtitle.label", type: "text", placeholderKey: "fields.decision-wheel.subtitle.placeholder" },
      { key: "options", labelKey: "fields.decision-wheel.options.label", type: "options" },
      { key: "noTakeBacksText", labelKey: "fields.decision-wheel.noTakeBacksText.label", type: "text", placeholderKey: "fields.decision-wheel.noTakeBacksText.placeholder" },
      { key: "primaryColor", labelKey: "fields.common.primaryColor.label", type: "color" },
    ],
    defaultData: {
      title: "defaults.decision-wheel.title",
      subtitle: "defaults.decision-wheel.subtitle",
      options: [
        "defaults.decision-wheel.options.1",
        "defaults.decision-wheel.options.2",
        "defaults.decision-wheel.options.3",
        "defaults.decision-wheel.options.4",
        "defaults.decision-wheel.options.5",
        "defaults.decision-wheel.options.6",
      ],
      primaryColor: "#d4826f",
    },
  },
};
