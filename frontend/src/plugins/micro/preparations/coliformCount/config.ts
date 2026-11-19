import type { PlateCountConfig } from "../plateCount/config";

/** Enumeration of Coliform by Plate Count Method. Values come from the "Coliform count" sheet. */
export const coliformCountConfig: PlateCountConfig = {
  key: "coliformCount",
  moduleId: "micro.coliformCount",
  persistenceType: "coliformCount",
  title: "Coliform Count",
  testName: "Enumeration of Coliform by Plate Count Method",
  media: "",
  method: "",
  incubationTemp: "37",
  incubationTime: "24",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/gm",
};