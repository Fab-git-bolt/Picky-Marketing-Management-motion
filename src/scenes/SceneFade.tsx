import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ease, motion } from "../brand/tokens";

/** Sortie de scène : fondu de 0,3 s sur les dernières frames. */
export const SceneFade: React.FC<{ duration: number; exit?: boolean; children: React.ReactNode }> = ({
  duration,
  exit = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = exit
    ? interpolate(frame, [duration - motion.base, duration], [1, 0], {
        easing: ease,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
