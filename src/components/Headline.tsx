import { color } from "../brand/tokens";
import { display } from "../brand/fonts";
import type { Line } from "../copy";
import { useProgress } from "./motion";
import { useSize } from "./Frame";

export type HeadlineLevel = "h1" | "h2" | "h3";

const LEVELS: Record<HeadlineLevel, { size: number; lineHeight: number; tracking: string }> = {
  h1: { size: 112, lineHeight: 1.02, tracking: "-0.03em" },
  h2: { size: 84, lineHeight: 1.05, tracking: "-0.02em" },
  h3: { size: 64, lineHeight: 1.1, tracking: "-0.01em" },
};

/**
 * Soulignement rouille dessiné de gauche à droite : filet 3 px décalé de 5 px
 * sous la ligne de base. Une copie transparente du mot porte le soulignement
 * et est révélée par clip-path — le texte lui-même ne bouge pas.
 */
const Underlined: React.FC<{ text: string; start: number }> = ({ text, start }) => {
  const p = useProgress(start, 12);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {text}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          textDecorationLine: "underline",
          textDecorationColor: color.signal,
          textDecorationThickness: 3,
          textUnderlineOffset: 5,
          textDecorationSkipInk: "none",
          clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
        }}
      >
        {text}
      </span>
    </span>
  );
};

/**
 * Titre Fraunces 400. `underlineAt` : frame (relative) à laquelle le
 * soulignement rouille se dessine.
 */
export const Headline: React.FC<{
  line: Line;
  level?: HeadlineLevel;
  underlineAt?: number;
  tone?: string;
  style?: React.CSSProperties;
}> = ({ line, level = "h1", underlineAt = 0, tone = color.paper, style }) => {
  const s = useSize();
  const lv = LEVELS[level];
  return (
    <div
      style={{
        fontFamily: display,
        fontWeight: 400,
        fontStyle: line.italic ? "italic" : "normal",
        fontSize: s(lv.size),
        lineHeight: lv.lineHeight,
        letterSpacing: lv.tracking,
        color: tone,
        margin: 0,
        textWrap: "balance",
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {line.runs.map((r, i) =>
        r.underline ? <Underlined key={i} text={r.text} start={underlineAt} /> : <span key={i}>{r.text}</span>,
      )}
    </div>
  );
};
