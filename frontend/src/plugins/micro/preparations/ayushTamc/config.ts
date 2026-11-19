import type { PlateCountConfig } from "../plateCount/config";

/** Total Aerobic Microbial Count (Ayurvedic Pharmacopoeia). Values from sheet "71" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushTamcConfig: PlateCountConfig = {
  key: "ayushTamc",
  moduleId: "micro.ayushTamc",
  persistenceType: "ayushTamc",
  title: "TAMC (AYUSH)",
  testName: "Total Aerobic Microbial Count (Ayurvedic Pharmacopoeia)",
  media: "Soya bean Casein Digest Agar",
  method: "Ayurvedic Pharmacopoeia of India",
  incubationTemp: "35",
  incubationTime: "5 days",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};
