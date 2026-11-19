import type { DetectionConfig } from "../detection/config";

/**
 * Coliform Bacteria/250ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 36±2 °C for 21±3 hrs
 */
export const pdwColiformConfig: DetectionConfig = {
  key: "pdwColiform",
  moduleId: "micro.pdwColiform",
  persistenceType: "pdwColiform",
  title: "PDW Coliform/250 ml (IS 15185)",
  testName: "Coliform Bacteria/250ml (Packaged Drinking Water)",
  media: "Chromogenic Coliform Agar",
  method: "IS 15185:2016/ISO 9308-1:2014",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "36±2 °C for 21±3 hrs" }],
  resultTextSteps: ["Colony count"],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Growth on Chromogenic Coliform Agar", characteristics: "Pink to red colonies", media: "Chromogenic Coliform Agar", temp: "36±2", time: "21±3 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation (subculture preferably all or at least 10 pink to red colonies in Tryptone soy agar, 36±2 °C for 21±3 hrs)",
      rows: [
        { name: "Oxidase", media: "Oxidase Reagent" },
      ],
    },
  ],
};
