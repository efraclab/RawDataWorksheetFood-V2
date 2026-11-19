import type { PlateCountConfig } from "../plateCount/config";

/** Total Combined Yeast & Mould Count or Total Fungal Count (Ayurvedic Pharmacopoeia). Values from sheet "72" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const ayushTymcConfig: PlateCountConfig = {
  key: "ayushTymc",
  moduleId: "micro.ayushTymc",
  persistenceType: "ayushTymc",
  title: "TYMC (AYUSH)",
  testName: "Total Combined Yeast & Mould Count or Total Fungal Count (Ayurvedic Pharmacopoeia)",
  media: "Sabouraud Dextrose Agar",
  method: "Ayurvedic Pharmacopoeia of India",
  incubationTemp: "25",
  incubationTime: "5 days",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
};
