import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateMoistureCoal } from "./calculation";

export const moistureCoalConfig: SimpleEnvironmentConfig = {
  shortName: "Moisture Coal",
  title: "Moisture Coal Analysis",
  subtitle: "Environment Laboratory \u2022 Coal Testing",
  preparationType: "moistureCoal",
  calculationType: "moistureCoal",
  formula: "Moisture % = [(M2 \u2212 M3) / (M2 \u2212 M1)] \u00d7 100",
  resultUnit: "%",
  fields: [
    { key: "m2", name: "Mass of vessel + cover and sample before heating", symbol: "M2", unit: "gm" },
    { key: "m3", name: "Mass of vessel + cover and sample after heating", symbol: "M3", unit: "gm" },
    { key: "m1", name: "Mass of vessel + cover", symbol: "M1", unit: "gm" },
  ],
  calculate: (values) => calculateMoistureCoal(values as any),
};
