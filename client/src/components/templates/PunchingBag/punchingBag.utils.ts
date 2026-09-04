const TILT_PATTERN = [0, -18, 14, -8, 5, 0];

export function getTiltKeyframes(hits: number, hitsRequired: number): number[] {
  const intensity = 0.6 + (hits / hitsRequired) * 0.8;
  return TILT_PATTERN.map((deg) => deg * intensity);
}
