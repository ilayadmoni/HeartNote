import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Decorative heart */}
      <span className="text-6xl mb-6" aria-hidden="true">
        
      </span>

      <h1 className="text-3xl font-black text-[#2e3c52] dark:text-white mb-3">
        הדף לא נמצא
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-sm leading-relaxed">
        לא הצלחנו למצוא את הדף שחיפשת. ייתכן שהקישור שגוי או שהדף כבר לא קיים.
      </p>

      <Link
        href="/"
        className="
          inline-flex items-center gap-2 px-6 py-3 rounded-xl
          bg-[#2e3c52] hover:bg-[#1B263B]
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
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        חזרה לעמוד הבית
      </Link>
    </div>
  );
}
