export interface BirthdayCandlePlan {
  age: number;
  candleCount: number;
  showAgeNumber: boolean;
}

const MIN_AGE = 1;
const MAX_AGE = 120;
const MAX_VISIBLE_CANDLES = 4;

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
  // For ages 1-4: show that many candles, hide age number
  if (age <= 4) {
    return { age, candleCount: age, showAgeNumber: false };
  }
  // For ages 5+: show max visible candles (4) but display age number for context
  return { age, candleCount: MAX_VISIBLE_CANDLES, showAgeNumber: true };
}
