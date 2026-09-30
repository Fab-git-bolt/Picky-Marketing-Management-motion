import { FPS } from "../brand/tokens";

/** Découpage commun aux deux angles (en frames, 30 fps, 20 s). */
export const TIMELINE = {
  hook: { from: 0, duration: 2 * FPS },
  problem: { from: 2 * FPS, duration: 4 * FPS },
  spec: { from: 6 * FPS, duration: 5 * FPS },
  promise: { from: 11 * FPS, duration: 4 * FPS },
  labels: { from: 15 * FPS, duration: 3 * FPS },
  end: { from: 18 * FPS, duration: 2 * FPS },
} as const;

export type SceneKey = keyof typeof TIMELINE;
export const SCENE_ORDER: SceneKey[] = ["hook", "problem", "spec", "promise", "labels", "end"];
