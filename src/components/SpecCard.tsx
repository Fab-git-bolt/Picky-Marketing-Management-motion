import { color, radius } from "../brand/tokens";
import { display, monoFamily } from "../brand/fonts";
import type { Product } from "../brand/products";
import { useAppear } from "./motion";
import { useSize } from "./Frame";
import { ProductMark } from "./ProductMark";

/**
 * Spec card — élément signature. Fiche mono sur fond Ink, onglet chevauchant
 * le bord supérieur, pointillés entre les lignes. Chaque ligne : pastille
 * produit · nom en Fraunces 500 · code mono. Les lignes apparaissent l'une
 * après l'autre (`stagger` frames d'écart) à partir de `start`.
 */
export const SpecCard: React.FC<{
  tab: string;
  bricks: Product[];
  start?: number;
  stagger?: number;
}> = ({ tab, bricks, start = 0, stagger = 3 }) => {
  const s = useSize();
  const card = useAppear(start);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        background: color.ink,
        border: `1px solid ${color.rule}`,
        borderRadius: radius.card,
        boxShadow: "0 30px 80px -30px rgba(11, 18, 32, 0.40)",
        padding: `${s(40)}px ${s(40)}px ${s(20)}px`,
        ...card,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: -s(17),
          left: s(36),
          background: color.paper,
          color: color.tide,
          border: `1px solid ${color.rule}`,
          padding: `${s(4)}px ${s(16)}px`,
          fontFamily: monoFamily,
          fontSize: s(18),
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          lineHeight: 1.4,
        }}
      >
        {tab}
      </span>
      {bricks.map((b, i) => (
        <Row key={b.code} product={b} last={i === bricks.length - 1} start={start + 6 + i * stagger} />
      ))}
    </div>
  );
};

const Row: React.FC<{ product: Product; last: boolean; start: number }> = ({ product, last, start }) => {
  const s = useSize();
  const appear = useAppear(start, 9);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: s(26),
        padding: `${s(9)}px 0`,
        borderBottom: last ? "none" : `1px dashed ${color.perforation}`,
        ...appear,
      }}
    >
      <ProductMark product={product} size={s(60)} />
      <span
        style={{
          fontFamily: display,
          fontWeight: 500,
          fontSize: s(38),
          letterSpacing: "-0.01em",
          color: color.paper,
          lineHeight: 1.1,
          flex: 1,
        }}
      >
        {product.name}
      </span>
      <span
        style={{
          fontFamily: monoFamily,
          fontSize: s(19),
          letterSpacing: "0.15em",
          color: color.sky,
          whiteSpace: "nowrap",
        }}
      >
        {`// ${product.code}`}
      </span>
    </div>
  );
};
