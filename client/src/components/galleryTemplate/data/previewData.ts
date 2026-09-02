import { COLOR_PALETTE } from "@/constants/colors";

const SURPRISE_GIFT_BOX_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Red",
)!.hex;
const SURPRISE_GIFT_RIBBON_COLOR = COLOR_PALETTE.find(
  (color) => color.name === "Bright Yellow",
)!.hex;

type T = (key: string) => string;

/**
 * Builds the sample data fed to real template components when rendering the
 * gallery's live-preview fallback. Text fields are product-shipped sample
 * copy, so they're resolved from "gallery.sampleData.*" at call time.
 */
export function buildPreviewData(t: T): Record<string, unknown> {
  return {
    DateInvite: {
      question: t("sampleData.dateInvite.question"),
      yesText: t("sampleData.dateInvite.yes"),
      noText: t("sampleData.dateInvite.no"),
      successMessage: t("sampleData.dateInvite.success"),
    },
    ScratchCard: {
      title: "",
      prizeContent: "🎁",
    },
    Timeline: {
      events: [
        { id: "1", date: "2023-01", title: "❤️" },
        { id: "2", date: "2023-06", title: "✨" },
        { id: "3", date: "2024-01", title: "💒" },
      ],
    },
    LoveCoupons: {
      coupons: [
        { id: "1", title: t("sampleData.loveCoupons.coupon1"), icon: "💆", color: "emerald", isRedeemed: false },
        { id: "2", title: t("sampleData.loveCoupons.coupon2"), icon: "🍽️", color: "sky", isRedeemed: true },
      ],
    },
    RelationshipQuiz: {
      title: "?",
      questions: [
        { id: "1", question: "?", options: ["A", "B", "C", "D"], correctIndex: 0 },
      ],
      scoreMessages: [
        { minScore: 0, message: t("sampleData.relationshipQuiz.scoreMessage"), emoji: "💪" },
      ],
    },
    OpenWhen: {
      envelopes: [
        { id: "1", title: "😢", emoji: "😢", content: "", dateOpen: "2026-01-01" },
        { id: "2", title: "💪", emoji: "💪", content: "", dateOpen: "2099-01-01" },
      ],
    },
    DecisionWheel: {
      title: t("sampleData.decisionWheel.title"),
      options: [
        t("sampleData.decisionWheel.option1"),
        t("sampleData.decisionWheel.option2"),
        t("sampleData.decisionWheel.option3"),
        t("sampleData.decisionWheel.option4"),
      ],
    },
    SlotMachine: {
      title: t("sampleData.slotMachine.title"),
      reel1Options: [t("sampleData.slotMachine.reel1Word1"), t("sampleData.slotMachine.reel1Word2")],
      reel2Options: [t("sampleData.slotMachine.reel2Word1"), t("sampleData.slotMachine.reel2Word2")],
      reel3Options: [t("sampleData.slotMachine.reel3Word1"), t("sampleData.slotMachine.reel3Word2")],
      targetReel1: t("sampleData.slotMachine.reel1Word1"),
      targetReel2: t("sampleData.slotMachine.reel2Word1"),
      targetReel3: t("sampleData.slotMachine.reel3Word1"),
      primaryColor: "#d4826f",
    },
    SurpriseGift: {
      title: `${t("sampleData.surpriseGift.title")} 🎁`,
      greeting: `${t("sampleData.surpriseGift.greeting")} ❤️`,
      boxColor: SURPRISE_GIFT_BOX_COLOR,
      ribbonColor: SURPRISE_GIFT_RIBBON_COLOR,
      clicksRequired: 5,
      primaryColor: "#d4826f",
    },
    PunchingBag: {
      introTitle: t("sampleData.punchingBag.introTitle"),
      introSubtitle: t("sampleData.punchingBag.introSubtitle"),
      hitsRequired: 5,
      resultMessage: `${t("sampleData.punchingBag.resultMessage")} ❤️`,
      bagColor: "#d4826f",
      primaryColor: "#d4826f",
    },
    ApologySearch: {
      searchQuery: t("sampleData.apologySearch.searchQuery"),
      resultTitle: t("sampleData.apologySearch.resultTitle"),
      resultSubtitle: t("sampleData.apologySearch.resultSubtitle"),
      primaryColor: "#d4826f",
    },
    ExcuseGenerator: {
      title: t("sampleData.excuseGenerator.title"),
      subtitle: t("sampleData.excuseGenerator.subtitle"),
      excuses: [
        t("sampleData.excuseGenerator.excuse1"),
        t("sampleData.excuseGenerator.excuse2"),
        t("sampleData.excuseGenerator.excuse3"),
      ],
      buttonLabel: t("sampleData.excuseGenerator.buttonLabel"),
      disclaimer: t("sampleData.excuseGenerator.disclaimer"),
      primaryColor: "#d4826f",
    },
    BarBatMitzvah: {
      kind: "bat" as const,
      introTitle: t("sampleData.barBatMitzvah.introTitle"),
      introSubtitle: t("sampleData.barBatMitzvah.introSubtitle"),
      blessingTitle: `${t("sampleData.barBatMitzvah.blessingTitle")} 🎉`,
      blessingMessage: t("sampleData.barBatMitzvah.blessingMessage"),
      tapHintLabel: t("sampleData.barBatMitzvah.tapHintLabel"),
      primaryColor: "#d4826f",
    },
  };
}
