/** Parse hex to r,g,b tuple */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** Lighten a hex color by mixing toward white */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.min(255, r + Math.round(amount * 255))},${Math.min(255, g + Math.round(amount * 255))},${Math.min(255, b + Math.round(amount * 255))})`;
}

/** Darken a hex color by multiplying down */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;
}
