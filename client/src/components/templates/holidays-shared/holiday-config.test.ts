import { describe, expect, it } from "vitest";
import {
  HOLIDAY_INTERACTIVE_CONFIGS,
  HOLIDAY_INTERACTIVE_SLUGS,
} from "./holiday-config";

describe("interactive holiday config", () => {
  it("defines the six requested holiday templates", () => {
    expect(HOLIDAY_INTERACTIVE_SLUGS).toEqual([
      "holiday-rosh-hashanah-interactive",
      "holiday-passover-interactive",
      "holiday-purim-interactive",
      "holiday-shavuot-interactive",
      "holiday-sukkot-interactive",
      "holiday-hanukkah-interactive",
    ]);
  });

  it("locks the requested interactions and reveal lines", () => {
    expect(HOLIDAY_INTERACTIVE_CONFIGS["holiday-passover-interactive"].interaction)
      .toBe("matzah");
    expect(HOLIDAY_INTERACTIVE_CONFIGS["holiday-purim-interactive"].interaction)
      .toBe("mask");
    expect(HOLIDAY_INTERACTIVE_CONFIGS["holiday-hanukkah-interactive"].prompt)
      .toBe("לחצו להדליק את האור");
    expect(HOLIDAY_INTERACTIVE_CONFIGS["holiday-hanukkah-interactive"].revealLine)
      .toBe("חג חנוכה שמח");
  });
});
