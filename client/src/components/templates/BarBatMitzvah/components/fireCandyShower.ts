import confetti from "canvas-confetti";

const CANDY_EMOJIS = ["🍬", "🍭", "🍫", "🧁", "🍩", "🍪", "🍡"];

export function fireCandyShower(canvas?: HTMLCanvasElement | null) {
  const fire = canvas ? confetti.create(canvas, { resize: true }) : confetti;
  const shapes = CANDY_EMOJIS.map((t) =>
    (confetti as unknown as { shapeFromText: (o: { text: string; scalar: number }) => unknown })
      .shapeFromText({ text: t, scalar: 2 })
  );

  fire({
    particleCount: 70,
    spread: 90,
    startVelocity: 55,
    gravity: 1.1,
    ticks: 260,
    origin: { x: 0.5, y: 0 },
    angle: -90,
    // @ts-expect-error custom shapes accepted at runtime
    shapes,
    scalar: 2,
  });

  setTimeout(() => {
    fire({
      particleCount: 50,
      spread: 70,
      startVelocity: 45,
      gravity: 1.1,
      ticks: 240,
      origin: { x: 0.25, y: 0 },
      angle: -80,
      // @ts-expect-error custom shapes accepted at runtime
      shapes,
      scalar: 2,
    });
    fire({
      particleCount: 50,
      spread: 70,
      startVelocity: 45,
      gravity: 1.1,
      ticks: 240,
      origin: { x: 0.75, y: 0 },
      angle: -100,
      // @ts-expect-error custom shapes accepted at runtime
      shapes,
      scalar: 2,
    });
  }, 220);
}
