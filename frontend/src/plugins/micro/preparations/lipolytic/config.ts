import type { PlateCountConfig } from "../plateCount/config";

/** Lipolytic Bacterial Count. Values from sheet "56" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const lipolyticConfig: PlateCountConfig = {
  key: "lipolytic",
  moduleId: "micro.lipolytic",
  persistenceType: "lipolytic",
  title: "Lipolytic Bacterial Count",
  testName: "Lipolytic Bacterial Count",
  media: "Tributyrin Agar",
  method: "IS 4251:1967, RA 2015",
  incubationTemp: "30",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
};
