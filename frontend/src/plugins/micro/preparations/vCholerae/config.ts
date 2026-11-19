import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Vibrio cholera. Values from sheet "35" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const vCholeraeConfig: DetectionConfig = {
  key: "vCholerae",
  moduleId: "micro.vCholerae",
  persistenceType: "vCholerae",
  title: "V. cholerae (IS 5887)",
  testName: "Isolation and Identification of Vibrio cholera",
  media: "Alkaline Peptone Water, Bile Salt Agar, Thiosulphate –Citrate –Bile salt- Sucrose Agar (TCBS).",
  method: "IS 5887(Part V):1976, RA 2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Alkaline Peptone Water", characteristics: "Turbidity", temp: "37" },
        { name: "TCBS Agar", characteristics: "Yellow colony with entire Round margins", temp: "37", time: "18 hrs" },
        { name: "Bile Salt Agar", characteristics: "Smooth colony", temp: "37", time: "18 hrs" },
      ],
    },
    {
      title: "After enrichment with Alkaline Peptone Water",
      rows: [
        { name: "TCBS Agar", characteristics: "Yellow colony with entire Round margins", temp: "37", time: "18 hrs" },
        { name: "Bile Salt Agar", characteristics: "Distinctive colony", temp: "37", time: "18 hrs" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Gram Staining Reagent" },
        { name: "Motility", media: "Motility Agar", temp: "37", time: "24 h or 4 to 6 days at room temp" },
        { name: "Test for Oxidase", media: "Oxidase reagent", temp: "-" },
        { name: "Test for Catalase", media: "Hydrogen Peroxide", temp: "-" },
        { name: "Hugh- Leifson's Test", media: "Hugh- Leifson's Test medium", temp: "37", time: "4days" },
        { name: "H2S Production", media: "TSI agar Medium", temp: "37", time: "24 hrs" },
        { name: "Growth in tryptone broth", media: "Tryptone broth medium", temp: "37", time: "18 hrs" },
        { name: "Fermentation of 1% Glucose", media: "Glucose", temp: "37", time: "48 hrs" },
        { name: "Fermentation of 1% Inositol", media: "Inositol", temp: "37", time: "48 hrs" },
        { name: "Fermentation of 1% Mannitol", media: "Mannitol", temp: "37", time: "48 hrs" },
        { name: "Agglutination with Polyvalent antiserum", media: "Polyvalent Antiserum", temp: "-" },
        { name: "Dihydrolase & Decarboxylase activity (a) Lysine (b) Arginine (c) Ornithine", media: "Lysine", temp: "37", time: "4 days" },
      ],
    },
  ],
};
