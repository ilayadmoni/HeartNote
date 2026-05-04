"use client";

import { Calendar } from "lucide-react";

interface MobileNativeDateInputProps {
  value: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
  disabled: boolean;
  error?: string;
}

export function MobileNativeDateInput({
  value,
  onChange,
  min,
  max,
  disabled,
  error,
}: MobileNativeDateInputProps) {
  return (
    <div className="block md:hidden w-full overflow-hidden">
      <div className="relative w-full">
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#C7CEEA] dark:text-[#B5EAD7] z-[1]">
          <Calendar size={16} />
        </span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          className={`
            w-full max-w-full min-w-0 box-border appearance-none
            pr-10 pl-3 py-2.5 text-sm rounded-lg
            bg-white dark:bg-gray-700 text-[#2e3c52] dark:text-white
            border-2 transition-all duration-200 text-hebrew-body
            focus:outline-none focus:ring-0
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder-gray-400 dark:placeholder-gray-500
            [&::-webkit-date-and-time-value]:text-right
            [&::-webkit-calendar-picker-indicator]:opacity-0
            [&::-webkit-calendar-picker-indicator]:absolute
            [&::-webkit-calendar-picker-indicator]:inset-0
            [&::-webkit-calendar-picker-indicator]:w-full
            [&::-webkit-calendar-picker-indicator]:h-full
            [&::-webkit-calendar-picker-indicator]:cursor-pointer
            [&::-webkit-calendar-picker-indicator]:m-0
            [&::-webkit-calendar-picker-indicator]:p-0
            ${error
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 dark:border-gray-600 focus:border-[#d4826f] dark:focus:border-[#e8917a]"
            }
          `}
        />
      </div>
    </div>
  );
}
