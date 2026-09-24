import type { CalculationNO2Ambient } from "./models/CalculationNO2Ambient";
import type { SamplePreparationNO2Ambient, SamplePreparationNO2AmbientStep } from "./models/SamplePreparationNO2Ambient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (name: string, unit1 = "", value1 = ""): SamplePreparationNO2AmbientStep => ({
  name,
  value1,
  unit1,
  logBookID: "",
});

export const createSamplePreparationNO2Ambient = (index: number): SamplePreparationNO2Ambient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Graph factor"),
    createStep("Sample abs"),
    createStep("Blank abs"),
    createStep("Dilution factor"),
    createStep("Sampling efficiency", "", "0.82"),
    createStep("Volume of air sampled", "m³"),
    createStep("Volume of sample", "ml"),
    createStep("Volume of aliquot taken for analysis", "ml"),
  ],
});

export const createCalculationNO2Ambient = (index: number): CalculationNO2Ambient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationNO2Ambient = (value: unknown): CalculationNO2Ambient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data
    : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationNO2Ambient> : {};

  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel
      : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "µg/m³",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};
