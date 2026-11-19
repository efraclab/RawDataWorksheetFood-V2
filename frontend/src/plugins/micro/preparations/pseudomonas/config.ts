import type { PlateCountConfig } from "../plateCount/config";

/** Enumeration of Pseudomonas spp.. Values from sheet "40" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const pseudomonasConfig: PlateCountConfig = {
  key: "pseudomonas",
  moduleId: "micro.pseudomonas",
  persistenceType: "pseudomonas",
  title: "Pseudomonas spp.",
  testName: "Enumeration of Pseudomonas spp.",
  media: "CFC Agar",
  method: "IS 14843:2017 / ISO 13720:2010",
  incubationTemp: "25",
  incubationTime: "48",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/gm",
  // Excel sums only the 48 h rows (D14:K15).
  timePoints: [
    { label: "24 h", counted: false },
    { label: "48 h", counted: true },
  ],
  confirmationTests: [
    { name: "Inoculation in Nutrient Agar Medium", media: "Nutrient Agar", temp: "25", time: "24" },
    { name: "Oxidase Reaction", media: "Oxidase Reagent" },
    { name: "Sugar fermentation", media: "Kligler's Agar", temp: "25", time: "24" },
  ],
};
