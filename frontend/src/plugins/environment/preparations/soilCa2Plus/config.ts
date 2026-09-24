import type { SimpleEnvironmentConfig } from "../_shared/types";
import { calculateSoilCa2Plus } from "./calculation";

const computed = (fn: (values: Record<string, number>) => number | null) => ({
  readOnly: true,
  compute: (values: Record<string, number>) => {
    const result = fn(values);
    return result === null || !Number.isFinite(result) ? "" : result.toFixed(3);
  },
});

export const soilCa2PlusConfig: SimpleEnvironmentConfig = {
  shortName: "SOIL Ca2+",
  title: "SOIL Ca2+ Analysis",
  subtitle: "Environment Laboratory • Soil Testing",
  preparationType: "soilCa2Plus",
  calculationType: "soilCa2Plus",
  formula:
    "Calcium by versanate method = (N × V × 1000) / A;   Calcium on soil wt. basis = (100 × E × Ca) / (W × 1000)",
  resultUnit: "me/liter",
  fields: [
    {
      key: "n",
      name: "Normality of EDTA",
      symbol: "N",
      unit: "",
    },
    {
      key: "v",
      name: "Vol. of EDTA",
      symbol: "V",
      unit: "ml",
    },
    {
      key: "a",
      name: "ml of aliquot taken",
      symbol: "A",
      unit: "ml",
    },
    {
      key: "e",
      name: "Extract Volume",
      symbol: "E",
      unit: "ml",
    },
    {
      key: "w",
      name: "Wt. of soil",
      symbol: "W",
      unit: "gm",
    },
    {
      key: "ca",
      name: "Calcium by versanate method",
      symbol: "Ca",
      unit: "me/liter",
      ...computed((values) => {
        const n = values.n;
        const v = values.v;
        const a = values.a;
        if (!Number.isFinite(n) || !Number.isFinite(v) || !Number.isFinite(a) || a <= 0) {
          return null;
        }
        return (n * v * 1000) / a;
      }),
    },
  ],
  calculate: (values) =>
    calculateSoilCa2Plus({
      n: values.n,
      v: values.v,
      a: values.a,
      e: values.e,
      w: values.w,
    }),
};
