import type { PlateCountConfig } from "../plateCount/config";

/** Enumeration of E. coli. Values come from the "E. coli" sheet. */
export const eColiConfig: PlateCountConfig = {
  key: "eColi",
  moduleId: "micro.eColi",
  persistenceType: "eColi",
  title: "E. coli",
  testName: "Enumeration of E. coli by Plate Count Method",
  media: "",
  method: "",
  incubationTemp: "37",
  incubationTime: "24",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  inoculationLabel: "Inoculation Volume for Spread Plate (ml)",
  extraTextSteps: ["Plate Size"],
  confirmationTests: [
    { name: "Gram’s staining", media: "Gram’s staining reagent" },
    { name: "Motility", media: "Nutrient Agar", temp: "37", time: "24 hrs or 6 days" },
    { name: "Test for H2S Production (TSI Agar)", media: "Triple sugar Iron agar Medium", temp: "37", time: "7 days" },
    { name: "Urease Production", media: "Urea Agar", temp: "37", time: "4 days" },
    { name: "Test for Indole", media: "Tryptone broth, Kovac’s reagent", temp: "37", time: "48hrs" },
    { name: "MR Test", media: "Methyl red solution", temp: "37", time: "48hrs" },
    { name: "Voges-Proskauer Reaction", media: "VP Medium", temp: "37", time: "48hrs" },
    { name: "Citrate utilization", media: "Simmon’s citrate Agar", temp: "37", time: "4 days" },
    { name: "1% Lactose fermentation", media: "Fermentation broth with Lactose", temp: "37", time: "18hrs" },
    { name: "1% Sucrose fermentation", media: "Fermentation broth with Sucrose", temp: "37", time: "18hrs" },
    { name: "1% Salicin fermentation", media: "Fermentation broth with Salicin", temp: "37", time: "18hrs" },
    { name: "Acid & Gas in MacConkey Broth", media: "MacConkey Broth", temp: "44", time: "48hrs" },
  ],
};