import { color, radius } from "../brand/tokens";
import { body, monoFamily } from "../brand/fonts";
import type { Product } from "../brand/products";
import type { Line, Storyboard } from "../copy";
import { Stack, useSize } from "../components/Frame";
import { Headline, type HeadlineLevel } from "../components/Headline";
import { Eyebrow, Mono, Tag } from "../components/Mono";
import { ROW_STAGGER, SpecCard } from "../components/SpecCard";
import { Typed, typeDuration } from "../components/Typed";
import { Wordmark } from "../components/Wordmark";
import { useAppear, useProgress, useSlot } from "../components/motion";

const Appear: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => <div style={{ ...useAppear(at), ...style }}>{children}</div>;

/** Titre qui entre « en fente » ; le soulignement rouille se trace ensuite en wipe. */
const SlotHeadline: React.FC<{
  line: Line;
  at: number;
  level?: HeadlineLevel;
  tone?: string;
  style?: React.CSSProperties;
}> = ({ line, at, level = "h2", tone, style }) => {
  const slot = useSlot(at);
  return (
    <div style={{ ...slot.outer, ...style }}>
      <div style={slot.inner}>
        <Headline line={line} level={level} tone={tone} underlineAt={at + UNDERLINE_DELAY} />
      </div>
    </div>
  );
};

const UNDERLINE_DELAY = 8;

/** 0–2 s · eyebrow tapé + H1 avec soulignement rouille. */
export const HookScene: React.FC<{ story: Storyboard }> = ({ story }) => {
  const h1At = Math.min(typeDuration(story.eyebrow) - 8, 18);
  return (
    <Stack gap={36}>
      <Eyebrow text={story.eyebrow} start={0} />
      <SlotHeadline line={story.hook} at={h1At} level="h1" />
    </Stack>
  );
};

/**
 * Lignes enchaînées (« trois temps ») : empilement séquentiel, chaque ligne
 * entre en fente toutes les `beat` frames ; la ligne en italique
 * (conclusion) arrive après une pause.
 */
const Beats: React.FC<{ lines: Line[]; beat: number; pause: number }> = ({ lines, beat, pause }) => {
  const s = useSize();
  let t = 0;
  return (
    <Stack gap={18}>
      {lines.map((line, i) => {
        const at = i === 0 ? 0 : (t += line.italic ? pause : beat);
        return (
          <SlotHeadline
            key={i}
            line={line}
            at={at}
            style={line.italic && i > 0 ? { marginTop: s(28) } : undefined}
          />
        );
      })}
    </Stack>
  );
};

/** 2–6 s */
export const ProblemScene: React.FC<{ story: Storyboard }> = ({ story }) => (
  <Beats lines={story.problem} beat={14} pause={36} />
);

/** Frame (relative à la scène) où la spec card commence à se construire. */
export const specCardAt = (story: Storyboard) => (story.spec.lead ? 22 : 0);

/** Frames (relatives à la scène) où chaque label commence ; la frappe démarre 4 frames plus tard. */
export const labelStarts = (story: Storyboard) => {
  let at = 0;
  return story.labels.map((label) => {
    const start = at;
    at += 4 + typeDuration(label) + 4;
    return start;
  });
};

/** Frame (relative à la scène finale) où l'adresse commence à se taper. */
export const END_URL_AT = 18;

/** 6–11 s · la spec card des sept briques se construit. */
export const SpecScene: React.FC<{ story: Storyboard; bricks: Product[] }> = ({ story, bricks }) => {
  const { lead, tab, status, conclusion, followUp } = story.spec;
  const cardAt = specCardAt(story);
  // La conclusion arrive quand la dernière pastille est posée ; le statut s'écrit en parallèle.
  const conclusionAt = cardAt + 10 + bricks.length * ROW_STAGGER + 18;
  return (
    <Stack gap={44}>
      {lead && <SlotHeadline line={lead} at={0} />}
      <div style={{ width: "100%" }}>
        <SpecCard tab={tab} bricks={bricks} status={status} start={cardAt} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
        <SlotHeadline line={conclusion} at={conclusionAt} level="h3" />
        {followUp && <SlotHeadline line={followUp} at={conclusionAt + 30} level="h3" tone={color.wire} />}
      </div>
    </Stack>
  );
};

/** 11–15 s */
export const PromiseScene: React.FC<{ story: Storyboard }> = ({ story }) => (
  <Beats lines={story.promise} beat={14} pause={30} />
);

/** 15–18 s · labels mono tapés un par un. */
export const LabelsScene: React.FC<{ story: Storyboard }> = ({ story }) => {
  const s = useSize();
  const starts = labelStarts(story);
  return (
    <Stack gap={22}>
      {story.labels.map((label, i) => (
        <LabelTag key={label} index={i} label={label} start={starts[i]} last={i === story.labels.length - 1} s={s} />
      ))}
    </Stack>
  );
};

const LabelTag: React.FC<{
  index: number;
  label: string;
  start: number;
  last: boolean;
  s: (px: number) => number;
}> = ({ index, label, start, last, s }) => {
  const box = useProgress(start, 5);
  return (
    <Tag style={{ opacity: box }}>
      <Mono size={20} tone={color.sky}>
        {String(index + 1).padStart(2, "0")}
      </Mono>
      <Mono size={20} tone={color.wire}>
        ·
      </Mono>
      <Mono size={34} tone={color.paper} weight={500} style={{ marginLeft: s(4) }}>
        <Typed text={label} start={start + 4} hold={last ? 40 : 0} />
      </Mono>
    </Tag>
  );
};

/** 18–20 s · wordmark, descripteur, CTA ; l'adresse se tape et le curseur reste. */
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
      <Appear at={12} style={{ marginTop: s(88) }}>
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
      <div style={{ marginTop: s(30) }}>
        <span
          style={{
            fontFamily: monoFamily,
            fontSize: s(26),
            letterSpacing: "0.15em",
            color: color.sky,
            // Exception à la règle « mono en capitales » : une adresse doit se recopier à l'identique.
            textTransform: "none",
          }}
        >
          <Typed text={story.end.url} start={END_URL_AT} hold={Infinity} />
        </span>
      </div>
    </Stack>
  );
};
