import type { PlateCountConfig } from "../plateCount/config";

/** Total Thermoduric Bacterial Count. Values from sheet "53" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const thermoduricConfig: PlateCountConfig = {
  key: "thermoduric",
  moduleId: "micro.thermoduric",
  persistenceType: "thermoduric",
  title: "Thermoduric Bacterial Count",
  testName: "Total Thermoduric Bacterial Count",
  media: "Plate Count Agar",
  method: "IS 1479 (Part 3):1977, RA 2003",
  incubationTemp: "30",
  incubationTime: "3rd day",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};
