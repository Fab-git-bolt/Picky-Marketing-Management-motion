import { createContext, useContext } from "react";
import { AbsoluteFill } from "remotion";
import { FORMATS, type Format, typeScale } from "../brand/formats";
import { color } from "../brand/tokens";
import { Background } from "./Background";

type FrameCtx = { format: Format; scale: number };
const Ctx = createContext<FrameCtx>({ format: "4:5", scale: 1 });

export const useFrameCtx = () => useContext(Ctx);
/** Taille en px mise à l'échelle du format. */
export const useSize = () => {
  const { scale } = useFrameCtx();
  return (px: number) => Math.round(px * scale);
};

/** Fond (voile, trame, filets) + zone utile (safe zone) dans laquelle tout le texte est posé. */
export const Frame: React.FC<{
  format: Format;
  /** `false` : fond transparent (texte posé sur une vidéo, par exemple). */
  background?: boolean;
  children: React.ReactNode;
}> = ({ format, background = true, children }) => {
  const { safe } = FORMATS[format];
  return (
    <Ctx.Provider value={{ format, scale: typeScale(format) }}>
      <AbsoluteFill style={{ backgroundColor: background ? color.ink : "transparent" }}>
        {background && <Background format={format} />}
        <div
          style={{
            position: "absolute",
            top: safe.top,
            right: safe.right,
            bottom: safe.bottom,
            left: safe.left,
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

/** Bloc de contenu d'une scène : colonne calée à gauche, centrée verticalement. */
export const Stack: React.FC<{ gap?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  gap = 32,
  children,
  style,
}) => {
  const s = useSize();
  return (
    <AbsoluteFill
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: s(gap),
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
