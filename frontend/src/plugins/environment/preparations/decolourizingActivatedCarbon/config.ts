import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateDecolourizingActivatedCarbon } from "./calculation";

export const decolourizingActivatedCarbonConfig: SimpleEnvironmentConfig = {
  shortName: "Decolourizing (ACTIVATED CARBON)",
  title: "Decolourizing (Activated Carbon) Analysis",
  subtitle: "Environment Laboratory \u2022 Activated Carbon Testing",
  preparationType: "decolourizingActivatedCarbon",
  calculationType: "decolourizing",
  formula: "Decolourizing Power = (15 \u00d7 V) / (10 \u00d7 M)",
  resultUnit: "ml/g",
  fields: [
    { key: "v", name: "Volume of methylene blue solution consumed", symbol: "V", unit: "ml" },
    { key: "m", name: "Mass of the material taken for test", symbol: "M", unit: "gm" },
  ],
  calculate: (values) => calculateDecolourizingActivatedCarbon(values as any),
};
