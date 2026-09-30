import { color, radius } from "../brand/tokens";
import { body, monoFamily } from "../brand/fonts";
import type { Brick, Line, Storyboard } from "../copy";
import { Stack, useSize } from "../components/Frame";
import { Headline } from "../components/Headline";
import { Eyebrow, Mono, Tag } from "../components/Mono";
import { SpecCard } from "../components/SpecCard";
import { Wordmark } from "../components/Wordmark";
import { useAppear } from "../components/motion";

const Appear: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => <div style={{ ...useAppear(at), ...style }}>{children}</div>;

const UNDERLINE_DELAY = 10;

/** 0–2 s · eyebrow + H1 avec soulignement rouille. */
export const HookScene: React.FC<{ story: Storyboard }> = ({ story }) => (
  <Stack gap={36}>
    <Appear at={0}>
      <Eyebrow text={story.eyebrow} />
    </Appear>
    <Appear at={5}>
      <Headline line={story.hook} level="h1" underlineAt={5 + UNDERLINE_DELAY} />
    </Appear>
  </Stack>
);

/**
 * Lignes enchaînées (« trois temps »). Les lignes romaines tombent toutes les
 * `beat` frames ; la ligne en italique (conclusion) arrive après une pause.
 */
const Beats: React.FC<{ lines: Line[]; beat: number; pause: number; level?: "h1" | "h2" }> = ({
  lines,
  beat,
  pause,
  level = "h2",
}) => {
  const s = useSize();
  let t = 0;
  return (
    <Stack gap={18}>
      {lines.map((line, i) => {
        const at = i === 0 ? 0 : (t += line.italic ? pause : beat);
        return (
          <Appear key={i} at={at} style={line.italic && i > 0 ? { marginTop: s(28) } : undefined}>
            <Headline line={line} level={level} underlineAt={at + UNDERLINE_DELAY} />
          </Appear>
        );
      })}
    </Stack>
  );
};

/** 2–6 s */
export const ProblemScene: React.FC<{ story: Storyboard }> = ({ story }) => (
  <Beats lines={story.problem} beat={32} pause={40} />
);

/** 6–11 s · spec card des sept briques. */
export const SpecScene: React.FC<{ story: Storyboard; bricks: Brick[] }> = ({ story, bricks }) => {
  const { lead, tab, conclusion, followUp } = story.spec;
  const cardAt = lead ? 30 : 0;
  const rowsDone = cardAt + 6 + bricks.length * 3 + 9;
  const conclusionAt = rowsDone + 12;
  return (
    <Stack gap={44}>
      {lead && (
        <Appear at={0}>
          <Headline line={lead} level="h2" />
        </Appear>
      )}
      <div style={{ width: "100%" }}>
        <SpecCard tab={tab} bricks={bricks} start={cardAt} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        <Appear at={conclusionAt}>
          <Headline line={conclusion} level="h3" />
        </Appear>
        {followUp && (
          <Appear at={conclusionAt + 36}>
            <Headline line={followUp} level="h3" tone={color.wire} />
          </Appear>
        )}
      </div>
    </Stack>
  );
};

/** 11–15 s */
export const PromiseScene: React.FC<{ story: Storyboard }> = ({ story }) => (
  <Beats lines={story.promise} beat={22} pause={30} />
);

/** 15–18 s · labels mono. */
export const LabelsScene: React.FC<{ story: Storyboard }> = ({ story }) => {
  const s = useSize();
  return (
    <Stack gap={22}>
      {story.labels.map((label, i) => (
        <Appear key={label} at={i * 8}>
          <Tag>
            <Mono size={20} tone={color.sky}>
              {String(i + 1).padStart(2, "0")}
            </Mono>
            <Mono size={20} tone={color.wire}>
              ·
            </Mono>
            <Mono size={34} tone={color.paper} weight={500} style={{ marginLeft: s(4) }}>
              {label}
            </Mono>
          </Tag>
        </Appear>
      ))}
    </Stack>
  );
};

/** 18–20 s · wordmark, descripteur, CTA. */
export const EndScene: React.FC<{ story: Storyboard }> = ({ story }) => {
  const s = useSize();
  return (
    <Stack gap={0}>
      <Appear at={0}>
        <Wordmark size={s(168)} />
      </Appear>
      <Appear at={6} style={{ marginTop: s(28) }}>
        <span style={{ fontFamily: body, fontSize: s(36), color: color.wire, lineHeight: 1.4 }}>
          {story.end.descriptor}
        </span>
      </Appear>
      <Appear at={14} style={{ marginTop: s(88) }}>
        {/* Bouton variante Sky (seule variante autorisée sur fond Ink) : contour, jamais plein rouille. */}
        <div
          style={{
            display: "inline-flex",
            border: `2px solid ${color.sky}`,
            borderRadius: radius.pill,
            padding: `${s(22)}px ${s(44)}px`,
            fontFamily: body,
            fontWeight: 500,
            fontSize: s(36),
            color: color.paper,
          }}
        >
          {story.end.cta}
        </div>
      </Appear>
      <Appear at={18} style={{ marginTop: s(30) }}>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: s(26),
            letterSpacing: "0.15em",
            color: color.sky,
          }}
        >
          {story.end.url.toUpperCase()}
        </span>
      </Appear>
    </Stack>
  );
};
