import type { PlateCountConfig } from "../plateCount/config";

/** Total Thermophilic Bacterial Count. Values come from the "thermophillic bacterial count" sheet. */
export const thermophilicConfig: PlateCountConfig = {
  key: "thermophilic",
  moduleId: "micro.thermophilic",
  persistenceType: "thermophilic",
  title: "Thermophilic Count",
  testName: "Total Thermophilic Bacterial Count",
  media: "Plate Count Agar",
  method: "IS: 1479 (Part 3) -1977, Reaff 2003",
  incubationTemp: "55",
  incubationTime: "48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
};