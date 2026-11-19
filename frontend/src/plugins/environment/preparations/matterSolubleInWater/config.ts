import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateMatterSolubleInWater } from "./calculation";

export const matterSolubleInWaterConfig: SimpleEnvironmentConfig = {
  shortName: "Matter Soluble in Water",
  title: "Matter Soluble in Water Analysis",
  subtitle: "Environment Laboratory \u2022 Water Solubility Testing",
  preparationType: "matterSolubleInWater",
  calculationType: "matterSoluble",
  formula: "Matter soluble in water (dry basis) % by mass = (20000 \u00d7 M) / [M1 \u00d7 (100 \u2212 X)]",
  resultUnit: "%",
  fields: [
    { key: "m", name: "Mass of dried residue", symbol: "M", unit: "gm" },
    { key: "m1", name: "Mass of the material taken for test", symbol: "M1", unit: "gm" },
    { key: "x", name: "Percentage of moisture present in the material taken for the test", symbol: "X", unit: "%" },
  ],
  calculate: (values) => calculateMatterSolubleInWater(values as any),
};
