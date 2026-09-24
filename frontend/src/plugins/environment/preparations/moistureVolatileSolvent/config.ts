import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateMoistureVolatileSolvent } from "./calculation";

export const moistureVolatileSolventConfig: SimpleEnvironmentConfig = {
  shortName: "Moisture of volatile solvent",
  title: "Moisture of Volatile Solvent Analysis",
  subtitle: "Environment Laboratory \u2022 Solvent Testing",
  preparationType: "moistureVolatileSolvent",
  calculationType: "moistureSolvent",
  formula: "Moisture volatile solvent (water % by weight) = (V \u00d7 W) / (10 \u00d7 S)",
  resultUnit: "%",
  fields: [
    { key: "v", name: "Volume of Karl Fischer reagent required for titrating by the specimen", symbol: "V", unit: "ml" },
    { key: "w", name: "Equivalence factor for Karl Fischer reagent, water per milliliter of reagent", symbol: "W", unit: "mg" },
    { key: "s", name: "Specimen wt. used", symbol: "S", unit: "gm" },
  ],
  calculate: (values) => calculateMoistureVolatileSolvent(values as any),
};
