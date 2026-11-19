import type { DetectionConfig } from "../detection/config";

/** Detection of Salmonella. Values from sheet "74" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushSalmonellaConfig: DetectionConfig = {
  key: "ayushSalmonella",
  moduleId: "micro.ayushSalmonella",
  persistenceType: "ayushSalmonella",
  title: "Salmonella Detection (AYUSH)",
  testName: "Detection of Salmonella",
  media: "Nutrient Broth (NB), Selenite F broth (SFB), Tetrathionate-Bile –Brilliant Green Broth (TTBBG)",
  method: "Ayurvedic Pharmacopoeia of India",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Inoculation in NB", characteristics: "Turbidity", temp: "35-37", time: "24h" },
        { name: "Inoculation in SFB ( from Enriched NB )", characteristics: "Turbidity", temp: "36-38", time: "48h" },
        { name: "Inoculation in TTBBG ( from Enriched NB )", characteristics: "Turbidity", temp: "36-38", time: "48h" },
        { name: "Inoculation in XLDA ( from Incubated SFB & TTBBG Medium)", characteristics: "Red Colonies with or without Black Center", temp: "36-38", time: "18h-24h" },
        { name: "Inoculation in BSA ( from Incubated SFB & TTBBG Medium)", characteristics: "Black colony", temp: "36-38", time: "18h-24h" },
        { name: "Inoculation in BGA ( from Incubated SFB & TTBBG Medium)", characteristics: "Transparent colorless or Opaque, Pinkish or White colony (Frequently surrounded by a pink or red zone)", temp: "36-38", time: "18h-24h" },
        { name: "Inoculation in DCA ( from Incubated SFB & TTBBG Medium", characteristics: "Colorless & opaque, with or without black centre", temp: "36-38", time: "18h-24h" },
      ],
    },
    {
      title: "Biochemical Test",
      rows: [
        { name: "Gram's staining" },
        { name: "Lactose/Glucose/ sucrose fermentation,H2S Production (TSI Agar)", time: "18h-24h" },
        { name: "Urease test", time: "18h-24h" },
        { name: "Examination for H-Antigen agglutination" },
      ],
    },
  ],
};
