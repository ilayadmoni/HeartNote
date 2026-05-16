import { describe, expect, it } from "vitest";
import {
  getBirthdayCandlePlan,
  isValidBirthdayAge,
  normalizeBirthdayAge,
} from "./candle-utils";

describe("birthday candle planning", () => {
  it("uses one candle per year for ages 1 through 12", () => {
    expect(getBirthdayCandlePlan(1)).toEqual({
      age: 1,
      candleCount: 1,
      showAgeNumber: false,
    });
    expect(getBirthdayCandlePlan(12)).toEqual({
      age: 12,
      candleCount: 12,
      showAgeNumber: false,
    });
  });

  it("caps decorative candles for ages 13 and above", () => {
    expect(getBirthdayCandlePlan(13)).toEqual({
      age: 13,
      candleCount: 7,
      showAgeNumber: true,
    });
    expect(getBirthdayCandlePlan(120).candleCount).toBe(7);
  });

  it("validates supported ages and normalizes malformed renderer input", () => {
    expect(isValidBirthdayAge(1)).toBe(true);
    expect(isValidBirthdayAge(120)).toBe(true);
    expect(isValidBirthdayAge(0)).toBe(false);
    expect(isValidBirthdayAge(121)).toBe(false);
    expect(normalizeBirthdayAge("oops")).toBe(1);
    expect(normalizeBirthdayAge(999)).toBe(120);
  });
});
