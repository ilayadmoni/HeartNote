"use client";

/**
 * BrandCalendar — custom branded calendar picker (RTL, Hebrew).
 * Desktop: drop-down calendar with year + month dropdowns.
 * Mobile: native <input type="date"> for optimal OS picker.
 */

import { useId, useRef, useEffect, useMemo } from "react";
import { Calendar } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useBrandCalendar, MIN_YEAR, MAX_YEAR, getLocalizedMonths } from "./useBrandCalendar";
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
  placeholder,
  error,
  className = "",
  min,
  max,
  disabled = false,
}: BrandCalendarProps): JSX.Element {
  const t = useTranslations("editor");
  const locale = useLocale() as "he" | "en";
  const months = useMemo(() => getLocalizedMonths(locale), [locale]);
  const resolvedPlaceholder = placeholder ?? t("calendar.pickDate");
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
  } = useBrandCalendar({ value, placeholder: resolvedPlaceholder, onChange, locale });

  useEffect(() => {
    if (isOpen && calendarPopupRef.current) {
      const first = calendarPopupRef.current.querySelector<HTMLElement>("button, [tabindex]");
      first?.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label htmlFor={uid} className="block text-caption font-bold text-ink mb-1 text-end">
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
            w-full flex items-center gap-2 px-3 py-2.5 text-body-sm rounded-control
            bg-surface-raised text-end
            border-2 transition-colors duration-base ease-out-quint
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-red-400" : isOpen ? "border-accent" : "border-line-strong"}
            ${value ? "text-ink" : "text-ink-subtle"}
          `}
        >
          <Calendar size={16} className="text-accent flex-shrink-0" />
          <span className="flex-1 text-end">{displayValue}</span>
        </button>

        {isOpen && (
          <div
            ref={calendarPopupRef}
            role="dialog"
            aria-label={t("calendar.datePickerAria")}
            className="absolute top-full z-50 mt-1.5 end-0 w-full max-w-[300px] bg-surface-raised rounded-card shadow-card border border-line"
          >
            <MonthYearSelector
              months={months}
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
              locale={locale}
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
        <p role="alert" className="mt-1 text-caption text-red-500 text-end">
          {error}
        </p>
      )}
    </div>
  );
}
