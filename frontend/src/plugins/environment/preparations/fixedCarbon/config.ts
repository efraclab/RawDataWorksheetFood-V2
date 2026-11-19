import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateFixedCarbon } from "./calculation";

export const fixedCarbonConfig: SimpleEnvironmentConfig = {
  shortName: "FIXED CARBON",
  title: "Fixed Carbon Analysis",
  subtitle: "Environment Laboratory \u2022 Coal Testing",
  preparationType: "fixedCarbon",
  calculationType: "fixedCarbon",
  formula: "Fixed Carbon = 100 \u2212 (A + V + M)",
  resultUnit: "%",
  fields: [
    { key: "a", name: "Ash Content", symbol: "A", unit: "", defaultValue: "10" },
    { key: "v", name: "Volatile Matter", symbol: "V", unit: "", defaultValue: "10" },
    { key: "m", name: "Moisture", symbol: "M", unit: "", defaultValue: "10" },
  ],
  calculate: (values) => calculateFixedCarbon(values as any),
};
