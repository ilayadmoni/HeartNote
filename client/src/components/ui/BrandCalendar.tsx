"use client";

/**
 * BrandCalendar Component
 *
 * Custom branded calendar picker for HeartNote.
 * Replaces native date inputs with a fully designed drop-down calendar grid.
 *
 * Design tokens:
 *  - Header gradient: Mint (#B5EAD7) → Periwinkle (#C7CEEA)
 *  - Selected date: Pink (#F8BBD0) rounded square
 *  - Shadow: shadow-lg on dropdown
 *  - Font: project hebrew font classes (text-hebrew-heading / text-hebrew-body)
 *  - RTL layout by default
 *
 * UX:
 *  - Desktop: full calendar with year + month dropdowns for fast birthday selection
 *  - Mobile: native <input type="date"> for optimal OS picker
 */

import { useState, useCallback, useMemo, useRef, useEffect, useId } from "react";
import { ChevronRight, ChevronLeft, Calendar } from "lucide-react";

// ── Hebrew locale data ────────────────────────────────────────────────
const DAYS_HE = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
const MONTHS_HE = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

// Year range for birthday picker (allow ages ~10 – ~100)
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR - 100;
const MAX_YEAR = CURRENT_YEAR - 10;

// ── Props ─────────────────────────────────────────────────────────────
export interface BrandCalendarProps {
  /** Current value in YYYY-MM-DD format */
  value: string;
  /** Called with a YYYY-MM-DD string */
  onChange: (value: string) => void;
  /** Optional visible label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message */
  error?: string;
  /** Additional wrapper class names */
  className?: string;
  /** Min date (YYYY-MM-DD) */
  min?: string;
  /** Max date (YYYY-MM-DD) */
  max?: string;
  /** Disable input */
  disabled?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────
interface CalendarDay {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

function getCalendarDays(year: number, month: number): CalendarDay[] {
  const firstDow = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const days: CalendarDay[] = [];

  // Trailing days from previous month
  for (let i = firstDow - 1; i >= 0; i--) {
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    days.push({ day: daysInPrev - i, month: m, year: y, isCurrentMonth: false });
  }

  // Days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year, isCurrentMonth: true });
  }

  // Leading days of next month (fill 6 rows = 42 slots)
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    days.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  return days;
}

function toISO(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseISO(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

// ── Component ─────────────────────────────────────────────────────────
export function BrandCalendar({
  value,
  onChange,
  label,
  placeholder = "בחר תאריך",
  error,
  className = "",
  min,
  max,
  disabled = false,
}: BrandCalendarProps) {
  const uid = useId();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse value or fall back to a sensible default for birthday views
  const parsed = useMemo(() => {
    if (value) return parseISO(value);
    // Default view: year 2000 so the dropdown is centred for birthday entry
    return { year: 2000, month: 0, day: 1 };
  }, [value]);

  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  // Sync view to value when value changes externally
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

  // ── Year options (newest first for birthday UX) ─────────────────────
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = MAX_YEAR; y >= MIN_YEAR; y--) years.push(y);
    return years;
  }, []);

  // ── Month navigation ───────────────────────────────────────────────
  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  // ── Close on outside click ──────────────────────────────────────────
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

  // ── Select handler ──────────────────────────────────────────────────
  const handleSelect = useCallback(
    (d: CalendarDay) => {
      const iso = toISO(d.year, d.month, d.day);
      onChange(iso);
      setIsOpen(false);
    },
    [onChange],
  );

  // ── Display value ───────────────────────────────────────────────────
  const displayValue = value
    ? new Date(value + "T00:00").toLocaleDateString("he-IL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : placeholder;

  return (
    <div className={`relative w-full ${className}`} dir="rtl" ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={uid}
          className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
        >
          {label}
        </label>
      )}

