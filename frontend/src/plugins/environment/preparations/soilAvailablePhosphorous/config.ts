import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilAvailablePhosphorous } from "./calculation";

export const soilAvailablePhosphorousConfig: SimpleEnvironmentConfig = {
  shortName: "Soil (available phosphorous)",
  title: "Soil (Available Phosphorous) Analysis",
  subtitle: "Environment Laboratory \u2022 Soil Testing",
  preparationType: "soilAvailablePhosphorous",
  calculationType: "phosphorous",
  formula: "Available Phosphorous (P) = (A \u00d7 V \u00d7 Wt.) / (1000000 \u00d7 W \u00d7 Va)",
  resultUnit: "kg/ha",
  fields: [
    { key: "w", name: "Weight of soil", symbol: "W", unit: "gm", defaultValue: "5" },
    { key: "v", name: "Volume of extract", symbol: "V", unit: "ml", defaultValue: "50" },
    { key: "va", name: "Volume of extract taken for estimation", symbol: "Va", unit: "ml", defaultValue: "5" },
    { key: "a", name: "Amount of P observed in sample on standard curve", symbol: "A", unit: "\u00b5g" },
    { key: "wt", name: "Wt. of 1 ha of soil upto a depth of 22 cm is taken as 2 million kg", symbol: "Wt.", unit: "", defaultValue: "2000000" },
  ],
  calculate: (values) => calculateSoilAvailablePhosphorous(values as any),
};
