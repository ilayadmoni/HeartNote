"use client";

import { Dispatch, SetStateAction } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MONTHS_HE } from "./useBrandCalendar";

interface MonthYearSelectorProps {
  viewMonth: number;
  viewYear: number;
  yearOptions: number[];
  isYearOpen: boolean;
  setViewMonth: Dispatch<SetStateAction<number>>;
  setViewYear: Dispatch<SetStateAction<number>>;
  setIsYearOpen: Dispatch<SetStateAction<boolean>>;
  prevMonth: () => void;
  nextMonth: () => void;
}

export function MonthYearSelector({
  viewMonth,
  viewYear,
  yearOptions,
  isYearOpen,
  setViewMonth,
  setViewYear,
  setIsYearOpen,
  prevMonth,
  nextMonth,
}: MonthYearSelectorProps) {
  return (
    <div className="bg-gradient-to-l from-[#B5EAD7] to-[#C7CEEA] px-4 py-4 space-y-3 rounded-t-2xl relative z-10">
      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label="חודש קודם"
        >
          <ChevronRight size={20} className="text-[#2e3c52]" />
        </button>

        <span className="text-xs font-semibold text-[#2e3c52] text-hebrew-heading">
          בחר תאריך
        </span>

        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label="חודש הבא"
        >
          <ChevronLeft size={20} className="text-[#2e3c52]" />
        </button>
      </div>

      {/* Month + Year dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        {/* Month */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[#2e3c52] text-hebrew-heading">חודש</label>
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="w-full bg-white/80 hover:bg-white text-sm font-semibold text-[#2e3c52] text-hebrew-heading cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2e3c52] rounded-lg border border-white/40 px-2 py-1.5 appearance-none transition-all"
            aria-label="חודש"
          >
            {MONTHS_HE.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-[10px] font-bold text-[#2e3c52] text-hebrew-heading">שנה</label>
          <button
            type="button"
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="w-full bg-white/80 hover:bg-white text-sm font-semibold text-[#2e3c52] text-hebrew-heading cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2e3c52] rounded-lg border border-white/40 px-2 py-1.5 transition-all flex justify-between items-center"
            aria-label="שנה"
            aria-expanded={isYearOpen}
          >
            <span>{viewYear}</span>
            <ChevronLeft
              size={16}
              className={`transform transition-transform text-[#2e3c52] ${isYearOpen ? "rotate-90" : "-rotate-90"}`}
            />
          </button>

          {/* Year popover (opens upwards above the calendar) */}
          {isYearOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsYearOpen(false)} />
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-[240px] max-h-[240px] overflow-y-auto z-50 p-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {yearOptions.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => { setViewYear(y); setIsYearOpen(false); }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors border border-transparent ${
                        viewYear === y
                          ? "bg-[#2e3c52] text-white shadow-sm"
                          : "text-[#2e3c52] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
