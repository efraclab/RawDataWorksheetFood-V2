import type { FormulaConfig } from "../formula/config";

/** Total MS2 Coliphage Count. Values from sheet "69". Result = SUM of all plaque counts (sheet: "represent as PFU/Lit"). */
export const coliphageConfig: FormulaConfig = {
  key: "coliphage",
  moduleId: "micro.coliphage",
  persistenceType: "coliphage",
  title: "MS2 Coliphage Count (USEPA 1602)",
  testName: "Total MS2 Coliphage Count",
  media: "Tryptic (trypticase) soy agar, and broth",
  method: "USEPA method 1602",
  headerTextSteps: [
    { name: "Plate size", value: "140 mm diameter" },
    { name: "Incubation", value: "36 ± 1 °C / 16-24 h" },
    { name: "Blank" },
  ],
  tables: [
    {
      key: "plaques",
      title: "Plaque counts (No. of set)",
      rows: ["1", "2", "3", "4", "5"],
      columns: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
  ],
  formulaText: "Result = SUM of all plaques in each plate",
  resultLabel: "Total plaques",
  unit: "PFU/L",
  compute: (x) => ({ value: x.sum("plaques") }),
};
