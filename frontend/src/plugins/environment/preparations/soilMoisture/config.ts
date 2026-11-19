import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilMoisture } from "./calculation";

export const soilMoistureConfig: SimpleEnvironmentConfig = {
  shortName: "Soil (Moisture)",
  title: "Soil (Moisture) Analysis",
  subtitle: "Environment Laboratory \u2022 Soil Testing",
  preparationType: "soilMoisture",
  calculationType: "soilMoisture",
  formula: "Moisture % = (L / O) \u00d7 100",
  resultUnit: "%",
  fields: [
    { key: "l", name: "Loss in Wt.", symbol: "L", unit: "" },
    { key: "o", name: "Oven dry Wt. of soil", symbol: "O", unit: "" },
  ],
  calculate: (values) => calculateSoilMoisture(values as any),
};
