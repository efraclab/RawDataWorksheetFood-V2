import type { DetectionConfig } from "../detection/config";

/** Test for coliform. Values from sheet "16" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const coliformMfCocaConfig: DetectionConfig = {
  key: "coliformMfCoca",
  moduleId: "micro.coliformMfCoca",
  persistenceType: "coliformMfCoca",
  title: "Coliform MF (SM-PR-681)",
  testName: "Test for coliform",
  media: "M-Endo medium, Brilliant green bile broth (BGB)",
  method: "SM-PR-681 (Coca Cola)",
  headerTextSteps: ["Volume of sample filtered"],
  resultTextSteps: ["Confirmed colony count"],
  sections: [
    {
      title: "Test for Coliform (count confirmed characteristic colonies on M-Endo medium)",
      rows: [
        { name: "M-Endo", characteristics: "Dark red with a green metallic surface sheen", media: "M-Endo", temp: "35±2", time: "24±2 hrs" },
      ],
    },
    {
      title: "Confirmation Test for Coliform (subculture all suspicious colonies from M-Endo medium)",
      rows: [
        { name: "BGB", characteristics: "Gas formation", media: "BGB", temp: "35±2", time: "48 hrs" },
      ],
    },
  ],
};
