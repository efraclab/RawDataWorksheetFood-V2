import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of Salmonella. Values from sheet "27" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const salmonellaIsoConfig: DetectionConfig = {
  key: "salmonellaIso",
  moduleId: "micro.salmonellaIso",
  persistenceType: "salmonellaIso",
  title: "Salmonella (ISO 6579-1)",
  testName: "Isolation and Detection of Salmonella",
  media: "Modified Rappaport Vassiliadis Medium with soya (MRVS), Brilliant Green Phenol Red Lactose Agar (BGPRLA), Xylose Lysine Deoxycholate Agar (XLDA).",
  method: "ISO-6579-1:2017",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Buffered Peptone Water", characteristics: "Turbidity", temp: "37 ±1", time: "18±2 Hrs" },
        { name: "MRVS Medium", characteristics: "Turbidity", temp: "41.5 ±1", time: "24±3 Hrs" },
        { name: "MKTTn", characteristics: "Turbidity", temp: "37 ±1", time: "24±3 Hrs" },
        { name: "XLDA (from MRVS)", characteristics: "Black centered colonies with light transparent zone of reddish colour", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "XLDA (from MKTTn)", characteristics: "Black centered colonies with light transparent zone of reddish colour", temp: "37 ± 1", time: "24 Hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Lactose/Glucose/ sucrose fermentation,H2S Production (TSI Agar)", media: "Triple sugar Iron agar Medium", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "Urease Production", media: "Urea Agar", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "L-Lysine decarboxylase", media: "L-Lysine Decarboxylation Medium, Kovac's reagent", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "β- galactosidase detection", media: "β- galactosidase reagent", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "Voges-Proskauer Reaction", media: "MRVP Medium", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "Indole production", media: "Tryptone broth, Kovac's reagent", temp: "37 ± 1", time: "24±3 Hrs" },
        { name: "Examination for O-Antigen", media: "Anti O-Serum" },
        { name: "Examination for H-Antigen", media: "Anti H-Serum" },
        { name: "Examination for Vi-Antigen", media: "Anti Vi-Serum" },
      ],
    },
  ],
};
