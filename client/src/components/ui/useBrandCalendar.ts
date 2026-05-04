"use client";

import {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";

// ── Hebrew locale data ────────────────────────────────────────────────────────
export const DAYS_HE = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
export const MONTHS_HE = [
  "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
  "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר",
];

// Year range for birthday picker (allow ages ~10 – ~100)
const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = CURRENT_YEAR - 100;
export const MAX_YEAR = CURRENT_YEAR - 10;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

// ── Pure helpers ──────────────────────────────────────────────────────────────
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

export function parseISO(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
interface UseBrandCalendarOptions {
  value: string;
  placeholder: string;
  onChange: (iso: string) => void;
}

export function useBrandCalendar({ value, placeholder, onChange }: UseBrandCalendarOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const parsed = useMemo(() => {
    if (value) return parseISO(value);
    return { year: 2000, month: 0, day: 1 };
  }, [value]);

  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  useEffect(() => {
    if (value) {
      const p = parseISO(value);
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [value]);

  const days = useMemo(() => getCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const todayISO = useMemo(() => {
    const n = new Date();
    return toISO(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  const yearOptions = useMemo(() => {
    const years: number[] = [];
    const start = Math.max(MAX_YEAR, viewYear);
    const end = Math.min(MIN_YEAR, viewYear);
    for (let y = start; y >= end; y--) years.push(y);
    return years;
  }, [viewYear]);

  const prevMonth = useCallback(() => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }, [viewMonth]);

  const nextMonth = useCallback(() => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }, [viewMonth]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSelect = useCallback(
    (d: CalendarDay) => {
      onChange(toISO(d.year, d.month, d.day));
      setIsOpen(false);
    },
    [onChange],
  );

  const displayValue = value
    ? new Date(value + "T00:00").toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : placeholder;

  return {
    containerRef,
    isOpen,
    setIsOpen,
    isYearOpen,
    setIsYearOpen,
    viewYear,
    setViewYear,
    viewMonth,
    setViewMonth,
    days,
    todayISO,
    yearOptions,
    prevMonth,
    nextMonth,
    handleSelect,
    displayValue,
  };
}
