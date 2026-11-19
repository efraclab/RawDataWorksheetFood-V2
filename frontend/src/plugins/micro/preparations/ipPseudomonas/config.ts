import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Pseudomonas aeruginosa. Values from sheet "89" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipPseudomonasConfig: DetectionConfig = {
  key: "ipPseudomonas",
  moduleId: "micro.ipPseudomonas",
  persistenceType: "ipPseudomonas",
  title: "P. aeruginosa Detection (IP)",
  testName: "Isolation and Detection of Pseudomonas aeruginosa",
  media: "Soya bean Casein Digest Broth (SCDB), Cetrimide Agar",
  method: "IP-2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium", characteristics: "Turbidity", temp: "35", time: "24h" },
        { name: "Inoculation in (Cetrimide Agar (from Incubated SCDB)", characteristics: "Pigmented Colony", temp: "30-35", time: "18-72h" },
      ],
    },
    {
      title: "From the growth of Cetrimide Agar the following Identification Tests to be analyzed",
      rows: [
        { name: "Gram Staining" },
        { name: "Oxidase Test" },
        { name: "Growth in DL-Asparagine & L-proline Broth", time: "48 hr" },
      ],
    },
  ],
};
