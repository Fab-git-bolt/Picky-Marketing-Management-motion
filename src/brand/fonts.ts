import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Polices auto-hébergées (public/fonts, Google Fonts, licence OFL-1.1) :
 * le rendu ne dépend d'aucun accès réseau. Fichiers variables : une même
 * source couvre les graisses 400 et 500.
 */
const FACES = [
  { family: "Fraunces", file: "fraunces-italic-latin-ext.woff2", style: "italic", weight: "400", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  { family: "Fraunces", file: "fraunces-italic-latin.woff2", style: "italic", weight: "400", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { family: "Fraunces", file: "fraunces-latin-ext.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  { family: "Fraunces", file: "fraunces-latin.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { family: "Inter", file: "inter-latin-ext.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  { family: "Inter", file: "inter-latin.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
  { family: "JetBrains Mono", file: "jetbrains-mono-latin-ext.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF" },
  { family: "JetBrains Mono", file: "jetbrains-mono-latin.woff2", style: "normal", weight: "400 500", unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD" },
] as const;

for (const f of FACES) {
  loadFont({
    family: f.family,
    url: staticFile(`fonts/${f.file}`),
    style: f.style,
    weight: f.weight,
    unicodeRange: f.unicodeRange,
    display: "block",
  });
}

const stack = (family: string, fallback: string) => `"${family}", ${fallback}`;

/** Fraunces : titres (400), noms produits · wordmark · métriques (500). */
export const display = stack("Fraunces", "Georgia, serif");
/** Inter : texte courant, boutons. */
export const body = stack("Inter", "system-ui, sans-serif");
/** JetBrains Mono : eyebrows, codes, labels — toujours en capitales. */
export const monoFamily = stack("JetBrains Mono", "ui-monospace, monospace");
