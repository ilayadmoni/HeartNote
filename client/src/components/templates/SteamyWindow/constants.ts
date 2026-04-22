/**
 * Shared SteamyWindow sizing constants.
 *
 * Keep a single square ratio across crop, preview and runtime canvas surfaces
 * so user composition stays visually consistent.
 */
export const STEAMY_WINDOW_CROP_WIDTH = 400;
export const STEAMY_WINDOW_CROP_HEIGHT = 460;
export const STEAMY_WINDOW_ASPECT_RATIO =
  STEAMY_WINDOW_CROP_WIDTH / STEAMY_WINDOW_CROP_HEIGHT;

export const STEAMY_WINDOW_DESKTOP_CANVAS_WIDTH = 390;
export const STEAMY_WINDOW_DESKTOP_CANVAS_HEIGHT = 390;

export const STEAMY_WINDOW_MOBILE_CANVAS_WIDTH = 300;
export const STEAMY_WINDOW_MOBILE_CANVAS_HEIGHT = 300;