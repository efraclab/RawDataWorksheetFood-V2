import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateVolatileMatter } from "./calculation";

export const volatileMatterConfig: SimpleEnvironmentConfig = {
  shortName: "Volatile Matter",
  title: "Volatile Matter Analysis",
  subtitle: "Environment Laboratory \u2022 Coal Testing",
  preparationType: "volatileMatter",
  calculationType: "volatileMatter",
  formula: "Volatile Matter = [100 \u00d7 (M2 \u2212 M3) / (M2 \u2212 M1)] \u2212 MO",
  resultUnit: "%",
  fields: [
    { key: "m2", name: "Mass of crucible + lid + sample before heating", symbol: "M2", unit: "gm" },
    { key: "m3", name: "Mass of crucible + lid + sample after heating", symbol: "M3", unit: "gm" },
    { key: "m1", name: "Mass of empty crucible + Lid", symbol: "M1", unit: "gm" },
    { key: "mo", name: "% of moisture in the sample on air dried basis", symbol: "MO", unit: "" },
  ],
  calculate: (values) => calculateVolatileMatter(values as any),
};
