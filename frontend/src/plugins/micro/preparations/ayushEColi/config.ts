import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of E.coli. Values from sheet "73" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushEColiConfig: DetectionConfig = {
  key: "ayushEColi",
  moduleId: "micro.ayushEColi",
  persistenceType: "ayushEColi",
  title: "E. coli Detection (AYUSH)",
  testName: "Isolation and Detection of E.coli",
  media: "Lactose broth, Nutrient Broth, MacConkey Broth, Peptone Water",
  method: "Ayurvedic Pharmacopoeia of India",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Nutrient Broth", characteristics: "Turbidity", temp: "37", time: "18h-24h" },
        { name: "Inoculation in MacConkey Broth( from Incubated NB)", characteristics: "Acid & gas Production", temp: "36-38", time: "48h" },
        { name: "Inoculation in MacConkey Broth( from Incubated MacConkey Broth)", characteristics: "Acid & gas Production", temp: "43.5 -44.5", time: "24h" },
        { name: "Inoculation in Peptone Water for Indole Test ( from Incubated NB)", characteristics: "Cherry red color ring formation", temp: "43.5 -44.5", time: "24h" },
      ],
    },
  ],
};
