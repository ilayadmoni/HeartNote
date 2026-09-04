interface BoxingGloveProps {
  size?: number;
  className?: string;
}

export function BoxingGlove({ size = 64, className = "" }: BoxingGloveProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <rect x="26" y="42" width="16" height="16" rx="4" fill="#3f3f46" />
      <rect x="26" y="42" width="16" height="6" rx="3" fill="#27272a" />
      <ellipse cx="32" cy="30" rx="22" ry="20" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
      <ellipse cx="18" cy="22" rx="9" ry="7" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
      <path
        d="M12 30 Q32 40 52 30"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
