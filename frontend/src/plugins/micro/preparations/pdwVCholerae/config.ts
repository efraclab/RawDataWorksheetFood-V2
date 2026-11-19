import type { DetectionConfig } from "../detection/config";

/**
 * Vibrio cholerae/250ml (Packaged Drinking Water). Values from sheet "47" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx.
 * Incubation on the sheet: 37 °C/24 hrs
 */
export const pdwVCholeraeConfig: DetectionConfig = {
  key: "pdwVCholerae",
  moduleId: "micro.pdwVCholerae",
  persistenceType: "pdwVCholerae",
  title: "PDW V. cholerae/250 ml (IS 5887-5)",
  testName: "Vibrio cholerae/250ml (Packaged Drinking Water)",
  media: "Alkaline Peptone Water, TCBS Agar, Bile Salt Agar",
  method: "IS 5887(Part 5): 1976 RA 2018",
  resultPer: "250 ml",
  headerTextSteps: [{ name: "Incubation Temp/Time", value: "37 °C/24 hrs" }],
  sections: [
    {
      title: "Observation",
      rows: [
        { name: "Alkaline Peptone Water", characteristics: "Growth or turbidity" },
        { name: "TCBS Agar", characteristics: "Yellow colonies with round margin" },
        { name: "Bile Salt Agar", characteristics: "Distinctive colony" },
      ],
    },
    {
      title: "After enrichment in Alkaline Peptone Water",
      rows: [
        { name: "TCBS Agar", characteristics: "Yellow colonies with round margin" },
        { name: "Bile Salt Agar", characteristics: "Distinctive colony" },
      ],
    },
    {
      title: "Biochemical Confirmation (select at least 5 suspected colonies)",
      rows: [
        { name: "Gram Staining", media: "Nutrient Agar" },
        { name: "Motility", media: "Nutrient Agar", temp: "37", time: "24 h or 4 to 6 days at room temp" },
        { name: "Test For Catalase", media: "Hydrogen Peroxide" },
        { name: "Test For Oxidase", media: "Oxidase Reagent" },
        { name: "Hugh-Leifson's Test", media: "Hugh-Leifson's Test Medium", temp: "37", time: "4 days" },
        { name: "H2S Production", media: "Triple sugar agar Medium", temp: "37", time: "24 hrs" },
        { name: "Growth in Tryptone Broth", media: "Tryptone Broth Medium", temp: "37", time: "18 hrs" },
        { name: "Fermentation of 1% Glucose", media: "Glucose", temp: "37", time: "48 hrs" },
        { name: "Fermentation of 1% Inositol", media: "Inositol", temp: "37", time: "48 hrs" },
        { name: "Fermentation of 1% Mannitol", media: "Mannitol", temp: "37", time: "48 hrs" },
        { name: "Lysine", media: "L-Lysine Decarboxylase Medium", temp: "37", time: "4 days" },
        { name: "Arginine", media: "Arginine Dihydrolase Medium", temp: "37", time: "4 days" },
        { name: "Ornithine", media: "Decarboxylase Medium", temp: "37", time: "4 days" },
        { name: "Agglutination with Polyvalent Antiserum", media: "Polyvalent Antiserum" },
      ],
    },
  ],
};
