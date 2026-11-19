import type { PlateCountConfig } from "../plateCount/config";

/** Butyric acid anaerobic bacteria count. Values from sheet "63" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const butyricConfig: PlateCountConfig = {
  key: "butyric",
  moduleId: "micro.butyric",
  persistenceType: "butyric",
  title: "Butyric Acid Bacteria Count",
  testName: "Butyric acid anaerobic bacteria count",
  media: "Differential Clostridial Agar / Dextrose Tryptone Agar",
  method: "APHA 5th Edition chapter 24",
  incubationTemp: "30-35",
  incubationTime: "2-5 days",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};
