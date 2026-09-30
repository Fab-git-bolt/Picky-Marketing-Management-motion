import { getAudioDurationInSeconds } from "@remotion/media-utils";
import {
  AbsoluteFill,
  Audio,
  type CalculateMetadataFunction,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "../brand/fonts";
import { body, monoFamily } from "../brand/fonts";
import { color, ease, FPS, radius } from "../brand/tokens";
import { Frame, Stack, useSize } from "../components/Frame";
import { Headline } from "../components/Headline";
import { Typed } from "../components/Typed";
import { Wordmark } from "../components/Wordmark";
import { useAppear, useProgress, useSlot } from "../components/motion";
import { FILM_END, FILM_SHOTS, type FilmMode } from "./copy";

/** Durée nominale d'un plan à l'écran (hors fondu), en frames : 4,4 s. */
export const SHOT = Math.round(4.4 * FPS);
/** Fondu enchaîné entre deux plans : 0,4 s, courbe charte, sans rebond. */
export const CROSSFADE = Math.round(0.4 * FPS);
/** 5 plans × 4,4 s = 22 s (durée nominale, sans allongement). */
export const FILM_DURATION = SHOT * FILM_SHOTS.length;

/** La voix démarre 0,3 s après le début du plan. */
const VOICE_OFFSET = Math.round(0.3 * FPS);
/** Marge minimale après la fin d'une voix avant le fondu vers le plan suivant. */
const VOICE_TAIL = Math.round(0.3 * FPS);

/**
 * Musique de fond, sur les deux versions : plus basse en voix-off pour laisser
 * la voix intelligible. Fondu d'entrée 0,5 s, de sortie 1 s ; bouclée si elle
 * est plus courte que le film, coupée (avec le fondu de sortie) si plus longue.
 */
const MUSIC = {
  file: "audio/musique.mp3",
  volume: { texte: 0.18, "voix-off": 0.12 } as Record<FilmMode, number>,
  fadeIn: Math.round(0.5 * FPS),
  fadeOut: 1 * FPS,
  /** Ducking en voix-off : volume pendant que la voix parle. */
  ducked: 0.07,
  /** Rampe du ducking, avant et après chaque voix : 0,3 s. */
  duckRamp: Math.round(0.3 * FPS),
};

export type PickyFilmProps = {
  mode: FilmMode;
  /** Durées des voix off, en secondes — renseignées par calculateMetadata. */
  voiceDurations?: number[];
  /** Durée de la musique, en secondes — renseignée par calculateMetadata. */
  musicDuration?: number;
};

/**
 * Longueur de chaque plan, en frames : 4,4 s, allongée si la voix off
 * (décalage 0,3 s + voix + 0,3 s de marge) ne tient pas dedans.
 */
const shotLengths = ({ mode, voiceDurations }: PickyFilmProps) =>
  FILM_SHOTS.map((_, i) => {
    const voice = mode === "voix-off" ? voiceDurations?.[i] : undefined;
    return voice === undefined ? SHOT : Math.max(SHOT, VOICE_OFFSET + Math.ceil(voice * FPS) + VOICE_TAIL);
  });

/** Mesure les voix off et fixe la durée du film en conséquence. */
export const calculateFilmMetadata: CalculateMetadataFunction<PickyFilmProps> = async ({ props }) => {
  const voiceDurations =
    props.mode === "voix-off"
      ? await Promise.all(FILM_SHOTS.map((shot) => getAudioDurationInSeconds(staticFile(shot.voice))))
      : undefined;
  const musicDuration = await getAudioDurationInSeconds(staticFile(MUSIC.file));
  const lengths = shotLengths({ ...props, voiceDurations });
  return {
    durationInFrames: lengths.reduce((a, b) => a + b, 0),
    props: { ...props, voiceDurations, musicDuration },
  };
};

/**
 * Voile marine sur chaque clip : dégradé diagonal Ink (≈ 55 % en moyenne) qui
 * unifie les couleurs, plus une bande d'ombre douce derrière la zone de texte.
 */
const Veil: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, rgba(11,18,32,0.68) 0%, rgba(11,18,32,0.50) 50%, rgba(20,40,66,0.55) 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(11,18,32,0) 25%, rgba(11,18,32,0.35) 42%, rgba(11,18,32,0.35) 62%, rgba(11,18,32,0) 80%)",
      }}
    />
  </>
);

