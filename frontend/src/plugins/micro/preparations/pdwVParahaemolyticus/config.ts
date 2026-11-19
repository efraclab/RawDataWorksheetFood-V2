import type { DetectionConfig } from "../detection/config";

/**
 * Vibrio parahaemolyticus/250 ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/24 hrs
 */
export const pdwVParahaemolyticusConfig: DetectionConfig = {
  key: "pdwVParahaemolyticus",
  moduleId: "micro.pdwVParahaemolyticus",
  persistenceType: "pdwVParahaemolyticus",
  title: "PDW V. parahaemolyticus/250 ml (IS 5887-5)",
  testName: "Vibrio parahaemolyticus/250 ml (Packaged Drinking Water)",
  media: "Glucose Salt Teepol Broth, TCBS Agar",
  method: "IS 5887(Part 5): 1976 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/24 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Growth in Glucose Salt Teepol Broth", characteristics: "Growth or turbidity" },
        { name: "TCBS Agar", characteristics: "Round, 2-3 mm in diameter with green centre" },
      ],
    },
    {
      title: "Biochemical Confirmation (select at least 5 suspected colonies)",
      rows: [
        { name: "Gram Staining", media: "Nutrient Agar" },
        { name: "Motility", media: "Nutrient Agar with 3% NaCl", temp: "37", time: "4 days" },
        { name: "Test For Oxidase", media: "Oxidase Reagent" },
        { name: "Hugh-Leifson's Test", media: "Hugh-Leifson's Test medium with 3% NaCl", temp: "37", time: "4 days" },
        { name: "H2S Production", media: "TSI agar Medium with 3% NaCl", temp: "37", time: "24 hrs" },
        { name: "Growth in Tryptone Broth", media: "Tryptone Broth Medium", temp: "42", time: "24 hrs" },
        { name: "Growth in 1% Tryptone Broth with 8% NaCl", media: "Tryptone broth with 8% NaCl", temp: "37", time: "24 hrs" },
        { name: "Growth in 1% Tryptone Broth with 10% NaCl", media: "Tryptone broth with 10% NaCl", temp: "37", time: "24 hrs" },
        { name: "Growth in 1% Tryptone Broth without NaCl", media: "Tryptone broth without NaCl", temp: "37", time: "24 hrs" },
        { name: "Fermentation of 1% Sucrose", media: "Sucrose with 3% NaCl", temp: "37", time: "5 days" },
        { name: "Fermentation of 1% Mannitol", media: "Mannitol with 3% NaCl", temp: "37", time: "5 days" },
        { name: "Lysine", media: "Lysine with 3% NaCl", temp: "37", time: "4 days" },
        { name: "Arginine", media: "Arginine with 3% NaCl", temp: "37", time: "4 days" },
        { name: "Ornithine", media: "Ornithine with 3% NaCl", temp: "37", time: "4 days" },
      ],
    },
  ],
};
