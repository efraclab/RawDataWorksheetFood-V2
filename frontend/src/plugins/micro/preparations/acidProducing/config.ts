import type { PlateCountConfig } from "../plateCount/config";

/** Total Acid Producing Bacterial Count. Values come from the "acid producing bacterial count" sheet. */
export const acidProducingConfig: PlateCountConfig = {
  key: "acidProducing",
  moduleId: "micro.acidProducing",
  persistenceType: "acidProducing",
  title: "Acid Producing Count",
  testName: "Total Acid Producing Bacterial Count",
  media: "Dextrose Tryptone Agar/PCA with Bromcresol purple",
  method: "APHA 5th Edition, Chapter: 19",
  incubationTemp: "31±1 (dairy product) / 35±1 (other products)",
  incubationTime: "48±3",
  replicationFactor: "2.2",
  dilutionFactor: "",
  resultUnit: "cfu/10 gm",
  extraTextSteps: ["Positive Control"],
};