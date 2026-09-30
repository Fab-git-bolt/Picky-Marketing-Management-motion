import { interpolate, useCurrentFrame } from "remotion";
import { color, ease, radius } from "../brand/tokens";
import { display, monoFamily } from "../brand/fonts";
import type { Product } from "../brand/products";
import { useProgress } from "./motion";
import { useSize } from "./Frame";
import { MARK_ASSEMBLY, ProductMark } from "./ProductMark";
import { Typed, typeDuration } from "./Typed";

/** Décalage entre deux lignes de la fiche, en frames. */
export const ROW_STAGGER = 5;
/** Délai entre l'ouverture de la fiche et la première ligne. */
const FIRST_ROW = 10;

/** Frame (relative à `start`) à laquelle la fiche est entièrement construite. */
export const specCardDuration = (rows: number, status: { key: string; value: string }) =>
  FIRST_ROW + rows * ROW_STAGGER + 6 + typeDuration(status.key) + 4 + typeDuration(status.value);

/**
 * Spec card — élément signature. Fiche mono sur fond Ink, onglet chevauchant
 * le bord supérieur, pointillés entre les lignes. Elle se construit à l'écran :
 * le cadre s'ouvre, l'onglet glisse depuis le bord et se tape, chaque ligne
 * arrive (pastille qui s'assemble · nom · code tapé), les pointillés se tracent,
 * puis la ligne de statut s'écrit et le marqueur ■ s'allume.
 */
export const SpecCard: React.FC<{
  tab: string;
  bricks: Product[];
  status: { key: string; value: string };
  start?: number;
}> = ({ tab, bricks, status, start = 0 }) => {
  const s = useSize();
  const frame = useProgress(start, 9);
  const tabIn = useProgress(start + 3, 9);
  const statusAt = start + FIRST_ROW + bricks.length * ROW_STAGGER + 6;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        padding: `${s(40)}px ${s(40)}px ${s(20)}px`,
      }}
    >
      {/* Cadre de la fiche : s'ouvre avant le contenu. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: color.ink,
          border: `1px solid ${color.rule}`,
          borderRadius: radius.card,
          boxShadow: "0 30px 80px -30px rgba(11, 18, 32, 0.40)",
          opacity: frame,
        }}
      />
      {/* Onglet : glisse depuis le bord gauche de la fiche, puis son libellé se tape. */}
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
          opacity: tabIn,
          transform: `translateX(${(1 - tabIn) * -s(36)}px)`,
        }}
      >
        <Typed text={tab} start={start + 8} hold={0} cursor={false} />
      </span>
      <div style={{ position: "relative" }}>
        {bricks.map((b, i) => (
          <Row key={b.code} product={b} start={start + FIRST_ROW + i * ROW_STAGGER} />
        ))}
        <StatusRow status={status} start={statusAt} />
      </div>
    </div>
  );
};

/** Pointillés de perforation tracés de gauche à droite. */
const Perforation: React.FC<{ at: number }> = ({ at }) => {
  const p = useProgress(at, 9);
  return (
    <div
      style={{
        borderTop: `1px dashed ${color.perforation}`,
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}
    />
  );
};

const Row: React.FC<{ product: Product; start: number }> = ({ product, start }) => {
  const s = useSize();
  const name = useProgress(start + 5, 9);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: s(26), padding: `${s(9)}px 0` }}>
        <ProductMark product={product} size={s(60)} assembleAt={start} />
        <span
          style={{
            fontFamily: display,
            fontWeight: 500,
            fontSize: s(38),
            letterSpacing: "-0.01em",
            color: color.paper,
            lineHeight: 1.1,
            flex: 1,
            clipPath: `inset(-10% ${(1 - name) * 100}% -20% 0)`,
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
          }}
        >
          <Typed text={`// ${product.code}`} start={start + 6} hold={0} />
        </span>
      </div>
      <Perforation at={start + MARK_ASSEMBLY - 12} />
    </>
  );
};

const StatusRow: React.FC<{ status: { key: string; value: string }; start: number }> = ({ status, start }) => {
  const s = useSize();
  const frame = useCurrentFrame();
  const markerAt = start + typeDuration(status.key) + 2;
  // Le marqueur ■ s'allume : bascule du filet éteint vers Sky en 0,15 s.
  const lit = interpolate(frame, [markerAt, markerAt + 5], [0, 1], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const mono = {
    fontFamily: monoFamily,
    fontSize: s(19),
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${s(16)}px 0 ${s(6)}px` }}>
      <span style={{ ...mono, color: color.wire }}>
        <Typed text={status.key} start={start} hold={0} />
      </span>
      <span style={{ ...mono, color: color.paper, display: "inline-flex", alignItems: "center", gap: s(14) }}>
        <span style={{ color: lit > 0 ? color.sky : color.wire, opacity: frame < start ? 0 : 0.3 + lit * 0.7 }}>■</span>
        <Typed text={status.value} start={markerAt + 4} hold={24} />
      </span>
    </div>
  );
};
