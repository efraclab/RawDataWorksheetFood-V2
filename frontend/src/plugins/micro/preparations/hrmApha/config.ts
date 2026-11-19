import type { FormulaConfig } from "../formula/config";

/** Detection of Heat Resistant Molds (APHA). Values from sheet "58". Final Count = SUM(Week 1, Week 2) of the sample column. */
export const hrmAphaConfig: FormulaConfig = {
  key: "hrmApha",
  moduleId: "micro.hrmApha",
  persistenceType: "hrmApha",
  title: "Heat Resistant Molds (APHA)",
  testName: "Detection of Heat Resistant Molds",
  media: "Potato Dextrose Agar/Malt Extract Agar Double strength",
  method: "APHA 5th Edition Chapter 22",
  headerTextSteps: [
    { name: "Plate diameter", value: "150 mm" },
    { name: "Incubation Temp/Time", value: "30 °C / 14 Days" },
  ],
  tables: [
    {
      key: "obs",
      title: "Observation",
      rows: ["Week 1", "Week 2"],
      columns: ["Sample", "Positive Control", "Blank"],
    },
  ],
  formulaText: "Final Count = SUM(Week 1, Week 2) (sample)",
  resultLabel: "Final Count",
  unit: "",
  compute: (x) => ({ value: x.sum("obs", [0]) }),
};
