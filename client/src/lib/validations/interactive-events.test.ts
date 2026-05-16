import { describe, expect, it } from "vitest";
import { validateInteractiveEventMetadata } from "./interactive-events";

const base = {
  recipientName: "רועי",
  message: "ברכה יפה",
};

describe("interactive event metadata validation", () => {
  it("accepts birthday age in the supported range", () => {
    expect(validateInteractiveEventMetadata("birthday-candles-interactive", {
      ...base,
      recipientAge: 1,
    })).toHaveLength(0);
    expect(validateInteractiveEventMetadata("birthday-candles-interactive", {
      ...base,
      recipientAge: 120,
    })).toHaveLength(0);
  });

  it("rejects birthday age outside the supported range", () => {
    expect(validateInteractiveEventMetadata("birthday-candles-interactive", {
      ...base,
      recipientAge: 0,
    })).not.toHaveLength(0);
    expect(validateInteractiveEventMetadata("birthday-candles-interactive", {
      ...base,
      recipientAge: 121,
    })).not.toHaveLength(0);
  });

  it("enforces tightened wedding limits", () => {
    const valid = {
      coupleNames: "חן ובר",
      senderName: "החברים",
      greetingTitle: "מזל טוב לזוג האהוב",
      message: "שתבנו יחד בית מלא באהבה.",
    };

    expect(validateInteractiveEventMetadata("wedding-glass-interactive", valid))
      .toHaveLength(0);
    expect(validateInteractiveEventMetadata("wedding-glass-interactive", {
      ...valid,
      coupleNames: "?".repeat(43),
    })).not.toHaveLength(0);
    expect(validateInteractiveEventMetadata("wedding-glass-interactive", {
      ...valid,
      message: "?".repeat(261),
    })).not.toHaveLength(0);
  });
});
