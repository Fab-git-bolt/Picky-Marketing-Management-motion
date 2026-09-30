import { interpolate, useCurrentFrame } from "remotion";
import { color } from "../brand/tokens";
import { SCENE_ORDER, TIMELINE } from "../scenes/timeline";
import { Mono } from "./Mono";
import { useSize } from "./Frame";

/**
 * Repère discret en haut de la zone utile : numéro de séquence sur deux
 * chiffres et filet Paper 12 % avec avancement en Sky. Masqué sur le plan final.
 */
export const SceneCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useSize();
  const last = SCENE_ORDER.length - 1;
  const index = SCENE_ORDER.filter((k) => frame >= TIMELINE[k].from).length - 1;
  const endFrom = TIMELINE.end.from;
  const opacity = interpolate(frame, [0, 9, endFrom - 9, endFrom], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = Math.min(1, frame / endFrom);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, opacity }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: s(14) }}>
        <Mono size={18} tone={color.sky}>
          {`${pad(index + 1)} / ${pad(last)}`}
        </Mono>
      </div>
      <div style={{ position: "relative", height: 1, background: color.rule }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 1,
            width: `${progress * 100}%`,
            background: color.sky,
          }}
        />
      </div>
    </div>
  );
};
