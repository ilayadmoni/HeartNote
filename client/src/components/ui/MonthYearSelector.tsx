"use client";

import { Dispatch, SetStateAction } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";


interface MonthYearSelectorProps {
  months: string[];
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
  months,
  viewMonth,
  viewYear,
  yearOptions,
  isYearOpen,
  setViewMonth,
  setViewYear,
  setIsYearOpen,
  prevMonth,
  nextMonth,
}: MonthYearSelectorProps): JSX.Element {
  const t = useTranslations("editor");
  return (
    <div className="bg-gradient-to-l from-[#B5EAD7] to-[#C7CEEA] px-4 py-4 space-y-3 rounded-t-card relative z-10">
      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label={t("calendar.prevMonth")}
        >
          <ChevronRight size={20} className="text-navy-700" />
        </button>

        <span className="text-caption font-semibold text-navy-700">{t("calendar.pickDate")}</span>

        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-white/30 transition-colors flex-shrink-0"
          aria-label={t("calendar.nextMonth")}
        >
          <ChevronLeft size={20} className="text-navy-700" />
        </button>
      </div>

      {/* Month + Year dropdowns */}
      <div className="grid grid-cols-2 gap-2">
        {/* Month */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-navy-700">{t("calendar.monthLabel")}</label>
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className="w-full bg-white/80 hover:bg-white text-body-md font-semibold text-navy-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-control border border-white/40 px-2 py-1.5 appearance-none transition-colors"
            aria-label={t("calendar.monthLabel")}
          >
            {months.map((name, idx) => (
              <option key={idx} value={idx}>{name}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-[10px] font-bold text-navy-700">{t("calendar.yearLabel")}</label>
          <button
            type="button"
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="w-full bg-white/80 hover:bg-white text-body-sm font-semibold text-navy-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy-700 rounded-control border border-white/40 px-2 py-1.5 transition-colors flex justify-between items-center"
            aria-label={t("calendar.yearLabel")}
            aria-expanded={isYearOpen}
          >
            <span>{viewYear}</span>
            <ChevronLeft
              size={16}
              className={`transform transition-transform text-navy-700 ${isYearOpen ? "rotate-90" : "-rotate-90"}`}
            />
          </button>

          {/* Year popover (opens upwards above the calendar) */}
          {isYearOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsYearOpen(false)} />
              <div className="absolute bottom-full end-0 mb-2 bg-surface-raised rounded-card shadow-lift border border-line w-[240px] max-h-[240px] overflow-y-auto z-50 p-3">
                <div className="grid grid-cols-3 gap-1.5">
                  {yearOptions.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => { setViewYear(y); setIsYearOpen(false); }}
                      className={`py-2 text-caption font-bold rounded-control transition-colors border border-transparent ${
                        viewYear === y ? "bg-navy-700 text-white shadow-soft" : "text-ink hover:bg-surface-sunken hover:border-line"
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
