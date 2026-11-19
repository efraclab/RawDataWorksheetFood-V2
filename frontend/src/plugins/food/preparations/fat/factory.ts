import type { CalculationFat } from "./models/CalculationFat";
import type { SamplePreparationFat } from "./models/SamplePreparationFAT";

export const createCalculationFat = (index: number): CalculationFat => ({
  id: Date.now() + index,
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
  calculationResult: null,
  calculationResultUnit: "%",
  w1: null,
  w2: null,
  w3: null,
});

export const restoreCalculationFat = (data: any): CalculationFat => {
  let source = data?.data ?? data;
  if (typeof source === "string") {
    try { source = JSON.parse(source); } catch { source = {}; }
  }
  return {
    ...createCalculationFat(0),
    ...source,
    id: source?.id ?? data?.id ?? Date.now(),
    label: source?.label ?? data?.label ?? "Calculation 1",
  };
};

export const createSamplePreparationFat = (index: number): SamplePreparationFat => ({
  id: Date.now() + index,
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Initial Empty Weight of R.B Flask", value1: "", unit1: "g", logBookID: "" },
    { name: "Final weight of R.B Flask After Drying", value1: "", unit1: "g", logBookID: "" },
    { name: "Dry at", value1: "", unit1: "°C", value2: "", unit2: "min", logBookID: "" },
    { name: "Weight of Sample", value1: "", unit1: "g", logBookID: "" },
  ],
});
