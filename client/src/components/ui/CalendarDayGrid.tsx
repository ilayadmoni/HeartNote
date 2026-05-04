"use client";

import { CalendarDay, DAYS_HE, toISO } from "./useBrandCalendar";

interface CalendarDayGridProps {
  days: CalendarDay[];
  value: string;
  todayISO: string;
  min?: string;
  max?: string;
  onSelect: (day: CalendarDay) => void;
}

export function CalendarDayGrid({ days, value, todayISO, min, max, onSelect }: CalendarDayGridProps) {
  return (
    <div className="pb-3 bg-white dark:bg-gray-800 rounded-b-2xl">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 px-2 pt-2">
        {DAYS_HE.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1 select-none">
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
  );
}