      {/* ─── Mobile: native date input (best UX on phones) ──────────── */}
      <div className="block md:hidden w-full overflow-hidden">
        <div className="relative w-full">
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C7CEEA] dark:text-[#B5EAD7] z-[1]">
            <Calendar size={16} />
          </span>
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min ?? `${MIN_YEAR}-01-01`}
            max={max ?? `${MAX_YEAR}-12-31`}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            className={`
              w-full max-w-full min-w-0 box-border
              appearance-none
              pr-10 pl-3 py-2.5 text-sm rounded-lg
              bg-white dark:bg-gray-700
              text-[#2e3c52] dark:text-white
              border-2 transition-all duration-200
              placeholder-gray-400 dark:placeholder-gray-500
              text-hebrew-body
              focus:outline-none focus:ring-0
              disabled:opacity-50 disabled:cursor-not-allowed
              [&::-webkit-date-and-time-value]:text-right
              [&::-webkit-calendar-picker-indicator]:opacity-0
              [&::-webkit-calendar-picker-indicator]:absolute
              [&::-webkit-calendar-picker-indicator]:inset-0
              [&::-webkit-calendar-picker-indicator]:w-full
              [&::-webkit-calendar-picker-indicator]:h-full
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              [&::-webkit-calendar-picker-indicator]:m-0
              [&::-webkit-calendar-picker-indicator]:p-0
              ${
                error
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a]"
              }
            `}
          />
        </div>
      </div>

      {/* ─── Desktop: custom calendar with year dropdown ─────────────── */}
      <div className="hidden md:block">
        {/* Trigger */}
        <button
          id={uid}
          type="button"
          onClick={() => !disabled && setIsOpen((o) => !o)}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={error ? "true" : undefined}
          className={`
            w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-xl
            bg-white dark:bg-gray-700 text-right
            border-2 transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-400" : isOpen ? "border-[#C7CEEA] dark:border-[#B5EAD7]" : "border-gray-200 dark:border-gray-600"}
            ${value ? "text-[#2e3c52] dark:text-white" : "text-gray-400 dark:text-gray-500"}
          `}
        >
          <Calendar size={16} className="text-[#C7CEEA] dark:text-[#B5EAD7] flex-shrink-0" />
          <span className="flex-1 text-right text-hebrew-body">{displayValue}</span>
        </button>

        {/* Dropdown calendar */}
        {isOpen && (
          <div
            role="dialog"
            aria-label="בחירת תאריך"
            className="absolute top-full z-50 mt-1.5 right-0 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* ── Header with year + month dropdowns ──────────────── */}
            <div className="bg-gradient-to-l from-[#B5EAD7] to-[#C7CEEA] px-4 py-4 space-y-3">
              {/* Top row: Navigation buttons */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
                  aria-label="חודש הבא"
                >
                  <ChevronRight size={20} className="text-[#2e3c52]" />
                </button>

                <span className="text-xs font-semibold text-[#2e3c52] text-hebrew-heading">
                  בחר תאריך לידה
                </span>

                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
                  aria-label="חודש קודם"
                >
                  <ChevronLeft size={20} className="text-[#2e3c52]" />
                </button>
              </div>

              {/* Bottom row: Month and Year dropdowns */}
              <div className="grid grid-cols-2 gap-2">
                {/* Month dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#2e3c52] text-hebrew-heading">
                    חודש
                  </label>
                  <select
                    value={viewMonth}
                    onChange={(e) => setViewMonth(Number(e.target.value))}
                    className="w-full bg-white/80 hover:bg-white text-sm font-semibold text-[#2e3c52] text-hebrew-heading cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2e3c52] rounded-lg border border-white/40 px-2 py-1.5 appearance-none transition-all"
                    aria-label="חודש"
                  >
                    {MONTHS_HE.map((name, idx) => (
                      <option key={idx} value={idx}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year dropdown */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#2e3c52] text-hebrew-heading">
                    שנה
                  </label>
                  <select
                    value={viewYear}
                    onChange={(e) => setViewYear(Number(e.target.value))}
                    className="w-full bg-white/80 hover:bg-white text-sm font-semibold text-[#2e3c52] text-hebrew-heading cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2e3c52] rounded-lg border border-white/40 px-2 py-1.5 appearance-none transition-all"
                    aria-label="שנה"
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ── Day-of-week names ─────────────────────────────────── */}
            <div className="grid grid-cols-7 px-2 pt-1.5">
              {DAYS_HE.map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-bold text-gray-400 py-1 select-none"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* ── Day grid ──────────────────────────────────────────── */}
            <div className="grid grid-cols-7 px-2 pb-2 gap-0.5">
              {days.map((day, idx) => {
                const iso = toISO(day.year, day.month, day.day);
                const isSelected = iso === value;
                const isToday = iso === todayISO;
                const outOfRange =
                  (min !== undefined && iso < min) || (max !== undefined && iso > max);
                const isDisabled = !day.isCurrentMonth || outOfRange;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(day)}
                    disabled={isDisabled}
                    className={`
                      w-7 h-7 rounded-lg text-[11px] font-medium mx-auto
                      flex items-center justify-center transition-all
                      ${isSelected ? "bg-[#F8BBD0] text-[#2e3c52] font-bold shadow-sm" : ""}
                      ${isToday && !isSelected ? "ring-1 ring-[#C7CEEA] text-[#2e3c52] dark:text-white font-bold" : ""}
                      ${!isSelected && !isToday && day.isCurrentMonth ? "text-[#2e3c52] dark:text-gray-200 hover:bg-[#F8BBD0]/30" : ""}
                      ${!day.isCurrentMonth ? "text-gray-300 dark:text-gray-600" : ""}
                      ${isDisabled && day.isCurrentMonth ? "opacity-40 cursor-not-allowed" : ""}
                      ${!isDisabled ? "cursor-pointer" : ""}
                    `}
                  >
                    {day.day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="mt-1 text-xs text-red-500 text-right text-hebrew-body"
        >
          {error}
        </p>
      )}
    </div>
  );
}
