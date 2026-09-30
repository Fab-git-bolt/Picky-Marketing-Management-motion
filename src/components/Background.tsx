import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FORMATS, type Format } from "../brand/formats";
import { ALL_MARKS, type Product } from "../brand/products";

const TRAME_MARKS = ALL_MARKS.filter((p) => !p.studio);
import { color } from "../brand/tokens";
import { useProgress } from "./motion";
import { ProductMark } from "./ProductMark";

/**
 * Fond commun aux deux angles, toujours derrière le texte.
 * 1. Voile marine diagonal (135°) Ink → Marine.
 * 2. Trame de pastilles produit (§05) en grille régulière, ~6 % d'opacité, dérive lente.
 * 3. Filets 1 px Paper 12 % en marges de plan technique.
 * Aucune icône, aucune image, aucune couleur hors charte.
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

/*
 * Trame de pastilles — RÈGLE : disposition ordonnée, jamais aléatoire.
 * Grille régulière et alignée (même pas en x et en y, pas de quinconce,
 * pas de case vide), toutes les pastilles à la même taille et à la même
 * opacité. Ordre déterministe : les marques se succèdent en lecture
 * ligne par ligne. PickyStudio (aplat Signal) est exclu du fond : ses
 * tuiles rouilles ressortiraient comme des taches et casseraient l'ordre. Deux pastilles au plus sont légèrement mises en avant.
 * Ne pas réintroduire de tirage aléatoire ici.
 */
const CELL = 216; // 1080 / 5 : cinq colonnes exactes, centrées sur le cadre.
const MARK_SIZE = 104;
const MARK_OPACITY = 0.06;
const HIGHLIGHT_OPACITY = 0.1;
/** Dérive continue, verticale uniquement : ≈ 90 px vers le haut sur 20 s. */
const DRIFT_Y = -0.15;

const Trame: React.FC<{ format: Format }> = ({ format }) => {
  const frame = useCurrentFrame();
  const { width, height } = FORMATS[format];
  const appear = useProgress(0, 12);

  const cells = useMemo(() => {
    const cols = Math.round(width / CELL);
    // Rangées centrées verticalement, une de plus de chaque côté pour couvrir la dérive.
    const rowsHalf = Math.ceil(height / 2 / CELL) + 1;
    const out: { x: number; y: number; product: Product; key: string }[] = [];
    let i = 0;
    for (let r = -rowsHalf; r <= rowsHalf; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: CELL / 2 + c * CELL,
          y: height / 2 + r * CELL,
          product: TRAME_MARKS[i % TRAME_MARKS.length],
          key: `${r}:${c}`,
        });
        i++;
      }
    }
    // Deux pastilles mises en avant, aux coins opposés (haut droit, bas gauche).
    const nearest = (tx: number, ty: number) =>
      out.reduce((best, cell) =>
          Math.hypot(cell.x - tx, cell.y - ty) < Math.hypot(best.x - tx, best.y - ty) ? cell : best,
        ).key;
    const highlighted = new Set([nearest(width - CELL / 2, CELL / 2), nearest(CELL / 2, height - CELL / 2)]);
    return out.map((cell) => ({ ...cell, highlight: highlighted.has(cell.key) }));
  }, [width, height]);

  return (
    <AbsoluteFill style={{ opacity: appear, transform: `translateY(${frame * DRIFT_Y}px)` }}>
      {cells.map((cell) => (
        <ProductMark
          key={cell.key}
          product={cell.product}
          size={MARK_SIZE}
          style={{
            position: "absolute",
            left: cell.x - MARK_SIZE / 2,
            top: cell.y - MARK_SIZE / 2,
            opacity: cell.highlight ? HIGHLIGHT_OPACITY : MARK_OPACITY,
          }}
        />
      ))}
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
