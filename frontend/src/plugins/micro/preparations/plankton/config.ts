import type { FormulaConfig } from "../formula/config";

/** Microscopic enumeration of plankton. Values from sheet "68". Result = (1000 × V1 × N) / (V × n). The sheet gives no unit. */
export const planktonConfig: FormulaConfig = {
  key: "plankton",
  moduleId: "micro.plankton",
  persistenceType: "plankton",
  title: "Plankton Count (IS 1622)",
  testName: "Microscopic enumeration of plankton",
  media: "",
  method: "IS 1622: 1981 RA 2009",
  headerTextSteps: [{ name: "Counting chamber", value: "Sedgewick Rafter Counting Chamber" }],
  tables: [],
  fields: [
    { key: "v1", label: "Volume in ml of the concentrated sample taken for the test (V1)" },
    { key: "n", label: "Total number of organisms counted (N)" },
    { key: "v", label: "Volume in ml of original sample taken for concentration and filtered (V)" },
    { key: "fields", label: "Number of fields counted (n)" },
  ],
  formulaText: "Result = (1000 × V1 × N) / (V × n)",
  resultLabel: "Result",
  unit: "",
  compute: (x) => {
    const v1 = x.field("v1");
    const n = x.field("n");
    const v = x.field("v");
    const f = x.field("fields");
    if (v1 === null || n === null || v === null || f === null)
      return { value: null, error: "Enter V1, N, V and n" };
    if (v <= 0 || f <= 0) return { value: null, error: "V and n must be greater than 0" };
    return { value: (1000 * v1 * n) / (v * f) };
  },
};