/** Musique de fond, fondus calés sur la durée réelle du film. */
const Music: React.FC<{ mode: FilmMode; duration?: number; voices: [number, number][] }> = ({
  mode,
  duration,
  voices,
}) => {
  const { durationInFrames } = useVideoConfig();
  const loop = duration !== undefined && duration * FPS < durationInFrames;
  const base = MUSIC.volume[mode];
  // Ducking : la musique descend à MUSIC.ducked pendant chaque voix, rampes de 0,3 s
  // (la descente se termine au moment où la voix commence, la remontée démarre à sa fin).
  const duck = (f: number) =>
    voices.reduce((level, [from, to]) => {
      const d = interpolate(
        f,
        [from - MUSIC.duckRamp, from, to, to + MUSIC.duckRamp],
        [1, MUSIC.ducked / base, MUSIC.ducked / base, 1],
        { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
      return Math.min(level, d);
    }, 1);
  return (
    <Audio
      src={staticFile(MUSIC.file)}
      loop={loop}
      // Avec la boucle, la courbe de volume suit le temps du film et non celui de chaque tour.
      loopVolumeCurveBehavior="extend"
      volume={(f) =>
        base *
        duck(f) *
        interpolate(
          f,
          [0, MUSIC.fadeIn, durationInFrames - MUSIC.fadeOut, durationInFrames],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      }
    />
  );
};

/** Un clip plein cadre, qui entre en fondu (sauf le premier). */
const Shot: React.FC<{ clip: string; fadeIn: boolean }> = ({ clip, fadeIn }) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE], [0, 1], { easing: ease, extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo src={staticFile(clip)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <Veil />
    </AbsoluteFill>
  );
};

/** Ligne de titre qui entre « en fente » ; soulignement rouille tracé ensuite. */
const FilmLine: React.FC<{ line: (typeof FILM_SHOTS)[number]["lines"][number]; at: number }> = ({ line, at }) => {
  const slot = useSlot(at);
  return (
    <div style={slot.outer}>
      <div style={slot.inner}>
        <Headline line={line} level="h1" underlineAt={at + 8} />
      </div>
    </div>
  );
};

/** Texte d'un plan : la ou les phrases, entrées en fente. */
const ShotText: React.FC<{ shot: (typeof FILM_SHOTS)[number]; length: number }> = ({ shot, length }) => {
  const frame = useCurrentFrame();
  // Sortie : fondu de 0,3 s, terminé quand le plan suivant commence à apparaître.
  const out = interpolate(frame, [length - CROSSFADE - 9, length - CROSSFADE], [1, 0], {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <Stack style={{ opacity: out }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {shot.lines.map((line, i) => (
          <FilmLine key={i} line={line} at={CROSSFADE + 8 + i * 30} />
        ))}
      </div>
    </Stack>
  );
};

/** Plan final : wordmark, signature, CTA et adresse tapée. */
const EndCard: React.FC = () => {
  const s = useSize();
  const logo = useAppear(CROSSFADE);
  const tagline = useSlot(CROSSFADE + 12);
  const cta = useProgress(CROSSFADE + 26, 9);
  return (
    <Stack gap={0}>
      <div style={logo}>
        <Wordmark size={s(168)} />
      </div>
      <div style={{ ...tagline.outer, marginTop: s(32) }}>
        <div style={tagline.inner}>
          <Headline line={FILM_END.tagline} level="h3" />
        </div>
      </div>
      <div style={{ marginTop: s(80), opacity: cta }}>
        {/* Bouton variante Sky : contour, jamais plein rouille. */}
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
          {FILM_END.cta}
        </div>
      </div>
      <div style={{ marginTop: s(30) }}>
        <span style={{ fontFamily: monoFamily, fontSize: s(26), letterSpacing: "0.15em", color: color.sky }}>
          <Typed text={FILM_END.url} start={CROSSFADE + 34} hold={Infinity} />
        </span>
      </div>
    </Stack>
  );
};

/**
 * Film de présentation 9:16, 22 s : cinq clips enchaînés en fondu, voile marine,
 * textes incrustés en mode « texte » ; en mode « voix-off », seul le plan
 * final (logo + CTA) porte du texte.
 */
export const PickyFilm: React.FC<PickyFilmProps> = (props) => {
  const { mode } = props;
  const last = FILM_SHOTS.length - 1;
  const lengths = shotLengths(props);
  // Début de chaque plan (fin de son fondu d'entrée).
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  const end = starts[last] + lengths[last];
  return (
    <AbsoluteFill style={{ backgroundColor: color.ink }}>
      {FILM_SHOTS.map((shot, i) => {
        const from = i === 0 ? 0 : starts[i] - CROSSFADE;
        const duration = (i === last ? end : starts[i + 1]) - from;
        return (
          <Sequence key={shot.clip} name={`plan ${i + 1}`} from={from} durationInFrames={duration}>
            <Shot clip={shot.clip} fadeIn={i > 0} />
            <Frame format="9:16" background={false}>
              {i === last ? (
                <EndCard />
              ) : (
                mode === "texte" && <ShotText shot={shot} length={duration} />
              )}
            </Frame>
          </Sequence>
        );
      })}
      <Music
        mode={mode}
        duration={props.musicDuration}
        voices={
          mode === "voix-off" && props.voiceDurations
            ? props.voiceDurations.map((d, i): [number, number] => [
                starts[i] + VOICE_OFFSET,
                starts[i] + VOICE_OFFSET + Math.ceil(d * FPS),
              ])
            : []
        }
      />
      {/* Voix off : volume plein, 0,3 s après le début de chaque plan. */}
      {mode === "voix-off" &&
        FILM_SHOTS.map((shot, i) => (
          <Sequence key={shot.voice} name={`voix ${i + 1}`} from={starts[i] + VOICE_OFFSET} layout="none">
            <Audio src={staticFile(shot.voice)} volume={1} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
