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
  components/ Headline (soulignement rouille), SpecCard, Wordmark, Mono/Eyebrow/Tag…
  scenes/     découpage temporel commun + les six scènes
  PickyAd.tsx composition paramétrable
  Root.tsx    une composition par angle × format
public/fonts/ Fraunces, Inter, JetBrains Mono (auto-hébergées, OFL-1.1)
```

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

- Fond (`src/components/Background.tsx`) : voile diagonal 135° Ink → Marine, trame mono
  `//` · `·` · `P-01…P-07` à 5 % de Paper en dérive lente (atténuée derrière le texte),
  filets de marge 1 px Paper 12 %. Aucune icône, image ni rouille.
- Fond Ink `#0B1220`, texte Paper `#F5F3EE` — jamais de `#FFFFFF`.
- Rouille `#C4491D` uniquement pour le soulignement d'un mot-clé (3 px, décalé de 5 px)
  et le point du logo. Pas de bouton plein, pas d'aplat.
- Une seule phrase en italique par bloc, la conclusion.
- Mono toujours en capitales, interlettrage 0,15–0,2 em. Aucune icône : `//`, `·`, `→`.
- Mouvement 0,15–0,4 s en `cubic-bezier(0.4, 0, 0.2, 1)`, sans rebond ni parallaxe.
- Texte confiné aux safe zones de chaque format (`src/brand/formats.ts`).
- Aucun prix ni chiffre de marge à l'écran ; vocabulaire interdit exclu (charte §11).
