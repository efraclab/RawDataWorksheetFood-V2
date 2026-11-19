import type { CalculationO3Ambient } from "./models/CalculationO3Ambient";
import type { SamplePreparationO3Ambient, SamplePreparationO3AmbientStep } from "./models/SamplePreparationO3Ambient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (name: string, value1 = "", unit1 = "", fixed = false): SamplePreparationO3AmbientStep => ({
  name,
  value1,
  unit1,
  fixed,
  logBookID: "",
});

export const createSamplePreparationO3Ambient = (index: number): SamplePreparationO3Ambient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Absorbance of sample"),
    createStep("Absorbance of reagent blank"),
    createStep("Calibration factor"),
    createStep("Volume of air sampled", "", "m³"),
    createStep("Conversion factor, µl to µg", "1.962", "", true),
  ],
});

export const createCalculationO3Ambient = (index: number): CalculationO3Ambient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationO3Ambient = (value: unknown): CalculationO3Ambient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationO3Ambient> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "µg/m³",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax :
      (typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : ""),
  };
};
