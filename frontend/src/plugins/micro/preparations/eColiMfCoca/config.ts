import type { DetectionConfig } from "../detection/config";

/** Test for E.coli. Values from sheet "17" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const eColiMfCocaConfig: DetectionConfig = {
  key: "eColiMfCoca",
  moduleId: "micro.eColiMfCoca",
  persistenceType: "eColiMfCoca",
  title: "E. coli MF, M-Endo (SM-PR-681)",
  testName: "Test for E.coli",
  media: "M-Endo medium, Brilliant green bile broth (BGB)",
  method: "SM-PR-681 (Coca Cola)",
  headerTextSteps: ["Volume of sample filtered"],
  resultTextSteps: ["Confirmed colony count"],
  sections: [
    {
      title: "Test for E.coli (count confirmed characteristic colonies on M-Endo medium)",
      rows: [
        { name: "M-Endo", characteristics: "Dark red with a green metallic surface sheen", media: "M-Endo", temp: "35±2", time: "24±2 hrs" },
      ],
    },
    {
      title: "Confirmation Test for E.coli (subculture all suspicious colonies from M-Endo medium)",
      rows: [
        { name: "BGB", characteristics: "Gas formation", media: "BGB", temp: "35±2", time: "48 hrs" },
      ],
    },
  ],
};
