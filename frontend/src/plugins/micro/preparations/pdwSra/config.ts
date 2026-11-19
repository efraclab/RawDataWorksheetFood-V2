import type { DetectionConfig } from "../detection/config";

/**
 * Sulphite Reducing Anaerobes/50 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/48 hrs
 */
export const pdwSraConfig: DetectionConfig = {
  key: "pdwSra",
  moduleId: "micro.pdwSra",
  persistenceType: "pdwSra",
  title: "PDW Sulphite Reducing Anaerobes/50 ml (IS 13428 C)",
  testName: "Sulphite Reducing Anaerobes/50 ml (Packaged Drinking Water)",
  media: "Differential Reinforced Clostridial Medium (DRCM)",
  method: "IS 13428:2020 (Amd. 7) Annex C",
  resultPer: "50 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/48 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "24 hrs", media: "DRCM", temp: "37", time: "24 hrs" },
        { name: "48 hrs", media: "DRCM", temp: "37", time: "48 hrs" },
      ],
    },
  ],
};
