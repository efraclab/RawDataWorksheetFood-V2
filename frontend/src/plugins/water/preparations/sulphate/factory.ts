import type { CalculationSulphate } from "./models/CalculationSulphate";
import type {
  SamplePreparationSulphate,
  SamplePreparationSulphateStep,
} from "./models/SamplePreparationSulphate";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationSulphateStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationSulphate = (
  index: number,
): SamplePreparationSulphate => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep('Abs'),
    createStep('DF'),
    createStep('M'),
    createStep('C'),
  ],
});

export const createCalculationSulphate = (
  index: number,
): CalculationSulphate => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationSulphate = (
  value: unknown,
): CalculationSulphate => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationSulphate>)
      : {};

  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel:
      typeof data.selectedSamplePreparationLabel === "string"
        ? data.selectedSamplePreparationLabel
        : null,
    calculationResult:
      typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit:
      typeof data.calculationResultUnit === "string"
        ? data.calculationResultUnit
        : "mg/L",
    acceptanceLimitMin:
      typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax:
      typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};
