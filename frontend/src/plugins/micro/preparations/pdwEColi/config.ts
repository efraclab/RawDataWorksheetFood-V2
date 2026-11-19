import type { DetectionConfig } from "../detection/config";

/**
 * E.coli/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 36±2 °C for 21±3 hrs
 */
export const pdwEColiConfig: DetectionConfig = {
  key: "pdwEColi",
  moduleId: "micro.pdwEColi",
  persistenceType: "pdwEColi",
  title: "PDW E. coli/250 ml (IS 15185)",
  testName: "E.coli/250 ml (Packaged Drinking Water)",
  media: "Chromogenic Coliform Agar",
  method: "IS 15185:2016/ISO 9308-1:2014",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "36±2 °C for 21±3 hrs" }],
  resultTextSteps: ["Colony count"],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Growth on Chromogenic Coliform Agar", characteristics: "Dark blue to violet colonies", media: "Chromogenic Coliform Agar", temp: "36±2", time: "21±3 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation (subculture preferably all or at least 10 dark blue to violet colonies in Tryptone soy agar and Tryptophan broth)",
      rows: [
        { name: "Indole Production", media: "Kovac's Reagent" },
      ],
    },
  ],
};
