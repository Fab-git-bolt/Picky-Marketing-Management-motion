export type Format = "1:1" | "4:5" | "9:16";

export type SafeZone = { top: number; right: number; bottom: number; left: number };

export type FormatSpec = {
  width: number;
  height: number;
  /** Suffixe de fichier / d'ID de composition. */
  slug: string;
  /**
   * Marges où aucun texte ne doit apparaître (UI des réseaux : avatar,
   * légende, boutons d'action, barre de progression).
   */
  safe: SafeZone;
};

export const FORMATS: Record<Format, FormatSpec> = {
  "1:1": {
    width: 1080,
    height: 1080,
    slug: "1x1",
    safe: { top: 96, right: 96, bottom: 110, left: 96 },
  },
  "4:5": {
    width: 1080,
    height: 1350,
    slug: "4x5",
    safe: { top: 120, right: 100, bottom: 150, left: 100 },
  },
  "9:16": {
    width: 1080,
    height: 1920,
    slug: "9x16",
    // Reels / TikTok / Shorts : en-tête en haut, légende + boutons en bas et à droite.
    safe: { top: 260, right: 150, bottom: 420, left: 96 },
  },
};

/**
 * Facteur d'échelle typographique : 1 pour une zone utile de ~1080 px de haut
 * (4:5), réduit pour le 1:1, plafonné à 1 pour le 9:16.
 */
export const typeScale = (f: Format): number => {
  const spec = FORMATS[f];
  const usable = spec.height - spec.safe.top - spec.safe.bottom;
  return Math.min(1, usable / 1080);
};
