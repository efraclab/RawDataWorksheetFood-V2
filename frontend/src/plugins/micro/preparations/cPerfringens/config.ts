import type { PlateCountConfig } from "../plateCount/config";

/** Isolation and Identification of Clostridium perfringens. Values from sheet "29" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const cPerfringensConfig: PlateCountConfig = {
  key: "cPerfringens",
  moduleId: "micro.cPerfringens",
  persistenceType: "cPerfringens",
  title: "Clostridium perfringens",
  testName: "Isolation and Identification of Clostridium perfringens",
  media: "Sulfite-cycloserine agar (SC), Fluid Thioglycollate Medium (FTM), Lactose sulfite medium (LS)",
  method: "ISO 7937:2004",
  incubationTemp: "37",
  incubationTime: "20 \u00b1 2",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/gm",
  extraTextSteps: ["Positive Control"],
  confirmationTests: [
    { name: "Growth in FTM", media: "Fluid Thioglycollate Medium (FTM)", temp: "37", time: "18 to 24" },
    { name: "Growth in LS", media: "Lactose sulfite medium (LS)", temp: "46", time: "18 to 24" },
    { name: "Motility Test", media: "Nitrate Motility Medium", temp: "37", time: "24 (anaerobically)" },
    { name: "Lactose fermentation Test", media: "Lactose-Gelatin Medium", temp: "37", time: "24 (anaerobically)" },
    { name: "Gelatin liquefaction test", media: "Lactose-Gelatin Medium", temp: "5", time: "1 h / 24" },
  ],
};
