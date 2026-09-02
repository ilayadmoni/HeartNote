"use client";

/**
 * Error boundary for the /create editor route group.
 * Catches crashes in the editor without replacing the entire layout (header/footer).
 * MED-4: Granular error boundaries for better UX.
 */

export default function CreateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <span className="text-5xl mb-4" aria-hidden="true">
        😵‍💫
      </span>

      <h2 className="text-2xl font-black text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading">
        אירעה שגיאה בעורך
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm text-sm leading-relaxed text-hebrew-body">
        משהו השתבש בזמן טעינת העורך. נסו שוב או חזרו לגלריה.
      </p>

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#d4826f] hover:bg-[#c4735f] text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200"
        >
          נסו שוב
        </button>
        <a
          href="/gallery"
          className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-[#2e3c52] dark:text-white font-bold text-sm rounded-xl transition-all duration-200"
        >
          חזרה לגלריה
        </a>
      </div>
    </div>
  );
}
