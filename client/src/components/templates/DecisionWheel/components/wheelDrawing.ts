/**
 * Canvas drawing utilities for the Decision Wheel.
 * Pure functions — no React, no state.
 */

export const SEGMENT_COLORS = [
  "#F8BBD0",
  "#B5EAD7",
  "#C7CEEA",
  "#FFD6A5",
  "#FDFFB6",
  "#A0C4FF",
  "#BDB2FF",
  "#FFC6FF",
];

function getOpenSansFamily(): string {
  if (typeof window === "undefined") return '"OpenSans", sans-serif';
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-open-sans")
    .trim();
  return `${v || '"OpenSans"'}, sans-serif`;
}

function getSliceGeometry(
  segCount: number,
  radius: number,
  wheelSize: number
): {
  labelRadius: number;
  maxWidth: number;
  maxHeight: number;
  baseFontSize: number;
} {
  const segAngleRad = (2 * Math.PI) / segCount;
  const labelRadius = radius * 0.55;
  const chordLength = 2 * labelRadius * Math.sin(segAngleRad / 2);
  const maxWidth = chordLength * 0.8;
  const maxHeight = radius * 0.4;
  const sliceScaleFactor = Math.pow(8 / segCount, 0.35);
  const baseFontSize = (wheelSize / 18) * sliceScaleFactor;
  return { labelRadius, maxWidth, maxHeight, baseFontSize };
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  ctx.font = `bold ${fontSize}px ${getOpenSansFamily()}`;

  if (ctx.measureText(text).width <= maxWidth) return [text];

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      if (ctx.measureText(word).width > maxWidth) {
        let partialWord = "";
        for (const char of word) {
          if (ctx.measureText(partialWord + char).width <= maxWidth) {
            partialWord += char;
          } else {
            if (partialWord) lines.push(partialWord);
            partialWord = char;
          }
        }
        currentLine = partialWord;
      } else {
        currentLine = word;
      }
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

function calculateWrappedText(
  ctx: CanvasRenderingContext2D,
  label: string,
  segCount: number,
  radius: number,
  wheelSize: number
): { fontSize: number; lines: string[]; labelRadius: number; lineHeight: number } {
  const { labelRadius, maxWidth, maxHeight, baseFontSize } = getSliceGeometry(
    segCount,
    radius,
    wheelSize
  );

  let fontSize = Math.min(Math.max(baseFontSize, 9), wheelSize / 9);
  const minFontSize = 8;
  const maxLines = segCount >= 7 ? 3 : 2;

  let lines = wrapText(ctx, label, maxWidth, fontSize);
  let lineHeight = fontSize * 1.15;

  while (
    (lines.length > maxLines || lines.length * lineHeight > maxHeight) &&
    fontSize > minFontSize
  ) {
    fontSize -= 0.5;
    lineHeight = fontSize * 1.15;
    lines = wrapText(ctx, label, maxWidth, fontSize);
  }

  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const lastLine = lines[maxLines - 1];
    if (lastLine.length > 3) lines[maxLines - 1] = lastLine.slice(0, -3) + "...";
  }

  return { fontSize, lines, labelRadius, lineHeight };
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  fontSize: number,
  lineHeight: number
): void {
  ctx.font = `bold ${fontSize}px ${getOpenSansFamily()}`;
  ctx.fillStyle = "#2e3c52";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const totalHeight = lines.length * lineHeight;
  const startY = -totalHeight / 2 + lineHeight / 2;

  lines.forEach((line, index) => {
    ctx.fillText(line, 0, startY + index * lineHeight);
  });
}

export function drawWheel(
  ctx: CanvasRenderingContext2D,
  w: number,
  options: string[]
): void {
  const segCount = options.length || 1;
  const segAngle = 360 / segCount;
  const cx = w / 2;
  const cy = w / 2;
  const r = w / 2 - 4;

  ctx.clearRect(0, 0, w, w);

  for (let i = 0; i < segCount; i++) {
    const startAngle = ((i * segAngle - 90) * Math.PI) / 180;
    const endAngle = (((i + 1) * segAngle - 90) * Math.PI) / 180;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const label = options[i] || "";
    const midAngle = (startAngle + endAngle) / 2;
    const { fontSize, lines, labelRadius, lineHeight } = calculateWrappedText(
      ctx,
      label,
      segCount,
      r,
      w
    );

    const lx = cx + Math.cos(midAngle) * labelRadius;
    const ly = cy + Math.sin(midAngle) * labelRadius;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(midAngle + Math.PI / 2);
    drawWrappedText(ctx, lines, fontSize, lineHeight);
    ctx.restore();
  }
}
