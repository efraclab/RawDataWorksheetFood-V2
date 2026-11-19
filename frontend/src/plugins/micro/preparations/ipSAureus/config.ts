import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Staphylococcus aureus. Values from sheet "90" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipSAureusConfig: DetectionConfig = {
  key: "ipSAureus",
  moduleId: "micro.ipSAureus",
  persistenceType: "ipSAureus",
  title: "S. aureus Detection (IP)",
  testName: "Isolation and Detection of Staphylococcus aureus",
  media: "Soya bean Casein Digest Broth (SCDB), Mannitol Salt Agar",
  method: "IP-2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium", characteristics: "Turbidity", temp: "35", time: "24h" },
        { name: "Inoculation in Mannitol Salt Agar (from Incubated SCDB)", characteristics: "Yellow/White Colony surrounded by yellow Zone", temp: "30-35", time: "18-72h" },
      ],
    },
    {
      title: "From the growth of Mannitol Agar colonies were inoculated in Brain Heart Infusion Broth for Identification Tests",
      rows: [
        { name: "Growth in Brain Heart Infusion Broth" },
        { name: "Gram Staining" },
        { name: "Coagulase Test" },
        { name: "Catalase Test" },
      ],
    },
  ],
};
