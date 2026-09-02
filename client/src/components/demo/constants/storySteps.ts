/**
 * Story Demo Steps
 * Structural data only — titles/descriptions live in messages/{locale}/demo.json
 * under `steps.step{id}`.
 */

export interface StoryStepMeta {
  id: 1 | 2 | 3 | 4;
  duration: number;
}

export const STORY_STEPS: StoryStepMeta[] = [
  { id: 1, duration: 5000 },
  { id: 2, duration: 8500 },
  { id: 3, duration: 6000 },
  { id: 4, duration: 8500 },
];

export const PROGRESS_INTERVAL = 50;
