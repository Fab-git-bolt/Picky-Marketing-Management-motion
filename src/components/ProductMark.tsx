import { interpolate, useCurrentFrame } from "remotion";
import { color, ease } from "../brand/tokens";
import { display } from "../brand/fonts";
import type { Product } from "../brand/products";

/** Étapes d'assemblage, en frames après `assembleAt`. */
const STEP = { square: 0, p: 4, letter: 8, dot: 12 };
/** Durée totale de l'assemblage, point posé et impulsion comprise. */
export const MARK_ASSEMBLY = STEP.dot + 12;

/**
 * Pastille produit — reconstruction fidèle de la charte §05 (grille 64 × 64) :
 * carré 56 × 56 arrondi 6 fond Marine, « P » Fraunces 400 corps 30 en Paper à
 * (20, 43), lettre-clé en Wire à (35, 43), point Signal r 4,5 à (43, 19).
 * PickyStudio : fond Signal, deux lettres Paper (P 100 %, s 70 %), sans point.
 *
 * `assembleAt` (frame relative) : la pastille s'assemble — carré, puis « P »,
 * puis lettre-clé, puis le point Signal qui se pose avec une seule impulsion
 * (un anneau fin qui s'élargit et s'efface, 0,4 s). Sans `assembleAt` : statique.
 */
export const ProductMark: React.FC<{
  product: Product;
  size: number;
  assembleAt?: number;
  style?: React.CSSProperties;
}> = ({ product, size, assembleAt, style }) => {
  const frame = useCurrentFrame();
  const studio = Boolean(product.studio);
  const step = (offset: number, duration = 5) =>
    assembleAt === undefined
      ? 1
      : interpolate(frame, [assembleAt + offset, assembleAt + offset + duration], [0, 1], {
          easing: ease,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const square = step(STEP.square);
  const p = step(STEP.p);
  const letter = step(STEP.letter);
  const dot = step(STEP.dot, 1);
  const pulse = assembleAt === undefined ? 1 : step(STEP.dot, 12);

  const glyph = { fontFamily: display, fontWeight: 400, fontSize: 30 };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ display: "block", flexShrink: 0, overflow: "visible", ...style }}
      aria-label={product.name}
    >
      <rect
        x={4}
        y={4}
        width={56}
        height={56}
        rx={6}
        fill={studio ? color.signal : color.marine}
        opacity={square}
      />
      <text x={20} y={43} fill={color.paper} opacity={p} {...glyph}>
        P
      </text>
      <text
        x={35}
        y={43}
        fill={studio ? color.paper : color.wire}
        fillOpacity={studio ? 0.7 : 1}
        opacity={letter}
        {...glyph}
      >
        {product.letter}
      </text>
      {!studio && (
        <>
          <circle cx={43} cy={19} r={4.5} fill={color.signal} opacity={dot} />
          {pulse > 0 && pulse < 1 && (
            <circle
              cx={43}
              cy={19}
              r={4.5 + pulse * 6}
              fill="none"
              stroke={color.signal}
              strokeWidth={1.2}
              opacity={1 - pulse}
            />
          )}
        </>
      )}
    </svg>
  );
};
