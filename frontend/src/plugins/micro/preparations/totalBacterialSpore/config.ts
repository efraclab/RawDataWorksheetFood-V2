import type { PlateCountConfig } from "../plateCount/config";

/** Total Bacterial spore count. Values from sheet "61" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const totalBacterialSporeConfig: PlateCountConfig = {
  key: "totalBacterialSpore",
  moduleId: "micro.totalBacterialSpore",
  persistenceType: "totalBacterialSpore",
  title: "Total Bacterial Spore Count",
  testName: "Total Bacterial spore count",
  media: "As per IS 4238",
  method: "IS 4238:1967 RA 2014",
  incubationTemp: "30 / 55",
  incubationTime: "4 days",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  incubationTimeLabel: "Incubation Time",
  // Excel sums only the 55 °C plates (D20:L21). 30 °C plates are recorded, not counted.
  timePoints: [
    { label: "30 °C", counted: false },
    { label: "55 °C", counted: true },
  ],
};
