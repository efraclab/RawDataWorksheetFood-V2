import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilTotalNitrogen } from "./calculation";

export const soilTotalNitrogenConfig: SimpleEnvironmentConfig = {
  shortName: "Soil (Total nitrogen)",
  title: "Soil (Total Nitrogen) Analysis",
  subtitle: "Environment Laboratory \u2022 Soil Testing",
  preparationType: "soilTotalNitrogen",
  calculationType: "soilN",
  formula: "Percentage N = {1.401 \u00d7 [(V1\u00d7M1 \u2212 V2\u00d7M2) \u2212 (V3\u00d7M1 \u2212 V4\u00d7M2)] \u00d7 df} / W",
  resultUnit: "%",
  fields: [
    { key: "v1", name: "Standard acid taken in receiving flask for samples", symbol: "V1", unit: "ml" },
    { key: "v2", name: "Standard NaOH used in titration", symbol: "V2", unit: "ml" },
    { key: "v3", name: "Standard acid taken in receiving flask for blank", symbol: "V3", unit: "ml" },
    { key: "v4", name: "Standard NaOH used in titrating blank", symbol: "V4", unit: "ml" },
    { key: "m1", name: "Molarity of standard acid", symbol: "M1", unit: "" },
    { key: "m2", name: "Molarity of standard NaOH", symbol: "M2", unit: "" },
    { key: "w", name: "Weight of sample taken (gm)", symbol: "W", unit: "gm" },
    { key: "df", name: "Dilution factor", symbol: "df", unit: "" },
  ],
  calculate: (values) => calculateSoilTotalNitrogen(values as any),
};
