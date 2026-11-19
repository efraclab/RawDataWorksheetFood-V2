import type { PlateCountConfig } from "../plateCount/config";

/** Enumeration of Coliform and E. coli. Values come from the "Coliform & E.coli" sheet. */
export const coliformEcoliConfig: PlateCountConfig = {
  key: "coliformEcoli",
  moduleId: "micro.coliformEcoli",
  persistenceType: "coliformEcoli",
  title: "Coliform & E. coli",
  testName: "Enumeration of Coliform and E. coli by Plate Count Method",
  media: "",
  method: "",
  incubationTemp: "35",
  incubationTime: "24",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
  extraTextSteps: ["Sample Preparation"],
  confirmationTests: [
    { name: "Lactose fermentation", media: "BGLB", temp: "35", time: "24 - 48 hrs", positive: "Gas formation" },
    { name: "Gram’s staining", media: "Gram’s stain", temp: "-", positive: "Gram (-) bacilli" },
  ],
};