import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSPMIAQ } from "./calculation";

export const spmIAQConfig: SimpleEnvironmentConfig = {
  shortName: "SPM (IAQ)",
  title: "SPM (IAQ) Analysis",
  subtitle: "Environment Laboratory \u2022 Indoor Air Quality Testing",
  preparationType: "spmIAQ",
  calculationType: "spm",
  formula: "SPM = [(M2 \u2212 M1) \u00d7 1000000] / V",
  resultUnit: "mg/m\u00b3",
  fields: [
    { key: "m1", name: "Initial Mass of filter", symbol: "M1", unit: "gm" },
    { key: "m2", name: "Final Mass of filter", symbol: "M2", unit: "gm" },
    { key: "v", name: "Air volume sample", symbol: "V", unit: "m3" },
  ],
  calculate: (values) => calculateSPMIAQ(values as any),
};
