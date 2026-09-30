/**
 * Un fragment de texte. `underline` = soulignement rouille (un seul par titre).
 * `italic` = phrase de conclusion (une seule par bloc).
 */
export type Run = { text: string; underline?: boolean };
export type Line = { runs: Run[]; italic?: boolean };

export type Storyboard = {
  eyebrow: string;
  /** 0–2 s */
  hook: Line;
  /** 2–6 s : lignes enchaînées. */
  problem: Line[];
  /** 6–11 s : spec card. */
  spec: {
    lead?: Line;
    tab: string;
    /** Ligne de statut de la fiche : clé mono et valeur précédée du marqueur ■. */
    status: { key: string; value: string };
    conclusion: Line;
    followUp?: Line;
  };
  /** 11–15 s : lignes enchaînées. */
  promise: Line[];
  /** 15–18 s : labels mono. */
  labels: string[];
  /** 18–20 s */
  end: {
    descriptor: string;
    cta: string;
    url: string;
  };
};

export type Angle = "manque-a-gagner" | "revenu-sans-risque";
export type Lang = "fr" | "en";

/** Helper : ligne simple, sans soulignement. */
export const l = (text: string, italic = false): Line => ({ runs: [{ text }], italic });
