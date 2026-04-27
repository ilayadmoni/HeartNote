"use client";

/**
 * iOS-safe wrapper around canvas-confetti.
 *
 * The default `confetti()` export tries to spawn a Web Worker via a
 * Blob URL. Under HeartNote's CSP, iOS Safari (esp. <16.4) blocks the
 * Blob worker and throws a fatal exception that bubbles into React's
 * render tree — producing the white-screen-of-death we observe.
 *
 * Fix: build ONE shared instance bound to a body-attached canvas with
 * `useWorker: false`. Every caller goes through `safeConfetti` so we
 * never hit the default global path.
 *
 * Failures are swallowed with a `[MOBILE-DEBUG]` console.warn so the
 * OnScreenErrorLog can surface them on-device without crashing the UI.
 */

import baseConfetti, {
  type Options,
  type CreateTypes,
} from "canvas-confetti";

let instance: CreateTypes | null = null;
let initFailed = false;

function getInstance(): CreateTypes | null {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  if (instance) return instance;
  if (initFailed) return null;

  try {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = [
      "position:fixed",
      "top:0",
      "left:0",
      "width:100vw",
      "height:100vh",
      "pointer-events:none",
      "z-index:2147483646",
    ].join(";");
    document.body.appendChild(canvas);
    instance = baseConfetti.create(canvas, {
      resize: true,
      useWorker: false,
    });
    return instance;
  } catch (err) {
    initFailed = true;
    // eslint-disable-next-line no-console
    console.warn("[MOBILE-DEBUG] safeConfetti init failed:", err);
    return null;
  }
}

export function safeConfetti(opts: Options = {}): void {
  try {
    const fire = getInstance();
    if (!fire) return;
    fire(opts);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[MOBILE-DEBUG] safeConfetti fire failed:", err);
  }
}
