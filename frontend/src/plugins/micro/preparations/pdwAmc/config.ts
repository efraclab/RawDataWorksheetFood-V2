import type { FormulaConfig } from "../formula/config";

/**
 * Aerobic Microbial Count/ml (Packaged Drinking Water). Values from sheet "47".
 * The sheet records plate counts at 37 ± 1 °C and 20-22 °C but gives no formula,
 * so the analyst enters the two results; the app does not average or sum the plates.
 */
export const pdwAmcConfig: FormulaConfig = {
  key: "pdwAmc",
  moduleId: "micro.pdwAmc",
  persistenceType: "pdwAmc",
  title: "PDW Aerobic Microbial Count/ml (IS 5402)",
  testName: "Aerobic Microbial Count/ml (Packaged Drinking Water)",
  media: "Plate Count Agar",
  method: "IS: 5402: 2012 RA 2018",
  tables: [
    {
      key: "plates",
      title: "Observation",
      rows: [
        "37 ± 1 °C · Plate 1",
        "37 ± 1 °C · Plate 2",
        "20-22 °C · Plate 1",
        "20-22 °C · Plate 2",
      ],
      columns: ["Time (hrs)", "Count (Dilutions)", "Blank"],
    },
  ],
  fields: [
    { key: "amc37", label: "Aerobic Microbial Count at 37 ± 1 °C" },
    { key: "amc22", label: "Aerobic Microbial Count at 20-22 °C" },
  ],
  formulaText: "Results entered by the analyst from the plate counts (no formula on the sheet)",
  resultLabel: "Aerobic Microbial Count at 37 ± 1 °C",
  unit: "cfu/ml",
  compute: (x) => {
    const at37 = x.field("amc37");
    const at22 = x.field("amc22");
    if (at37 === null) return { value: null, error: "Enter the Aerobic Microbial Count at 37 ± 1 °C" };
    return {
      value: at37,
      details: at22 === null ? [] : [`Aerobic Microbial Count at 20-22 °C: ${at22} cfu/ml`],
    };
  },
};
