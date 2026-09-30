import { Audio, getStaticFiles, interpolate, Sequence, staticFile } from "remotion";
import { BRICKS } from "../brand/products";
import { DURATION_IN_FRAMES, FPS } from "../brand/tokens";
import type { Storyboard } from "../copy";
import { specCardCues } from "../components/SpecCard";
import { typeDuration } from "../components/Typed";
import { END_URL_AT, labelStarts, specCardAt } from "../scenes/Scenes";
import { TIMELINE } from "../scenes/timeline";

/** Musique de fond : public/musique.mp3, volume 0,15, fondu d'entrée 0,5 s, de sortie 1 s. */
const MUSIC = { file: "musique.mp3", volume: 0.15, fadeIn: 0.5 * FPS, fadeOut: 1 * FPS };

/** Sons d'interface : volume discret, et au plus un tick toutes les 4 frames pendant une frappe. */
const SFX_VOLUME = 0.25;
const TICK_EVERY = 4;

/**
 * Sons d'interface optionnels, détectés dans public/sfx/ :
 * - fichier dont le nom contient « tick », « key » ou « type » → frappe machine ;
 * - fichier dont le nom contient « clic » / « click » → lignes de la spec card.
 * Un seul fichier présent sert aux deux usages. Sans fichier : aucun son d'interface.
 */
const findSfx = () => {
  const files = getStaticFiles().filter((f) => /^sfx\/.+\.(wav|mp3|ogg|m4a|aac)$/i.test(f.name));
  const pick = (re: RegExp) => files.find((f) => re.test(f.name))?.name;
  const tick = pick(/tick|key|type/i) ?? pick(/clic|click/i) ?? files[0]?.name;
  const click = pick(/clic|click/i) ?? tick;
  return { tick, click };
};

/** Frames absolues des sons : ticks pendant la frappe, clics sur les lignes de la fiche. */
const cues = (story: Storyboard) => {
  const ticks: number[] = [];
  const typing = (from: number, text: string) => {
    for (let f = 0; f < typeDuration(text); f += TICK_EVERY) ticks.push(from + f);
  };
  typing(TIMELINE.hook.from, story.eyebrow);
  const labels = labelStarts(story);
  story.labels.forEach((label, i) => typing(TIMELINE.labels.from + labels[i] + 4, label));
  typing(TIMELINE.end.from + END_URL_AT, story.end.url);

  const card = specCardCues(BRICKS.length, story.spec.status);
  const cardFrom = TIMELINE.spec.from + specCardAt(story);
  const clicks = [...card.rows, card.markerAt].map((f) => cardFrom + f);
  return { ticks, clicks };
};

export const Soundtrack: React.FC<{ story: Storyboard }> = ({ story }) => {
  const sfx = findSfx();
  const { ticks, clicks } = cues(story);
  return (
    <>
      <Audio
        src={staticFile(MUSIC.file)}
        volume={(f) =>
          MUSIC.volume *
          interpolate(
            f,
            [0, MUSIC.fadeIn, DURATION_IN_FRAMES - MUSIC.fadeOut, DURATION_IN_FRAMES],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {sfx.tick &&
        ticks.map((f) => (
          <Sequence key={`t${f}`} from={f} durationInFrames={FPS / 2} layout="none">
            <Audio src={staticFile(sfx.tick!)} volume={SFX_VOLUME} />
          </Sequence>
        ))}
      {sfx.click &&
        clicks.map((f) => (
          <Sequence key={`c${f}`} from={f} durationInFrames={FPS / 2} layout="none">
            <Audio src={staticFile(sfx.click!)} volume={SFX_VOLUME} />
          </Sequence>
        ))}
    </>
  );
};
