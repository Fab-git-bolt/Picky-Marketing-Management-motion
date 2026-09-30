import { color } from "../brand/tokens";
import { display } from "../brand/fonts";

/**
 * Logotype typographique « .Picky » — Fraunces 500, approche −0,02 em.
 * Point Signal posé sur la ligne de base, à gauche du « P »,
 * diamètre ≈ 34 % du corps (charte §04, v1.1).
 */
export const Wordmark: React.FC<{ size: number; tone?: string }> = ({ size, tone = color.paper }) => {
  const dot = Math.round(size * 0.34);
  return (
    <span
      style={{
        fontFamily: display,
        fontWeight: 500,
        fontSize: size,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        color: tone,
        display: "inline-flex",
        alignItems: "baseline",
        gap: Math.round(size * 0.14),
      }}
    >
      <span
        style={{
          width: dot,
          height: dot,
          borderRadius: "50%",
          background: color.signal,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      Picky
    </span>
  );
};
