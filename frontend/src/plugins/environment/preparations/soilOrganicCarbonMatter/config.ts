import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilOrganicCarbonMatter } from "./calculation";

const computed = (fn: (values: Record<string, number>) => number | null) => ({
  readOnly: true,
  compute: (values: Record<string, number>) => {
    const result = fn(values);
    return result === null || !Number.isFinite(result) ? "" : result.toFixed(3);
  },
});

export const soilOrganicCarbonMatterConfig: SimpleEnvironmentConfig = {
  shortName: "SOIL organic carbon - matter",
  title: "SOIL Organic Carbon - Matter Analysis",
  subtitle: "Environment Laboratory • Soil Testing",
  preparationType: "soilOrganicCarbonMatter",
  calculationType: "soilOrganicCarbonMatter",
  formula:
    "OC = 3 × (S − T) / S;   Y = OC × 1.3;   Organic Matter = Y × 1.724",
  resultUnit: "%",
  fields: [
    {
      key: "s",
      name: "FeSO4 solution required for blank",
      symbol: "S",
      unit: "ml",
    },
    {
      key: "t",
      name: "FeSO4 solution required for soil sample",
      symbol: "T",
      unit: "ml",
    },
    {
      key: "wt",
      name: "Eq wt of carbon (Wt. of carbon = 12, Valency = 4), Equation = 12/4",
      symbol: "Wt.",
      unit: "",
      defaultValue: "3",
      readOnly: true,
    },
    {
      key: "oc",
      name: "Organic carbon (OC)",
      symbol: "OC",
      unit: "%",
      ...computed((values) => {
        const s = values.s;
        const t = values.t;
        return Number.isFinite(s) && s > 0 && Number.isFinite(t) ? (3 * (s - t)) / s : null;
      }),
    },
    {
      key: "y",
      name: "Actual amount of OC",
      symbol: "Y",
      unit: "%",
      ...computed((values) => {
        const s = values.s;
        const t = values.t;
        if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(t)) return null;
        const oc = (3 * (s - t)) / s;
        return oc * 1.3;
      }),
    },
    {
      key: "organicMatter",
      name: "Organic Matter",
      symbol: "OM",
      unit: "%",
      ...computed((values) => {
        const s = values.s;
        const t = values.t;
        if (!Number.isFinite(s) || s <= 0 || !Number.isFinite(t)) return null;
        const oc = (3 * (s - t)) / s;
        return oc * 1.3 * 1.724;
      }),
    },
  ],
  calculate: (values) => calculateSoilOrganicCarbonMatter(values as any),
};
