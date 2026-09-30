import { BRICKS, type Product } from "../brand/products";
import { COPY_FR } from "./fr";
import type { Angle, Lang, Storyboard } from "./types";

export * from "./types";

type LangPack = { copy: Record<Angle, Storyboard> };

/**
 * Textes par langue. L'anglais est prévu mais pas encore rédigé :
 * ajouter `src/copy/en.ts` (même forme que fr.ts) puis l'enregistrer ici.
 * Règle de charte : FR et EN au même niveau, jamais mélangés, jamais traduits mot à mot.
 */
const PACKS: Partial<Record<Lang, LangPack>> = {
  fr: { copy: COPY_FR },
};

export const getCopy = (lang: Lang, angle: Angle): { story: Storyboard; bricks: Product[] } => {
  const pack = PACKS[lang];
  if (!pack) {
    throw new Error(`Langue « ${lang} » pas encore disponible : ajoutez src/copy/${lang}.ts.`);
  }
  return { story: pack.copy[angle], bricks: BRICKS };
};
