import type { PlateCountConfig } from "../plateCount/config";

/** Total Plate Count. Values come from the "TPC" sheet of the Excel template. */
export const tpcConfig: PlateCountConfig = {
  key: "tpc",
  moduleId: "micro.tpc",
  persistenceType: "tpc",
  title: "TPC",
  testName: "Total Plate Count",
  media: "",
  method: "",
  incubationTemp: "30",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
};