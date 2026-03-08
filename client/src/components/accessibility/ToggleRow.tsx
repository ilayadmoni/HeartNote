"use client";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
      <div className="flex-1 pe-2">
        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex flex-shrink-0 h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4826f] ${
          checked ? "bg-[#d4826f]" : "bg-gray-200 dark:bg-gray-600"
        }`}
        aria-label={`${label}: ${checked ? "פעיל" : "כבוי"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
            checked ? "-translate-x-5" : "translate-x-0"
          } ms-1`}
        />
      </button>
    </div>
  );
}
