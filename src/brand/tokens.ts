import { Easing } from "remotion";

/** Palette — Picky, charte v1.1 §02. Aucun blanc pur. */
export const color = {
  ink: "#0B1220",
  marine: "#142842",
  tide: "#1E3A5F",
  sky: "#4A7CBF",
  wire: "#8FA5C1",
  paper: "#F5F3EE",
  /** Filets sur fond sombre : Paper à 12 %. */
  rule: "rgba(245, 243, 238, 0.12)",
  /** Pointillés de spec card. */
  perforation: "rgba(245, 243, 238, 0.15)",
  /**
   * Accent rouille. Usage strictement limité à :
   * soulignement d'un mot-clé (filet 3 px décalé de 5 px) et point du logo.
   */
  signal: "#C4491D",
} as const;

export const FPS = 30;
export const DURATION_IN_FRAMES = 20 * FPS;

/** Transitions 0,15–0,4 s, cubic-bezier(0.4, 0, 0.2, 1). Pas de rebond. */
export const ease = Easing.bezier(0.4, 0, 0.2, 1);
export const motion = {
  fast: Math.round(0.15 * FPS),
  base: Math.round(0.3 * FPS),
  slow: Math.round(0.4 * FPS),
  /** Déplacement vertical d'apparition, en px. */
  rise: 14,
} as const;

export const radius = { micro: 2, card: 4, pill: 999 } as const;
