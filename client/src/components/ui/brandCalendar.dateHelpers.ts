/** Pure date-grid helpers for useBrandCalendar (150-line file cap). */

export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

export function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];

  for (let i = firstDow - 1; i >= 0; i--) {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({ day: daysInPrev - i, month: m, year: y, isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year, isCurrentMonth: true });
  }

  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  return days;
}

export function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function parseISO(value: string): { year: number; month: number; day: number } {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}
