export type HolidaySceneStatus = "idle" | "playing" | "revealed";

export interface HolidaySceneProps {
  status: HolidaySceneStatus;
  reduceMotion: boolean;
  progress: number;
}
