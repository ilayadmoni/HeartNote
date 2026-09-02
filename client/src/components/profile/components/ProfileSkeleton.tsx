"use client";

/**
 * ProfileSkeleton Component
 * Loading skeleton for profile page.
 */

interface ProfileSkeletonProps {
  isMobile?: boolean;
}

function SkeletonCard({ height = "h-48" }: { height?: string }): JSX.Element {
  return (
    <div className={`bg-surface-raised rounded-card p-6 shadow-soft border border-line ${height} animate-pulse`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-surface-sunken" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-sunken rounded-control w-2/3" />
          <div className="h-3 bg-surface-sunken rounded-control w-1/2" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-surface-sunken rounded-control" />
        <div className="h-3 bg-surface-sunken rounded-control w-3/4" />
        <div className="h-3 bg-surface-sunken rounded-control w-1/2" />
      </div>
    </div>
  );
}

export function ProfileSkeleton({ isMobile = false }: ProfileSkeletonProps): JSX.Element {
  if (isMobile) {
    return (
      <div className="min-h-[100dvh] bg-surface py-6 px-gutter">
        <div className="max-w-md mx-auto">
          <div className="h-8 bg-surface-sunken rounded-control w-32 mb-6 animate-pulse" />
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
    <div className="min-h-[100dvh] bg-surface py-10 px-gutter">
      <div className="max-w-5xl mx-auto">
        <div className="h-9 bg-surface-sunken rounded-control w-40 mb-8 animate-pulse" />
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
