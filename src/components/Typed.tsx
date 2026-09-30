import { useCurrentFrame } from "remotion";
import { FPS } from "../brand/tokens";

/** Cadence de frappe par défaut : 1,5 caractère par frame (45 car./s). */
export const TYPE_RATE = 1.5;
/** Clignotement du curseur : 0,5 s allumé, 0,5 s éteint (bascule sèche). */
const BLINK = FPS / 2;

/** Durée de frappe, en frames, pour un texte donné. */
export const typeDuration = (text: string, rate = TYPE_RATE) => Math.ceil(text.length / rate);

/**
 * Machine à écrire caractère par caractère, avec curseur bloc clignotant.
 * Le texte restant est réservé (transparent) : la mise en page ne bouge pas
 * pendant la frappe. Le curseur reste `hold` frames après la dernière frappe
 * (Infinity = invite qui clignote jusqu'à la fin).
 * À placer dans un <Mono> : hérite de sa police, sa couleur et sa casse.
 */
export const Typed: React.FC<{
  text: string;
  start: number;
  rate?: number;
  hold?: number;
  cursor?: boolean;
}> = ({ text, start, rate = TYPE_RATE, hold = 18, cursor = true }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const count = Math.max(0, Math.min(text.length, Math.floor(t * rate)));
  const typing = t >= 0 && count < text.length;
  const doneAt = typeDuration(text, rate);
  // Pendant la frappe, le curseur reste allumé ; ensuite il clignote.
  const blinkOn = typing || Math.floor((t - doneAt) / BLINK) % 2 === 0;
  const showCursor = cursor && t >= 0 && t < doneAt + hold && blinkOn;
  return (
    <span style={{ whiteSpace: "pre" }}>
      <span style={{ position: "relative" }}>
        {text.slice(0, count)}
        {showCursor && (
          <span
            style={{
              position: "absolute",
              left: "100%",
              top: "0.12em",
              width: "0.6em",
              height: "1.05em",
              marginLeft: "0.08em",
              background: "currentColor",
            }}
          />
        )}
      </span>
      <span style={{ color: "transparent" }}>{text.slice(count)}</span>
    </span>
  );
};
