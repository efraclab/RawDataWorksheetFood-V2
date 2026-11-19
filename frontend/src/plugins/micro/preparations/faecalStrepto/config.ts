import type { PlateCountConfig } from "../plateCount/config";

/** Isolation and Enumeration of Faecal Streptococci. Values come from the "Faecal strepto" sheet. */
export const faecalStreptoConfig: PlateCountConfig = {
  key: "faecalStrepto",
  moduleId: "micro.faecalStrepto",
  persistenceType: "faecalStrepto",
  title: "Faecal Streptococci",
  testName: "Isolation and Enumeration of Faecal Streptococci by Plate Count Method",
  media: "",
  method: "",
  incubationTemp: "30",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  inoculationLabel: "Inoculation Volume for Spread Plate (ml)",
  extraTextSteps: [{ name: "Positive Control", value: "Pink Centered Colonies" }],
  confirmationTests: [
    { name: "Gram Staining", media: "Gram staining reagent" },
    {
      name: "Inoculation on MacConkey Agar",
      colony: "Typical small pink colonies",
      media: "MacConkey Agar",
      temp: "44",
      time: "24 h",
    },
  ],
};