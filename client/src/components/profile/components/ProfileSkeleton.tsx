"use client";

/**
 * ProfileSkeleton Component
 * Loading skeleton for profile page.
 */

interface ProfileSkeletonProps {
  isMobile?: boolean;
}

export function ProfileSkeleton({ isMobile = false }: ProfileSkeletonProps) {
  const SkeletonCard = ({ height = "h-48" }: { height?: string }) => (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 ${height} animate-pulse`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-6 px-4">
        <div className="max-w-md mx-auto">
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6 animate-pulse" />

          {/* Cards */}
          <div className="space-y-4">
            <SkeletonCard height="h-44" />
            <SkeletonCard height="h-36" />
            <SkeletonCard height="h-52" />
            <SkeletonCard height="h-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Title skeleton */}
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-8 animate-pulse" />

        {/* Two column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SkeletonCard height="h-52" />
            <SkeletonCard height="h-40" />
            <SkeletonCard height="h-48" />
          </div>
          <div className="space-y-6">
            <SkeletonCard height="h-28" />
            <SkeletonCard height="h-56" />
            <SkeletonCard height="h-64" />
            <SkeletonCard height="h-36" />
          </div>
        </div>
      </div>
    </div>
  );
}
