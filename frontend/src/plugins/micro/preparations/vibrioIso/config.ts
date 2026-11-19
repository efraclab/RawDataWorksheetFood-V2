import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Vibrio cholera and Vibrio parahaemolyticus. Values from sheet "33" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const vibrioIsoConfig: DetectionConfig = {
  key: "vibrioIso",
  moduleId: "micro.vibrioIso",
  persistenceType: "vibrioIso",
  title: "V. cholerae & V. parahaemolyticus (ISO 21872)",
  testName: "Isolation and Identification of Vibrio cholera and Vibrio parahaemolyticus",
  media: "Alkaline Peptone Water, Bile Salt Agar, Thiosulphate –Citrate –Bile salt- Sucrose Agar (TCBS), CPC agar.",
  method: "ISO 21872(P-1): 2007",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Alkaline saline Peptone Water (ASPW) (Primary enrichment)", characteristics: "Turbidity", temp: "37/41.5", time: "6 h ± 1 hrs" },
        { name: "Alkaline saline Peptone Water (ASPW) (Secondary enrichment)", characteristics: "Turbidity", temp: "41.5", time: "18 ± 1 hr." },
        { name: "TCBS Agar (from primary enrichment)", characteristics: "2 to 3 mm diameter Smooth, green colonies /", temp: "37", time: "24 ± 3 hrs" },
        { name: "CPC Agar (from primary enrichment)", characteristics: "Green purple colonies", temp: "37", time: "24 ± 3 hrs" },
        { name: "TCBS Agar (from Secondary enrichment)", characteristics: "2 to 3 mm diameter Smooth, green colonies /", temp: "37", time: "24 ± 3 hrs" },
        { name: "CPC Agar (from Secondary enrichment)", characteristics: "Green purple colonies", temp: "37", time: "24 ± 3 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Nutrient Agar" },
        { name: "Test for Oxidase", media: "Oxidase reagent" },
        { name: "Motility Test", media: "ASPW" },
        { name: "Indole test", media: "Tryptone medium" },
        { name: "Β-galactosidase detection test", media: "Saline solution" },
        { name: "H2S production, Black Butt in TSI*", media: "TSI slant" },
        { name: "Gas from glucose fermentation", media: "Glucose" },
        { name: "Acid from Sucrose fermentation", media: "Sucrose" },
        { name: "Acid from Lactose fermentation", media: "Lactose" },
        { name: "Growth in peptone water" },
        { name: "Growth in peptone water with 0% NaCl", temp: "37" },
        { name: "Growth in peptone water with 2% NaCl" },
        { name: "Growth in peptone water with 6% NaCl", media: "Peptone Water" },
        { name: "Growth in peptone water with 8% NaCl" },
        { name: "Growth in peptone water with 10% NaCl" },
        { name: "Dihydrolase & Decarboxylase activity (a) Lysine (b) Arginine (c) Ornithine", media: "Lysine" },
      ],
    },
  ],
};
