import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateAsh } from "./calculation";

export const ashConfig: SimpleEnvironmentConfig = {
  shortName: "Ash",
  title: "Ash Content Analysis",
  subtitle: "Environment Laboratory \u2022 Coal Testing",
  preparationType: "ash",
  calculationType: "ash",
  formula: "Ash Content = [100 \u00d7 (M3 \u2212 M4)] / (M2 \u2212 M1)",
  resultUnit: "%",
  fields: [
    { key: "m2", name: "Mass of dish + sample", symbol: "M2", unit: "gm" },
    { key: "m3", name: "Mass of dish and Ash", symbol: "M3", unit: "gm" },
    { key: "m1", name: "Mass of dish", symbol: "M1", unit: "gm" },
    { key: "m4", name: "Mass of dish after brushing out the Ash and on re-weighing", symbol: "M4", unit: "gm" },
  ],
  calculate: (values) => calculateAsh(values as any),
};
