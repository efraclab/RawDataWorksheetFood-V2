import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Salmonella. Values from sheet "88" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipSalmonellaConfig: DetectionConfig = {
  key: "ipSalmonella",
  moduleId: "micro.ipSalmonella",
  persistenceType: "ipSalmonella",
  title: "Salmonella Detection (IP)",
  testName: "Isolation and Detection of Salmonella",
  media: "Soya bean Casein Digest Broth (SCDB), Rappaport Vassiliadis Salmonella Enrichment Broth (RV Medium), Xylose Lysine Deoxycholate Agar (XLD Agar).",
  method: "IP-2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in Soya bean Casein Digest Medium", characteristics: "Turbidity", temp: "35", time: "24h" },
        { name: "Inoculation in RV Medium( from Incubated SCDB)", characteristics: "Turbidity", temp: "30-35", time: "24-48h" },
        { name: "Inoculation in XLD Agar ( from Incubated RV Medium)", characteristics: "Red Colonies with or without Black Center", temp: "30-35", time: "24-48h" },
      ],
    },
    {
      title: "From the growth of XLD Agar colonies were inoculated in Nutrient Agar Slant for Identification Tests",
      rows: [
        { name: "Gram's staining" },
        { name: "Lactose/Glucose/ sucrose fermentation,H2S Production (TSI Agar)", time: "24h" },
        { name: "Urease test", time: "24h" },
      ],
    },
  ],
};
