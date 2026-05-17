export interface BirthdayCandlePlan {
  age: number;
  candleCount: number;
  showAgeNumber: boolean;
}

const MIN_AGE = 1;
const MAX_AGE = 120;
const CANDLE_THRESHOLD = 12;
const MAX_DECORATIVE_CANDLES = 7;

export function normalizeBirthdayAge(value: unknown): number {
  const age = Number(value);
  if (!Number.isFinite(age)) return 1;
  return Math.min(MAX_AGE, Math.max(MIN_AGE, Math.round(age)));
}

export function isValidBirthdayAge(value: unknown): boolean {
  const age = Number(value);
  return Number.isInteger(age) && age >= MIN_AGE && age <= MAX_AGE;
}

export function getBirthdayCandlePlan(value: unknown): BirthdayCandlePlan {
  const age = normalizeBirthdayAge(value);
  if (age <= CANDLE_THRESHOLD) {
    return { age, candleCount: age, showAgeNumber: false };
  }
  return { age, candleCount: MAX_DECORATIVE_CANDLES, showAgeNumber: true };
}
