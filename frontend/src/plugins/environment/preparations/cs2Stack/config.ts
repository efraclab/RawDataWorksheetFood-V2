import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateCS2Stack } from "./calculation";

export const cs2StackConfig: SimpleEnvironmentConfig = {
  shortName: "CS2 in Stack",
  title: "CS2 in Stack Analysis",
  subtitle: "Environment Laboratory \u2022 CS\u2082 Stack Testing",
  preparationType: "cs2Stack",
  calculationType: "cs2",
  formula: "CS\u2082 ppm v/v = (24800 \u00d7 A2 \u00d7 B2) / (V \u00d7 F),  F = (Pb \u2212 f) / Pb",
  resultUnit: "ppm v/v",
  fields: [
    { key: "a2", name: "Volume of iodine solution consumed", symbol: "A2", unit: "ml" },
    { key: "b2", name: "Normality of iodine solution", symbol: "B2", unit: "" },
    { key: "v", name: "Volume of air sample passed", symbol: "V", unit: "l" },
    { key: "f", name: "Dryness factor calculated from barometric pressure and temperature", symbol: "F", unit: "", defaultValue: "0.5", readOnly: true, compute: (values) => { const pb = values.pb; const aq = values.aq; return Number.isFinite(pb) && pb > 0 && Number.isFinite(aq) ? String((pb - aq) / pb) : ""; } },
    { key: "pb", name: "Barometric pressure", symbol: "Pb", unit: "", defaultValue: "2" },
    { key: "aq", name: "Aqueous tension", symbol: "f", unit: "", defaultValue: "1" },
  ],
  calculate: (values) => calculateCS2Stack(values as any),
};
