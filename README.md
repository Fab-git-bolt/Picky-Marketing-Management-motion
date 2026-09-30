# Picky — motion

Template [Remotion](https://www.remotion.dev) pour les vidéos sociales Picky
(infrastructure IA en marque blanche). Univers sombre, esthétique « spec card ».

## Démarrer

```bash
npm install
npm run render:manque-a-gagner     # → out/picky-manque-a-gagner-4x5.mp4
npm run render:revenu-sans-risque  # → out/picky-revenu-sans-risque-4x5.mp4
npm run render:all                 # les deux
npm run studio                     # prévisualisation interactive
```

Autres formats : `npx remotion render <angle>-<1x1|4x5|9x16> out/<fichier>.mp4`
(liste complète : `npx remotion compositions src/index.ts`).

## Film de présentation 9:16 (`src/film/`)

```bash
npm run render:film-texte    # → out/picky-film-texte-9x16.mp4
npm run render:film-voixoff  # → out/picky-film-voixoff-9x16.mp4
npm run render:films         # les deux
```

Composant `PickyFilm`, prop `mode` : `"texte"` (phrases incrustées) ou `"voix-off"`
(plans nus, seul le plan final logo + CTA garde du texte). 1080×1920, 30 fps, 22 s :
5 clips de `public/clips/` × 4,4 s, fondu enchaîné 0,4 s, voile marine diagonal sur
chaque clip. Textes dans `src/film/copy.ts` (tutoiement assumé pour ce film).

Voix off (mode `voix-off`) : `public/audio/voix1…5.mp3`, une par plan, volume 1,0, départ
0,3 s après le début du plan. Les durées sont mesurées au rendu : si une voix (plus 0,3 s
de marge) dépasse 4,4 s, son plan s'allonge d'autant et le film avec.

Musique (deux versions) : `public/audio/musique.mp3`, volume 0,18 en `texte`, 0,12 en
`voix-off` (abaissée à 0,07 pendant chaque voix, rampes de 0,3 s), fondu d'entrée 0,5 s
et de sortie 1 s calés sur la durée du film ; bouclée si
plus courte que le film, coupée sinon.

## Props du composant `PickyAd`

| Prop     | Valeurs                                     |
|----------|---------------------------------------------|
| `angle`  | `"manque-a-gagner"` · `"revenu-sans-risque"` |
| `format` | `"1:1"` · `"4:5"` · `"9:16"` (fixe aussi les dimensions) |
| `lang`   | `"fr"` (`"en"` prévu : ajouter `src/copy/en.ts`) |

20 s · 30 fps · 600 frames.

## Arborescence

```
src/
  brand/      tokens (couleurs, mouvement), polices, formats + safe zones
  copy/       textes par langue et par angle (seul endroit à éditer pour le texte)
  brand/products.ts  catalogue des 8 marques (code, nom, lettre-clé)
  components/ Headline (soulignement rouille), SpecCard, ProductMark, Wordmark, Mono/Eyebrow/Tag…
  scenes/     découpage temporel commun + les six scènes
  PickyAd.tsx composition paramétrable
  Root.tsx    une composition par angle × format
public/fonts/ Fraunces, Inter, JetBrains Mono (auto-hébergées, OFL-1.1)
public/musique.mp3  musique de fond
public/sfx/   sons d'interface optionnels (absent par défaut)
```

## Audio (`src/audio/Soundtrack.tsx`)

- Musique : `public/musique.mp3`, volume 0,15, fondu d'entrée 0,5 s, de sortie 1 s.
- Sons d'interface **optionnels** : déposer des fichiers dans `public/sfx/` (wav, mp3, ogg…).
  Un nom contenant `tick`, `key` ou `type` → frappe machine (un tick toutes les 4 frames au plus) ;
  un nom contenant `clic` ou `click` → arrivée des lignes de la spec card et allumage du ■.
  Un seul fichier sert aux deux usages. Volume 0,25. Détection automatique au rendu.
- Les calages viennent des mêmes repères que l'animation (`specCardCues`, `labelStarts`…) :
  toute retouche de timing reste synchronisée.
- La vidéo reste lisible sans le son : aucune information n'est portée par l'audio.

## Découpage

| Temps   | Scène   |
|---------|---------|
| 0–2 s   | Eyebrow + H1 (soulignement rouille) |
| 2–6 s   | Problème / « trois temps » |
| 6–11 s  | Spec card des 7 briques + conclusion en italique |
| 11–15 s | Promesse partenaire |
| 15–18 s | Labels mono |
| 18–20 s | `.Picky` + descripteur + CTA |

## Garde-fous de charte appliqués dans le code

- Pastilles produit (`src/components/ProductMark.tsx`) : reconstruction SVG de la charte §05
  (grille 64, carré 56 arrondi 6, « P » + lettre-clé Fraunces 30, point Signal r 4,5 ;
  PickyStudio inversé). Utilisées dans la spec card et en fond.
- Fond (`src/components/Background.tsx`) : voile diagonal 135° Ink → Marine ; trame de
  pastilles en **grille régulière et alignée, disposition ordonnée — jamais aléatoire** —
  même taille, même opacité (6 %), 2 pastilles au plus légèrement mises en avant (10 %),
  PickyStudio exclu ; filets de marge 1 px Paper 12 %.
- Fond Ink `#0B1220`, texte Paper `#F5F3EE` — jamais de `#FFFFFF`.
- Rouille `#C4491D` uniquement pour le soulignement d'un mot-clé (3 px, décalé de 5 px)
  et le point du logo. Pas de bouton plein, pas d'aplat.
- Une seule phrase en italique par bloc, la conclusion.
- Mono toujours en capitales, interlettrage 0,15–0,2 em. Aucune icône : `//`, `·`, `→`.
- Mouvement « console qui s'assemble » : mono tapé à la machine avec curseur (`Typed`),
  spec card qui se construit (onglet, lignes, pointillés tracés, marqueur ■ qui s'allume),
  pastilles qui s'assemblent (carré → P → lettre → point + une impulsion), titres en fente,
  soulignement rouille en wipe.
- Mouvement 0,15–0,4 s en `cubic-bezier(0.4, 0, 0.2, 1)`, sans rebond ni parallaxe.
- Texte confiné aux safe zones de chaque format (`src/brand/formats.ts`).
- Aucun prix ni chiffre de marge à l'écran ; vocabulaire interdit exclu (charte §11).
