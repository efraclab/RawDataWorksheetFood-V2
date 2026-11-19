import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilAvailableSulphur } from "./calculation";

export const soilAvailableSulphurConfig: SimpleEnvironmentConfig = {
  shortName: "Soil (Available sulphur)",
  title: "Soil (Available Sulphur) Analysis",
  subtitle: "Environment Laboratory \u2022 Soil Testing",
  preparationType: "soilAvailableSulphur",
  calculationType: "soilS",
  formula: "Available sulphur = (W \u00d7 volume of extractant) / (aliquot \u00d7 weight of soil)",
  resultUnit: "mg/kg",
  fields: [
    { key: "w", name: "Quantity of sulphur obtained from standard curve", symbol: "W", unit: "mg" },
    { key: "soilWeight", name: "Weight of soil sample", symbol: "20", unit: "gm", defaultValue: "20" },
    { key: "extractant", name: "Volume of extractant", symbol: "100", unit: "ml", defaultValue: "100" },
    { key: "aliquot", name: "Volume of extractant in which turbidity is developed", symbol: "10", unit: "ml", defaultValue: "10" },
  ],
  calculate: (values) => calculateSoilAvailableSulphur(values as any),
};
