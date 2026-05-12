"use client";

/**
 * BrandCalendar — custom branded calendar picker (RTL, Hebrew).
 * Desktop: drop-down calendar with year + month dropdowns.
 * Mobile: native <input type="date"> for optimal OS picker.
 */

import { useId, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { useBrandCalendar, MIN_YEAR, MAX_YEAR } from "./useBrandCalendar";
import { MonthYearSelector } from "./MonthYearSelector";
import { CalendarDayGrid } from "./CalendarDayGrid";
import { MobileNativeDateInput } from "./MobileNativeDateInput";

export interface BrandCalendarProps {
  /** Current value in YYYY-MM-DD format */
  value: string;
  /** Called with a YYYY-MM-DD string */
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  /** Min date (YYYY-MM-DD) */
  min?: string;
  /** Max date (YYYY-MM-DD) */
  max?: string;
  disabled?: boolean;
}

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
  const calendarPopupRef = useRef<HTMLDivElement>(null);
  const {
    containerRef,
    isOpen, setIsOpen,
    isYearOpen, setIsYearOpen,
    viewYear, setViewYear,
    viewMonth, setViewMonth,
    days, todayISO, yearOptions,
    prevMonth, nextMonth,
    handleSelect, displayValue,
  } = useBrandCalendar({ value, placeholder, onChange });

  useEffect(() => {
    if (isOpen && calendarPopupRef.current) {
      const first = calendarPopupRef.current.querySelector<HTMLElement>("button, [tabindex]");
      first?.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative w-full ${className}`} dir="rtl" ref={containerRef}>
      {label && (
        <label
          htmlFor={uid}
          className="block text-xs font-bold text-[#2e3c52] dark:text-gray-200 mb-1 text-right text-hebrew-heading"
        >
          {label}
        </label>
      )}

      <MobileNativeDateInput
        value={value}
        onChange={onChange}
        min={min ?? `${MIN_YEAR}-01-01`}
        max={max ?? `${MAX_YEAR}-12-31`}
        disabled={disabled}
        error={error}
      />

      {/* Desktop: custom calendar */}
      <div className="hidden md:block">
        <button
          id={uid}
          type="button"
          onClick={() => !disabled && setIsOpen((o) => !o)}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
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

        {isOpen && (
          <div
            ref={calendarPopupRef}
            role="dialog"
            aria-label="בחירת תאריך"
            className="absolute top-full z-50 mt-1.5 right-0 w-full max-w-[300px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <MonthYearSelector
              viewMonth={viewMonth}
              viewYear={viewYear}
              yearOptions={yearOptions}
              isYearOpen={isYearOpen}
              setViewMonth={setViewMonth}
              setViewYear={setViewYear}
              setIsYearOpen={setIsYearOpen}
              prevMonth={prevMonth}
              nextMonth={nextMonth}
            />
            <CalendarDayGrid
              days={days}
              value={value}
              todayISO={todayISO}
              min={min}
              max={max}
              onSelect={handleSelect}
            />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs text-red-500 text-right text-hebrew-body">
          {error}
        </p>
      )}
    </div>
  );
}
