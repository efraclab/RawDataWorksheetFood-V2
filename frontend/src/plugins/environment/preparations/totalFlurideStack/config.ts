import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateTotalFluorideStack } from "./calculation";

export const totalFlurideStackConfig: SimpleEnvironmentConfig = {
  shortName: "Total fluoride (stack)",
  title: "Total Fluoride (Stack) Analysis",
  subtitle: "Environment Laboratory \u2022 Total Fluoride Stack Testing",
  preparationType: "totalFlurideStack",
  calculationType: "totalFlurideStack",
  formula: "Ft = M × Vd;   C(Fluoride) = (Ft × Vt / At) / Vm(std)",
  resultUnit: "mg/m\u00b3",
  fields: [
    { key: "ft", name: "Total fluoride in sample", symbol: "Ft", unit: "mg", readOnly: true, compute: (values) => {
      const m = values.m;
      const vd = values.vd;
      return Number.isFinite(m) && Number.isFinite(vd) ? String(m * vd) : "";
    } },
    { key: "m", name: "Concentration of F from calibrated curve, molarity", symbol: "M", unit: "" },
    { key: "vt", name: "Total volume of F in sample, after final dilution", symbol: "Vt", unit: "ml" },
    { key: "at", name: "Aliquot of total sample added to still", symbol: "At", unit: "ml" },
    { key: "vd", name: "Volume of distillate as diluted", symbol: "Vd", unit: "ml" },
    { key: "vm", name: "Volume of gas sample, corrected to standard conditions", symbol: "Vm (std)", unit: "" },
  ],
  calculate: (values) => calculateTotalFluorideStack(values as any),
};
