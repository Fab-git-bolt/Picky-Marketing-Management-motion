import { type Line, l } from "../copy/types";

/** Espace insécable (typographie française). */
const nb = " ";

export type FilmMode = "texte" | "voix-off";

export type FilmShot = {
  /** Fichier dans public/clips/. */
  clip: string;
  /** Voix off du plan (mode « voix-off » uniquement), dans public/. */
  voice: string;
  /** Phrases incrustées (mode « texte » uniquement). */
  lines: Line[];
};

/**
 * Film « revenu sans risque ». Tutoiement assumé pour ce film
 * (exception au vouvoiement de la charte §11, demandée pour ce support).
 */
export const FILM_SHOTS: FilmShot[] = [
  {
    clip: "clips/plan1-serveurs.mp4",
    voice: "audio/voix1.mp3",
    lines: [{ runs: [{ text: "Tu veux vendre de " }, { text: "l’IA", underline: true }, { text: "." }] }],
  },
  { clip: "clips/plan2-flux.mp4",
    voice: "audio/voix2.mp3", lines: [l("Tu n’as pas l’infrastructure.")] },
  { clip: "clips/plan3-blocs.mp4",
    voice: "audio/voix3.mp3", lines: [l("Nous, oui.", true)] },
  {
    clip: "clips/plan4-surface.mp4",
    voice: "audio/voix4.mp3",
    lines: [
      { runs: [{ text: "Ta marque", underline: true }, { text: " devant." }] },
      l(`Nous, dans${nb}l’ombre.`, true),
    ],
  },
  { clip: "clips/plan5-final.mp4",
    voice: "audio/voix5.mp3", lines: [] },
];

export const FILM_END = {
  tagline: l("L’IA en marque blanche.", true),
  cta: "Deviens partenaire →",
  // Le formulaire partenaire (partners.pickyllc.com n'existe pas).
  url: "pickyllc.com/#contact",
};
