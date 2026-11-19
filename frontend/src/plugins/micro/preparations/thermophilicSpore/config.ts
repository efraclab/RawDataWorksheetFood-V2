import type { PlateCountConfig } from "../plateCount/config";

/** Total Thermophilic Spore Count. Values come from the "Acidophilic bacteria (lower section)" sheet. */
export const thermophilicSporeConfig: PlateCountConfig = {
  key: "thermophilicSpore",
  moduleId: "micro.thermophilicSpore",
  persistenceType: "thermophilicSpore",
  title: "Thermophilic Spore Count",
  testName: "Total Thermophilic Spore Count",
  media: "Dextrose Tryptone Agar",
  method: "APHA 5th Edition, Chapter 26",
  incubationTemp: "55",
  incubationTime: "72",
  replicationFactor: "1",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
  replicateCount: 5,
};