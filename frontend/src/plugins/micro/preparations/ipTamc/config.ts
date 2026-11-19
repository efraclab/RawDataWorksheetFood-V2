import type { PlateCountConfig } from "../plateCount/config";

/** Total Aerobic Microbial Count (Indian Pharmacopoeia). Values from sheet "85" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ipTamcConfig: PlateCountConfig = {
  key: "ipTamc",
  moduleId: "micro.ipTamc",
  persistenceType: "ipTamc",
  title: "TAMC (IP)",
  testName: "Total Aerobic Microbial Count (Indian Pharmacopoeia)",
  media: "Soya bean Casein Digest Agar",
  method: "IP-2018",
  incubationTemp: "35",
  incubationTime: "72",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
};
