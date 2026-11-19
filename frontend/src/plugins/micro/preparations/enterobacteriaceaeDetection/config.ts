import type { DetectionConfig } from "../detection/config";

/** Detection of Enterobacteriaceae. Values from sheet "46" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const enterobacteriaceaeDetectionConfig: DetectionConfig = {
  key: "enterobacteriaceaeDetection",
  moduleId: "micro.enterobacteriaceaeDetection",
  persistenceType: "enterobacteriaceaeDetection",
  title: "Enterobacteriaceae Detection (ISO 21528)",
  testName: "Detection of Enterobacteriaceae",
  media: "VRBG Agar",
  method: "ISO 21528(P-1): 2004",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Buffered Peptone Water", characteristics: "Turbidity", temp: "37", time: "18 ±2 hrs" },
        { name: "EE Broth", characteristics: "Turbidity", temp: "37", time: "24 ±2 hrs" },
        { name: "VRBG", characteristics: "Purple-red colonies with a zone of bile acids precipitation", temp: "37", time: "24 ±2 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Oxidase test" },
        { name: "Fermentation test", temp: "37", time: "24 ±2 hrs" },
      ],
    },
  ],
};
