"use client";

/** MenuItem – individual action in the UserMenu dropdown. */

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

export function MenuItem({
  icon,
  label,
  onClick,
  variant = "default",
}: MenuItemProps) {
  const colorClass =
    variant === "danger"
      ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
      : "text-[#2e3c52] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700";

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-2
        text-sm text-hebrew-body
        transition-colors duration-150
        ${colorClass}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
