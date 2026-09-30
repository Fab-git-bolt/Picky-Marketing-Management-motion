import { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FORMATS, type Format } from "../brand/formats";
import { color } from "../brand/tokens";
import { monoFamily } from "../brand/fonts";
import { useProgress } from "./motion";

/**
 * Fond commun aux deux angles, toujours derrière le texte.
 * 1. Voile marine diagonal (135°) Ink → Marine.
 * 2. Trame typographique « // », « · », « P-01…P-07 » à ~5 % de Paper, en dérive lente.
 * 3. Filets 1 px Paper 12 % en marges de plan technique.
 * Aucune icône, aucune image, aucune couleur hors charte, pas de rouille.
 */
export const Background: React.FC<{ format: Format }> = ({ format }) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${color.ink} 0%, ${color.ink} 30%, ${color.marine} 100%)`,
      }}
    />
    <Trame format={format} />
    <Blueprint format={format} />
  </AbsoluteFill>
);

const GLYPHS = ["//", "·", "P-01", "P-02", "P-03", "P-04", "P-05", "P-06", "P-07"];
const CELL_X = 216;
const CELL_Y = 150;
/** Dérive continue, en px par frame (≈ 120 px × 60 px sur 20 s). */
const DRIFT = { x: 0.2, y: -0.1 };
const TRAME_OPACITY = 0.05;

const Trame: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { width, height } = FORMATS[format];
  const appear = useProgress(0, 12);

  // Grille décalée en quinconce, plus grande que le cadre pour couvrir la dérive.
  const cells = useMemo(() => {
    const out: { x: number; y: number; glyph: string }[] = [];
    const cols = Math.ceil(width / CELL_X) + 3;
    const rows = Math.ceil(height / CELL_Y) + 3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Grille lâche : environ une case sur trois reste vide.
        if (random(`trame-skip-${r}-${c}`) < 0.33) continue;
        const glyph = GLYPHS[Math.floor(random(`trame-glyph-${r}-${c}`) * GLYPHS.length)];
        out.push({
          x: (c - 2) * CELL_X + (r % 2) * (CELL_X / 2),
          y: (r - 1) * CELL_Y,
          glyph,
        });
      }
    }
    return out;
  }, [width, height]);

  // Masque fixe (hors dérive) : la trame s'efface au centre, derrière le texte,
  // et reste perceptible dans les marges.
  const mask = "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.3) 30%, #000 100%)";
  return (
    <AbsoluteFill style={{ maskImage: mask, WebkitMaskImage: mask }}>
    <AbsoluteFill
      style={{
        opacity: appear,
        transform: `translate(${frame * DRIFT.x}px, ${frame * DRIFT.y}px)`,
      }}
    >
      {cells.map((cell, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: cell.x,
            top: cell.y,
            fontFamily: monoFamily,
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: color.paper,
            opacity: TRAME_OPACITY,
            whiteSpace: "nowrap",
          }}
        >
          {cell.glyph}
        </span>
      ))}
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Écart entre les filets de marge et la zone utile. */
const MARGIN_GAP = 36;
const TICK_STEP = 90;

const Blueprint: React.FC<{ format: Format }> = ({ format }) => {
  const { width, height, safe } = FORMATS[format];
  const draw = useProgress(0, 12);
  const left = safe.left - MARGIN_GAP;
  const right = width - safe.right + MARGIN_GAP;
  const top = safe.top - MARGIN_GAP;
  const bottom = height - safe.bottom + MARGIN_GAP;

  const hLine = (y: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width: "100%",
        height: 1,
        background: color.rule,
        transformOrigin: "left",
        transform: `scaleX(${draw})`,
      }}
    />
  );
  const vLine = (x: number, key: string) => (
    <div
      key={key}
      style={{
        position: "absolute",
        top: 0,
        left: x,
        width: 1,
        height: "100%",
        background: color.rule,
        transformOrigin: "top",
        transform: `scaleY(${draw})`,
      }}
    />
  );

  // Graduations de règle sur le filet gauche, entre les marges haute et basse.
  const ticks: number[] = [];
  for (let y = top + TICK_STEP; y < bottom; y += TICK_STEP) ticks.push(y);

  return (
    <AbsoluteFill>
      {hLine(top, "top")}
      {hLine(bottom, "bottom")}
      {vLine(left, "left")}
      {vLine(right, "right")}
      {ticks.map((y) => (
        <div
          key={y}
          style={{
            position: "absolute",
            left: left - 6,
            top: y,
            width: 12,
            height: 1,
            background: color.rule,
            opacity: draw,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
