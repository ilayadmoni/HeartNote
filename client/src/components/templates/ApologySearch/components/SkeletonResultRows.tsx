interface SkeletonResultRowsProps {
  size?: "desktop" | "mobile";
}

const ROW_STYLES = [
  { width: "w-3/4", delay: "[animation-delay:0s]" },
  { width: "w-full", delay: "[animation-delay:0.12s]" },
  { width: "w-2/3", delay: "[animation-delay:0.24s]" },
];

export function SkeletonResultRows({ size = "desktop" }: SkeletonResultRowsProps) {
  const barHeight = size === "desktop" ? "h-4" : "h-3";
  return (
    <div className="w-full max-w-lg flex flex-col gap-3">
      {ROW_STYLES.map((row, index) => (
        <div
          key={index}
          className={`rounded-pill bg-gradient-to-r from-surface-sunken via-surface-raised to-surface-sunken bg-[length:200%_100%] animate-shimmer ${barHeight} ${row.width} ${row.delay}`}
        />
      ))}
    </div>
  );
}
