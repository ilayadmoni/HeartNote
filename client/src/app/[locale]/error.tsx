"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Decorative icon */}
      <span className="text-6xl mb-6" aria-hidden="true">
        😵‍💫
      </span>

      <h1 className="text-3xl font-black text-[#2e3c52] dark:text-white mb-3">
        משהו השתבש
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-sm text-sm leading-relaxed">
        אירעה שגיאה בלתי צפויה. נסו שוב או חזרו לעמוד הבית.
      </p>

      {error?.digest && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-8 max-w-sm truncate">
          קוד שגיאה: {error.digest}
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-[#d4826f] hover:bg-[#c4735f]
            text-white font-bold text-sm
            transition-all duration-200
            shadow-md hover:shadow-lg
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
          נסו שוב
        </button>

        <a
          href="/"
          className="
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            bg-gray-100 dark:bg-gray-800
            hover:bg-gray-200 dark:hover:bg-gray-700
            text-[#2e3c52] dark:text-white font-bold text-sm
            transition-all duration-200
          "
        >
          עמוד הבית
        </a>
      </div>
    </div>
  );
}
