import type { PlateCountConfig } from "../plateCount/config";

/** Enumeration & Detection of Enterobacteriaceae by Plate Count Method. Values from sheet "45" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const enterobacteriaceaeConfig: PlateCountConfig = {
  key: "enterobacteriaceae",
  moduleId: "micro.enterobacteriaceae",
  persistenceType: "enterobacteriaceae",
  title: "Enterobacteriaceae",
  testName: "Enumeration & Detection of Enterobacteriaceae by Plate Count Method",
  media: "VRBG Agar",
  method: "APHA 5th Edition (9.6)",
  incubationTemp: "35",
  incubationTime: "24",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/gm",
  extraTextSteps: [
    { name: "Observation", value: "Count purple red colonies with a zone of bile acids precipitation" },
  ],
  confirmationTests: [
    { name: "Enrichment: Peptone Water", media: "0.1% Peptone water / Buffered Peptone Water", temp: "37", time: "24" },
    { name: "Enrichment: Enterobacteriaceae enrichment broth", media: "Enterobacteriaceae enrichment broth", temp: "37", time: "20-24" },
    { name: "Plating: VRBG", media: "VRBG", temp: "37", time: "24" },
  ],
};
