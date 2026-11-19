import type { PlateCountConfig } from "../plateCount/config";

/** Total Combined Yeast & Mould Count or Total Fungal Count (Indian Pharmacopoeia). Values from sheet "86" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipTymcConfig: PlateCountConfig = {
  key: "ipTymc",
  moduleId: "micro.ipTymc",
  persistenceType: "ipTymc",
  title: "TYMC (IP)",
  testName: "Total Combined Yeast & Mould Count or Total Fungal Count (Indian Pharmacopoeia)",
  media: "Sabouraud Dextrose Agar",
  method: "IP-2018",
  incubationTemp: "25",
  incubationTime: "5 days",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};
