"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import type { Locale } from "@/i18n/locale";
import { getCalendarDays, toISO, parseISO, type CalendarDay } from "./brandCalendar.dateHelpers";
import { LOCALE_TAG } from "./useBrandCalendar.locale";

export { getLocalizedDays, getLocalizedMonths, LOCALE_TAG, DAYS_HE, MONTHS_HE } from "./useBrandCalendar.locale";
export { getCalendarDays, toISO, parseISO, type CalendarDay } from "./brandCalendar.dateHelpers";

// Year range for birthday picker (allow ages ~10 – ~100)
const CURRENT_YEAR = new Date().getFullYear();
export const MIN_YEAR = CURRENT_YEAR - 100;
export const MAX_YEAR = CURRENT_YEAR - 10;

interface UseBrandCalendarOptions {
  value: string;
  placeholder: string;
  onChange: (iso: string) => void;
  locale?: Locale;
}

export function useBrandCalendar({ value, placeholder, onChange, locale = "he" }: UseBrandCalendarOptions) {
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
    ? new Date(value + "T00:00").toLocaleDateString(LOCALE_TAG[locale], {
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
