/**
 * Famille produit — charte §05. Les produits se distinguent par leur lettre
 * et leur code mono, jamais par la couleur de la pastille (sauf PickyStudio).
 */
export type Product = {
  code: string;
  name: string;
  /** Lettre-clé, en minuscule, posée à côté du « P ». */
  letter: string;
  /** PickyStudio inverse le code : fond Signal, pas de point. */
  studio?: boolean;
};

export const PICKY_AUDIT: Product = { code: "P-A", name: "PickyAudit", letter: "a" };

/** Les sept briques vendues, dans l'ordre de la charte. */
export const BRICKS: Product[] = [
  { code: "P-01", name: "PickyVoice", letter: "v" },
  { code: "P-02", name: "PickyOrder", letter: "o" },
  { code: "P-03", name: "PickyScan", letter: "s" },
  { code: "P-04", name: "PickyLex", letter: "l" },
  { code: "P-05", name: "PickyDesk", letter: "d" },
  { code: "P-06", name: "PickyPress", letter: "p" },
  { code: "P-07", name: "PickyStudio", letter: "s", studio: true },
];

/** Les huit marques (sept briques + PickyAudit, offert). */
export const ALL_MARKS: Product[] = [...BRICKS, PICKY_AUDIT];
