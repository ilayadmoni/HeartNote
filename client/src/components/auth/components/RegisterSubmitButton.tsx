"use client";

interface RegisterSubmitButtonProps {
  isSubmitting: boolean;
}

export function RegisterSubmitButton({
  isSubmitting,
}: RegisterSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full py-2.5 px-4 mt-4 rounded-lg bg-[#2e3c52] hover:bg-[#1B263B] text-white font-bold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-hebrew-heading focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e3c52] focus-visible:ring-offset-2"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      ) : (
        "הרשמה"
      )}
    </button>
  );
}
