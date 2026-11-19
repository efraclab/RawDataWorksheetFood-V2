import type { PlateCountConfig } from "../plateCount/config";

/**
 * Yeast & Mould Count. Values and formula come from the "TYM" sheet:
 *   Yeast = SUM(5th day yeast counts) x 10 / 2
 *   Mould = SUM(5th day mould counts) x 10 / 2
 *   Total = Yeast + Mould
 * Only the 5th day rows are counted. The 3rd and 4th day rows are observation only.
 */
export const tymConfig: PlateCountConfig = {
  key: "tym",
  moduleId: "micro.tym",
  persistenceType: "tym",
  title: "TYM",
  testName: "Yeast & Mould Count",
  media: "",
  method: "",
  incubationTemp: "25",
  incubationTime: "",
  replicationFactor: "2",
  dilutionFactor: "10",
  resultUnit: "CFU/gm",
  columnCount: 5,
  countGroups: [
    { key: "yeast", label: "Yeast" },
    { key: "mould", label: "Mould" },
  ],
  timePoints: [
    { label: "3rd day", counted: false },
    { label: "4th day", counted: false },
    { label: "5th day", counted: true },
  ],
  extraTextSteps: ["Positive Control (Yeast)", "Positive Control (Mould)"],
};