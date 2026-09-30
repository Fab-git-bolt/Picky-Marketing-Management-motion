import { color, radius } from "../brand/tokens";
import { monoFamily } from "../brand/fonts";
import { useSize } from "./Frame";

/** JetBrains Mono, toujours en capitales, interlettrage 0,15–0,2 em. */
export const Mono: React.FC<{
  children: React.ReactNode;
  size?: number;
  tone?: string;
  tracking?: number;
  weight?: 400 | 500;
  style?: React.CSSProperties;
}> = ({ children, size = 22, tone = color.sky, tracking = 0.18, weight = 400, style }) => {
  const s = useSize();
  return (
    <span
      style={{
        fontFamily: monoFamily,
        fontWeight: weight,
        fontSize: s(size),
        letterSpacing: `${tracking}em`,
        textTransform: "uppercase",
        color: tone,
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Eyebrow : « // LABEL » en Sky. */
export const Eyebrow: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <Mono size={22} tone={color.sky} style={style}>
    {text.startsWith("//") ? text : `// ${text}`}
  </Mono>
);

/** Micro-étiquette sur fond sombre : pastille Marine, filet Paper 12 %. */
export const Tag: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => {
  const s = useSize();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s(20),
        background: color.marine,
        border: `1px solid ${color.rule}`,
        borderRadius: radius.micro,
        padding: `${s(18)}px ${s(28)}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
