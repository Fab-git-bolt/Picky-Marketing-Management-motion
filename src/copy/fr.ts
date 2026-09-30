import { type Angle, type Storyboard, l } from "./types";

/** Espace insécable avant « ? », « : », « ! » (typographie française). */
const nb = " ";

const EYEBROW = "// INFRASTRUCTURE IA · MARQUE BLANCHE";
const TAB = "SPEC · 7 BRIQUES";
const STATUS = { key: "// STATUT", value: "DISPONIBLE SOUS VOTRE MARQUE" };
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
      status: STATUS,
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
      status: STATUS,
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
