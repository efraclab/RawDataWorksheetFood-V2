import type { DetectionConfig } from "../detection/config";

/**
 * Pseudomonas aeruginosa/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/48 hrs, 42 °C/24 hrs
 */
export const pdwPseudomonasConfig: DetectionConfig = {
  key: "pdwPseudomonas",
  moduleId: "micro.pdwPseudomonas",
  persistenceType: "pdwPseudomonas",
  title: "PDW P. aeruginosa/250 ml (IS 13428 D)",
  testName: "Pseudomonas aeruginosa/250 ml (Packaged Drinking Water)",
  media: "Presumptive Culture Medium, Milk Agar",
  method: "IS 13428:2020 (Amd. 7) Annex D",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/48 hrs, 42 °C/24 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Presumptive Culture Medium", characteristics: "Turbidity with fluorescence under UV lamp" },
        { name: "Milk Agar", characteristics: "Green pigment / casein hydrolysis" },
      ],
    },
  ],
};
