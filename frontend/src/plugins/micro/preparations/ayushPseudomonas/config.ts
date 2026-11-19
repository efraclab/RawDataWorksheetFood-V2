import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Pseudomonas aeruginosa. Values from sheet "75" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushPseudomonasConfig: DetectionConfig = {
  key: "ayushPseudomonas",
  moduleId: "micro.ayushPseudomonas",
  persistenceType: "ayushPseudomonas",
  title: "P. aeruginosa Detection (AYUSH)",
  testName: "Isolation and Detection of Pseudomonas aeruginosa",
  media: "Soya bean Casein Digest Broth (SCDB), Cetrimide Agar",
  method: "Ayurvedic Pharmacopoeia of India",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium", characteristics: "Turbidity", temp: "35-37" },
        { name: "Inoculation in Cetrimide Agar (from Incubated SCDB)", characteristics: "Greenish Pigmented Colony", temp: "35-37" },
      ],
    },
    {
      title: "From the growth of Cetrimide Agar the following Identification Tests were performed",
      rows: [
        { name: "Gram Staining" },
        { name: "Oxidase Test" },
        { name: "Inoculated in Pseudomonas agar for detection of fluorescein" },
        { name: "Inoculated in Pseudomonas agar for detection of Pyocyanin" },
      ],
    },
  ],
};
