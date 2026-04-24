import confetti from "canvas-confetti";

export function fireShatterConfetti(primaryColor: string, canvas?: HTMLCanvasElement | null) {
  const palette = [primaryColor, "#FFD700", "#FFF8E7", "#FFFFFF", "#E8C77F"];
  const fire = canvas ? confetti.create(canvas, { resize: true }) : confetti;

  fire({
    particleCount: 90,
    spread: 75,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.6 },
    colors: palette,
    scalar: 1.1,
    ticks: 220,
  });

  setTimeout(() => {
    fire({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0.2, y: 0.75 },
      colors: palette,
    });
    fire({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 0.8, y: 0.75 },
      colors: palette,
    });
  }, 180);
}
