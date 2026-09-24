import type { CalculationSO2Ambient } from "./models/CalculationSO2Ambient";
import type { SamplePreparationSO2Ambient, SamplePreparationSO2AmbientStep } from "./models/SamplePreparationSO2Ambient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const createStep = (name: string, unit1 = ""): SamplePreparationSO2AmbientStep => ({
  name, value1: "", unit1, logBookID: "",
});

export const createSamplePreparationSO2Ambient = (index: number): SamplePreparationSO2Ambient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Absorbance of sample"),
    createStep("Absorbance of reagent blank"),
    createStep("Calibration factor"),
    createStep("Volume of air sampled"),
    createStep("Volume of sample"),
    createStep("Volume of aliquot taken for analysis"),
  ],
});

export const createCalculationSO2Ambient = (index: number): CalculationSO2Ambient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationSO2Ambient = (value: unknown): CalculationSO2Ambient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationSO2Ambient> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "µg/m³",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};
