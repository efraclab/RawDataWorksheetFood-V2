import type { CalculationTotalFlurideAmbient } from "./models/CalculationTotalFlurideAmbient";
import type { SamplePreparationTotalFlurideAmbient, SamplePreparationTotalFlurideAmbientStep } from "./models/SamplePreparationTotalFlurideAmbient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const createStep = (name: string, unit1 = ""): SamplePreparationTotalFlurideAmbientStep => ({
  name, value1: "", unit1, logBookID: "",
});

export const createSamplePreparationTotalFlurideAmbient = (index: number): SamplePreparationTotalFlurideAmbient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Total µgF"),
    createStep("Volume of air sampled"),
  ],
});

export const createCalculationTotalFlurideAmbient = (index: number): CalculationTotalFlurideAmbient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationTotalFlurideAmbient = (value: unknown): CalculationTotalFlurideAmbient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationTotalFlurideAmbient> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "mg/m³",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};
