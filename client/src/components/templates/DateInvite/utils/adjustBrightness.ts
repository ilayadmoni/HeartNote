/** Adjust hex color brightness by percentage (-100 to 100). */
export function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + ((num >> 16) * percent) / 100));
  const g = Math.min(
    255,
    Math.max(0, ((num >> 8) & 0x00ff) + (((num >> 8) & 0x00ff) * percent) / 100),
  );
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + ((num & 0x0000ff) * percent) / 100));
  return `#${(0x1000000 + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1)}`;
}
