import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Vibrio. Values from sheet "32" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const vibrioConfig: DetectionConfig = {
  key: "vibrio",
  moduleId: "micro.vibrio",
  persistenceType: "vibrio",
  title: "Vibrio (APHA / FDA-BAM)",
  testName: "Isolation and Identification of Vibrio",
  media: "Alkaline Peptone Water, TCBS agar",
  method: "APHA 5th edition/ FDA-BAM Chapter 9:2004",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Homogenize with Alkaline Peptone Water" },
        { name: "Alkaline Peptone Water", temp: "37" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Nutrient Agar" },
        { name: "Test for Oxidase", media: "Oxidase reagent" },
        { name: "Gilatinase", media: "Gilatin agar", temp: "37", time: "4days" },
        { name: "Urease test", media: "TSI agar Medium", temp: "37", time: "24 hrs" },
        { name: "Growth in 1% tryptone broth", media: "Tryptone broth medium", temp: "37", time: "18 hrs" },
        { name: "H2S production, Black Butt in TSI", media: "TSI slant", temp: "37", time: "48 hrs" },
        { name: "Gas from glucose fermentation", media: "Glucose", temp: "37", time: "48 hrs" },
        { name: "Acid from Sucrose fermentation", media: "Sucrose", temp: "37", time: "48 hrs" },
        { name: "Acid from Lactosre fermentation", media: "Lactose", temp: "37", time: "48 hrs" },
        { name: "Fermentation of D- Mannitol", media: "Mannitol", temp: "37", time: "48 hrs" },
        { name: "Agglutination with Polyvalent antiserum", media: "Polyvalent Antiserum" },
        { name: "Dihydrolase & Decarboxylase activity (a) Lysine (b) Arginine (c) Ornithine", media: "Lysine", temp: "37", time: "4days" },
      ],
    },
  ],
};
