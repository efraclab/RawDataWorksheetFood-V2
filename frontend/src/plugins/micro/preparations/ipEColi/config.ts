import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of E.coli. Values from sheet "87" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipEColiConfig: DetectionConfig = {
  key: "ipEColi",
  moduleId: "micro.ipEColi",
  persistenceType: "ipEColi",
  title: "E. coli Detection (IP)",
  testName: "Isolation and Detection of E.coli",
  media: "Soya bean Casein Digest Broth (SCDB), MacConkey Broth, , MacConkey Agar",
  method: "IP-2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium", characteristics: "Turbidity", temp: "35", time: "24h" },
        { name: "Inoculation in MacConkey Broth( from Incubated SCDB)", characteristics: "Turbidity with Acid Production", temp: "42-44", time: "24-48h" },
        { name: "Inoculation in MacConkey Agar ( from Incubated MacConkey Broth)", characteristics: "Pink non-mucoid Colony", temp: "35", time: "18-72h" },
      ],
    },
    {
      title: "From the growth of MacConkey Agar",
      rows: [
        { name: "EMB Agar", characteristics: "Metallic sheen", temp: "37", time: "24h" },
        { name: "Gram's staining" },
        { name: "Test for Indole", temp: "35", time: "24-48h" },
        { name: "MR Test", temp: "35", time: "24-48h" },
        { name: "Voges-Proskauer Reaction", temp: "35", time: "24-48h" },
        { name: "Citrate utilization", temp: "35", time: "24-48h" },
      ],
    },
  ],
};
