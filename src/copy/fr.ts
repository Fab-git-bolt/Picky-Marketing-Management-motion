import { type Angle, type Brick, type Storyboard, l } from "./types";

/** Espace insécable avant « ? », « : », « ! » (typographie française). */
const nb = " ";

export const BRICKS_FR: Brick[] = [
  { code: "P-01", name: "PickyVoice", domain: "VOIX · TÉLÉPHONIE" },
  { code: "P-02", name: "PickyOrder", domain: "COMMANDES" },
  { code: "P-03", name: "PickyScan", domain: "GÉOCODES" },
  { code: "P-04", name: "PickyLex", domain: "DOCUMENTS · JURIDIQUE" },
  { code: "P-05", name: "PickyDesk", domain: "DOCUMENTS · PME" },
  { code: "P-06", name: "PickyPress", domain: "CONTENUS" },
  { code: "P-07", name: "PickyStudio", domain: "SUR MESURE" },
];

const EYEBROW = "// INFRASTRUCTURE IA · MARQUE BLANCHE";
const TAB = "SPEC · 7 BRIQUES";
const CONCLUSION = l(`Sept briques, une${nb}infrastructure.`, true);
const END = {
  descriptor: "Infrastructure IA en marque blanche",
  cta: "Devenez partenaire →",
  url: "partners.pickyllc.com",
};

export const COPY_FR: Record<Angle, Storyboard> = {
  "manque-a-gagner": {
    eyebrow: EYEBROW,
    hook: { runs: [{ text: "Vos clients veulent de " }, { text: "l’IA", underline: true }, { text: "." }] },
    problem: [
      l("Vous n’avez pas le studio pour la livrer."),
      l("Alors la vente vous échappe.", true),
    ],
    spec: {
      lead: l(`Et si vous disiez oui${nb}?`),
      tab: TAB,
      conclusion: CONCLUSION,
    },
    promise: [
      { runs: [{ text: "Votre marque", underline: true }, { text: "." }] },
      l("Votre marge."),
      l("Votre relation client."),
      l(`Nous restons dans${nb}l’ombre.`, true),
    ],
    labels: ["MARQUE BLANCHE", "PICKYAUDIT OFFERT", "MISE EN MARCHÉ"],
    end: END,
  },
  "revenu-sans-risque": {
    eyebrow: EYEBROW,
    hook: {
      runs: [{ text: "Vendez l’IA sous " }, { text: "votre marque", underline: true }, { text: "." }],
    },
    problem: [l("Sans studio."), l("Sans développeurs."), l("Sans infrastructure.")],
    spec: {
      tab: TAB,
      conclusion: CONCLUSION,
      followUp: l("Nous les construisons.\nVous les revendez."),
    },
    promise: [
      l("Signez le client."),
      l("On construit la plateforme."),
      { runs: [{ text: "Vous " }, { text: "encaissez", underline: true }, { text: "." }], italic: true },
    ],
    labels: ["MARQUE BLANCHE", "PICKYAUDIT OFFERT", "REVENU RÉCURRENT"],
    end: END,
  },
};
