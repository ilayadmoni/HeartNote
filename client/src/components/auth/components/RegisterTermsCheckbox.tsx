"use client";

import Link from "next/link";

interface RegisterTermsCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

export function RegisterTermsCheckbox({
  checked,
  onToggle,
  error,
}: RegisterTermsCheckboxProps) {
  return (
    <div className="mt-4 mb-3">
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex items-center gap-2 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-1 rounded"
        dir="rtl"
      >
        <span className="text-xs text-[#2e3c52] dark:text-gray-300 text-hebrew-body leading-relaxed">
          קראתי ואני מאשר/ת את{" "}
          <Link
            href="/privacy"
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="underline text-[#d4826f] hover:text-[#c4725f] dark:text-[#e8917a] dark:hover:text-[#f0a18a] font-semibold"
          >
            תנאי השימוש ומדיניות הפרטיות
          </Link>
        </span>

        <span
          className={`
            shrink-0 flex items-center justify-center
            w-[18px] h-[18px] rounded-[4px] border-2
            transition-all duration-150
            ${
              checked
                ? "bg-[#2e3c52] border-[#2e3c52] dark:bg-[#d4826f] dark:border-[#d4826f]"
                : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"
            }
          `}
        >
          <svg
            className={`w-[11px] h-[11px] text-white pointer-events-none transition-all duration-150 ${
              checked ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6l3 3 5-5" />
          </svg>
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 text-hebrew-body text-right">
          {error}
        </p>
      )}
    </div>
  );
}
