"use client";

import { useMemo } from "react";
import type { CalendarDay } from "./useBrandCalendar";
import { toISO, getLocalizedDays } from "./useBrandCalendar";
import type { Locale } from "@/i18n/locale";

interface CalendarDayGridProps {
  locale: Locale;
  days: CalendarDay[];
  value: string;
  todayISO: string;
  min?: string;
  max?: string;
  onSelect: (day: CalendarDay) => void;
}

export function CalendarDayGrid({ locale, days, value, todayISO, min, max, onSelect }: CalendarDayGridProps): JSX.Element {
  const dayLabels = useMemo(() => getLocalizedDays(locale), [locale]);
  return (
    <div className="pb-3 bg-surface-raised rounded-b-card">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {dayLabels.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-ink-subtle py-1 select-none">
            {d}
          </div>
        ))}
      </div>

      {/* Day buttons */}
      <div className="grid grid-cols-7 px-2 gap-0.5 mt-1">
        {days.map((day, idx) => {
          const iso = toISO(day.year, day.month, day.day);
          const isSelected = iso === value;
          const isToday = iso === todayISO;
          const outOfRange = (min !== undefined && iso < min) || (max !== undefined && iso > max);
          const isDisabled = !day.isCurrentMonth || outOfRange;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => !isDisabled && onSelect(day)}
              disabled={isDisabled}
              className={`
                w-7 h-7 rounded-control text-[11px] font-medium mx-auto
                flex items-center justify-center transition-colors
                ${isSelected ? "bg-[#F8BBD0] text-ink font-bold shadow-soft" : ""}
                ${isToday && !isSelected ? "ring-1 ring-accent text-ink font-bold" : ""}
                ${!isSelected && !isToday && day.isCurrentMonth ? "text-ink hover:bg-[#F8BBD0]/30" : ""}
                ${!day.isCurrentMonth ? "text-ink-subtle" : ""}
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
  );
}
