"use client";

interface SafeModeFallbackProps {
  message?: string;
}

export function SafeModeFallback({
  message = "הטעינה נמשכת זמן רב מהרגיל. ניתן לרענן את העמוד.",
}: SafeModeFallbackProps) {
  return (
    <div
      role="alert"
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center"
      style={{ background: "#faf3ec" }}
    >
      <p className="text-base text-stone-700 max-w-md break-words">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-full bg-stone-800 text-white font-bold"
      >
        רענן עכשיו
      </button>
    </div>
  );
}
