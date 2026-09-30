import { color } from "../brand/tokens";
import { display } from "../brand/fonts";
import type { Product } from "../brand/products";

/**
 * Pastille produit — reconstruction fidèle de la charte §05 (grille 64 × 64) :
 * carré 56 × 56 arrondi 6 fond Marine, « P » Fraunces 400 corps 30 en Paper à
 * (20, 43), lettre-clé en Wire à (35, 43), point Signal r 4,5 à (43, 19).
 * PickyStudio : fond Signal, deux lettres Paper (P 100 %, s 70 %), sans point.
 */
export const ProductMark: React.FC<{ product: Product; size: number; style?: React.CSSProperties }> = ({
  product,
  size,
  style,
}) => {
  const studio = Boolean(product.studio);
  const glyph = {
    fontFamily: display,
    fontWeight: 400,
    fontSize: 30,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-label={product.name}
    >
      <rect x={4} y={4} width={56} height={56} rx={6} fill={studio ? color.signal : color.marine} />
      <text x={20} y={43} fill={color.paper} {...glyph}>
        P
      </text>
      <text x={35} y={43} fill={studio ? color.paper : color.wire} fillOpacity={studio ? 0.7 : 1} {...glyph}>
        {product.letter}
      </text>
      {!studio && <circle cx={43} cy={19} r={4.5} fill={color.signal} />}
    </svg>
  );
};
