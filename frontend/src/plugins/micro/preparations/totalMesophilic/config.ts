import type { PlateCountConfig } from "../plateCount/config";

/** Total Mesophilic Count. Values come from the "Total mesophilic count" sheet. */
export const totalMesophilicConfig: PlateCountConfig = {
  key: "totalMesophilic",
  moduleId: "micro.totalMesophilic",
  persistenceType: "totalMesophilic",
  title: "Total Mesophilic Count",
  testName: "Total Mesophilic Count",
  media: "Plate Count Agar/Nutrient agar/Yeast Extract agar/R2A agar",
  method: "SM-PR-685 (Coca Cola)",
  incubationTemp: "35",
  incubationTime: "48",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
};