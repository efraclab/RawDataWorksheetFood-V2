import type { DetectionConfig } from "../detection/config";

/** Isolation and Identification of Vibrio parahaemolyticus. Values from sheet "34" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const vParahaemolyticusConfig: DetectionConfig = {
  key: "vParahaemolyticus",
  moduleId: "micro.vParahaemolyticus",
  persistenceType: "vParahaemolyticus",
  title: "V. parahaemolyticus (IS 5887)",
  testName: "Isolation and Identification of Vibrio parahaemolyticus",
  media: "Glucose salt Teepol broth (GSTB), Thiosulphate –Citrate –Bile salt- Sucrose Agar (TCBS).",
  method: "IS: 5887(Part V):1976, RA 2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "Homogenize with GSTB", time: "24 hrs" },
        { name: "TCBS Agar", characteristics: "Green or blue centered colony" },
        { name: "For Detection" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining" },
        { name: "Motility" },
        { name: "Test for Oxidase" },
        { name: "Test for Catalase" },
        { name: "Hugh- Leifson's Test" },
        { name: "H2S Production" },
        { name: "Growth in tryptone broth" },
        { name: "Growth in 1% tryptone broth with 8% NaCl" },
        { name: "Growth in 1% tryptone broth with 10% NaCl" },
        { name: "Growth in 1% tryptone broth without NaCl" },
        { name: "Test for voges-proskauer" },
        { name: "Fermentation of 1% Sucrose" },
        { name: "Fermentation of 1% Mannitol" },
        { name: "Dihydrolase & Decarboxylase activity (a) Lysine (b) Arginine ( c ) Ornithine" },
      ],
    },
  ],
};
