import type { CalculationChloride } from "./models/CalculationChloride";
import type {
  SamplePreparationChloride,
  SamplePreparationChlorideStep,
} from "./models/SamplePreparationChloride";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationChlorideStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationChloride = (
  index: number,
): SamplePreparationChloride => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep('Volume of sample', 'ml'),
    createStep('Dilution factor'),
    createStep('Volume of AgNO3', 'ml'),
    createStep('Strength of AgNO3', 'N'),
  ],
});

export const createCalculationChloride = (
  index: number,
): CalculationChloride => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationChloride = (
  value: unknown,
): CalculationChloride => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationChloride>)
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
