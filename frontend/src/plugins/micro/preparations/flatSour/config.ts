import type { PlateCountConfig } from "../plateCount/config";

/** Flat sour spore count (or Bacillus coagulans). Values from sheet "57" of RAW_DATA_FORMAT-FOOD_MICRO_LAB.xlsx. */
export const flatSourConfig: PlateCountConfig = {
  key: "flatSour",
  moduleId: "micro.flatSour",
  persistenceType: "flatSour",
  title: "Flat Sour Spore Count",
  testName: "Flat sour spore count (or Bacillus coagulans)",
  media: "Dextrose Tryptone Agar (DTA) and Thermoacidurans agar",
  method: "APHA 5th Edition Chapter 26",
  incubationTemp: "55 \u00b1 1",
  incubationTime: "48 \u00b1 3",
  replicationFactor: "2.2",
  dilutionFactor: "100",
  resultUnit: "cfu/10 gm",
  columnCount: 2,
  // Excel sums only the DTA plates (D13:E14). Thermoacidurans agar rows are recorded, not counted.
  timePoints: [
    { label: "DTA", counted: true },
    { label: "Thermoacidurans agar", counted: false },
  ],
  extraTextSteps: [
    "Confirmation (coagulation of litmus milk agar)",
    { name: "Positive Control", value: "Bacillus coagulans on DTA: convex, slightly moist, pale yellow to complete yellow with yellow zone" },
  ],
};
