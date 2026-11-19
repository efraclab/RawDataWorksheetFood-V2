import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Staphylococcus aureus. Values from sheet "23" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const sAureusDetectionConfig: DetectionConfig = {
  key: "sAureusDetection",
  moduleId: "micro.sAureusDetection",
  persistenceType: "sAureusDetection",
  title: "S. aureus Detection (IS 5887)",
  testName: "Isolation and Detection of Staphylococcus aureus",
  media: "Salt Medium, Baird Parker Agar, Blood Agar, and Nutrient Agar",
  method: "IS:5887 Part-2:1976 RA 2013",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Salt Medium", characteristics: "Turbidity", temp: "37", time: "24 h" },
        { name: "Baird Parker Agar", characteristics: "Shiny Black Colonies", temp: "37", time: "30 h" },
        { name: "Blood Agar", characteristics: "Yellow Colonies", temp: "37", time: "24 h" },
      ],
    },
    {
      title: "From the growth of Salt Medium",
      rows: [
        { name: "Baird Parker Agar", characteristics: "Shiny Black Colonies", temp: "37", time: "30 h" },
        { name: "Blood Agar", characteristics: "Yellow Colonies", temp: "37", time: "24 h" },
        { name: "Nutrient Agar", characteristics: "Yellow Colonies", temp: "37", time: "24 h" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's Staining", media: "Gram Staining Reagent" },
        { name: "Coagulase", media: "Rabbit Plasma", temp: "37", time: "4-6 h" },
      ],
    },
  ],
};
