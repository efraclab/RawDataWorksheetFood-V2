import type { PlateCountConfig } from "../plateCount/config";

/** Heterotrophic Plate Count. Values come from the "Heterotrphic Plate Count" sheet. */
export const hpcConfig: PlateCountConfig = {
  key: "hpc",
  moduleId: "micro.hpc",
  persistenceType: "hpc",
  title: "HPC",
  testName: "Heterotrophic Plate Count",
  media: "Plate Count Agar",
  method: "APHA 23rd Edition, 9215 B",
  incubationTemp: "35",
  incubationTime: "48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
};