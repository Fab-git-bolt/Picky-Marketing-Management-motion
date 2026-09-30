import { interpolate, useCurrentFrame } from "remotion";
import { ease, motion } from "../brand/tokens";

/** Progression 0→1 démarrant à `start` (frames relatives à la séquence). */
export const useProgress = (start: number, duration: number = motion.base): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/** Apparition discrète : fondu + légère montée. */
export const useAppear = (start: number, duration: number = motion.slow): React.CSSProperties => {
  const p = useProgress(start, duration);
  return { opacity: p, transform: `translateY(${(1 - p) * motion.rise}px)` };
};
