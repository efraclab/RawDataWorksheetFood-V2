import type { DetectionConfig } from "../detection/config";

/** Isolation and Detection of E.coli. Values from sheet "18" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const eColiDetectionConfig: DetectionConfig = {
  key: "eColiDetection",
  moduleId: "micro.eColiDetection",
  persistenceType: "eColiDetection",
  title: "E. coli Detection (IS 5887)",
  testName: "Isolation and Detection of E.coli",
  media: "MA, EMB Agar, and Tergitol-7 Agar",
  method: "IS: 5887(Part 1):1976, RA 2018",
  sections: [
    {
      title: "Enrichment & Isolation",
      rows: [
        { name: "0.1 % Peptone Water", characteristics: "Initial suspension" },
        { name: "MacConkey Broth (SS)", characteristics: "Acid Production/Yellow color", temp: "37", time: "24 h" },
        { name: "MacConkey Broth (DS)", characteristics: "Acid Production/Yellow color", temp: "37", time: "24 h" },
        { name: "MacConkey Agar", characteristics: "Pink colony", temp: "37", time: "24 h" },
        { name: "EMB Agar", characteristics: "Metallic sheen", time: "24 h" },
        { name: "Tergitol-7 Agar", characteristics: "Yellow colony surrounded by yellow zone", temp: "37", time: "24 h" },
      ],
    },
    {
      title: "From the growth of MacConkey Broth",
      rows: [
        { name: "MacConkey Agar", characteristics: "Pink colony", temp: "37", time: "24 h" },
        { name: "EMB Agar", characteristics: "Metallic sheen", temp: "37", time: "24 h" },
        { name: "Tergitol-7 Agar", characteristics: "Yellow colony surrounded by yellow zone", temp: "37", time: "24 h" },
      ],
    },
    {
      title: "Biochemical Confirmation",
      rows: [
        { name: "Gram's staining", media: "Gram's staining reagent" },
        { name: "Motility", media: "Motility Agar", temp: "37", time: "24 hrs or 6 days at room Temp" },
        { name: "Test for H2S Production (TSI Agar)", media: "Triple sugar Iron agar Medium", temp: "37", time: "7 days" },
        { name: "Urease Production", media: "Urea Agar", temp: "37", time: "4 days" },
        { name: "Test for Indole", media: "Nutrient broth, Kovac's reagent", temp: "37", time: "48hrs" },
        { name: "MR Test", media: "Methyl red solution", temp: "37", time: "48hrs" },
        { name: "Voges-Proskauer Reaction", media: "VP Medium", temp: "37", time: "48hrs" },
        { name: "Citrate utilization", media: "Simmon's citrate Agar", temp: "37", time: "4 days" },
        { name: "1% Lactose fermentation", media: "Peptone water with Lactose", temp: "37", time: "18hrs" },
        { name: "1% Sucrose fermentation", media: "Peptone water with Sucrose", temp: "37", time: "18hrs" },
        { name: "1% Salicin fermentation", media: "Peptone water with Salicin", temp: "37", time: "18hrs" },
        { name: "Acid & Gas in MacConkey Broth", media: "MacConkey Broth", temp: "44", time: "48hrs" },
      ],
    },
  ],
};
