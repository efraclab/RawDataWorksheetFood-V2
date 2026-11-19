import type { FormulaConfig } from "../formula/config";

/** Detection of Heat Resistant Molds (SM-PR-610). Values from sheet "59". Result = SUM(Day 1..Day 7) of the sample column. */
export const hrmSmprConfig: FormulaConfig = {
  key: "hrmSmpr",
  moduleId: "micro.hrmSmpr",
  persistenceType: "hrmSmpr",
  title: "Heat Resistant Molds (SM-PR-610)",
  testName: "Detection of Heat Resistant Molds",
  media: "MEA/PDA/Acidified OSA",
  method: "SM-PR-610",
  headerTextSteps: [
    { name: "Plate diameter", value: "150 mm" },
    { name: "Incubation Temp/Time", value: "30 °C / 7 Days" },
  ],
  tables: [
    {
      key: "obs",
      title: "Observation",
      rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      columns: ["Sample", "Positive Control", "Blank"],
    },
  ],
  formulaText: "Result = SUM(Day 1 … Day 7) (sample)",
  resultLabel: "Result",
  unit: "",
  compute: (x) => ({ value: x.sum("obs", [0]) }),
};
