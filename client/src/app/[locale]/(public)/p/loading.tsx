"use client";

/**
 * Public Page Loading State
 * Minimal branded loader for viewer pages
 */

export default function PublicLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f5] dark:bg-gray-900">
      <div className="w-10 h-10 border-3 border-[#d4826f] border-t-transparent rounded-full animate-spin mb-3" />
      <p
        className="text-sm text-gray-400 dark:text-gray-500"
        style={{ fontFamily: "'Open Sans', sans-serif" }}
      >
        ...טוען
      </p>
    </div>
  );
}
