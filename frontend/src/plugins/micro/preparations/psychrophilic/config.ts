import type { PlateCountConfig } from "../plateCount/config";

/** Total Psychrophilic Bacterial Count. Values come from the "Psychrophillic count" sheet. */
export const psychrophilicConfig: PlateCountConfig = {
  key: "psychrophilic",
  moduleId: "micro.psychrophilic",
  persistenceType: "psychrophilic",
  title: "Psychrophilic Count",
  testName: "Total Psychrophilic Bacterial Count",
  media: "Plate Count Agar",
  method: "IS: 1479 (Part 3) -1977, Reaff 2003",
  incubationTemp: "5",
  incubationTime: "7th day",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};