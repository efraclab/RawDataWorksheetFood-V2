import type { CalculationTDS } from "./models/CalculationTDS";
import type {
  SamplePreparationTDS,
  SamplePreparationTDSStep,
} from "./models/SamplePreparationTDS";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationTDSStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationTDS = (
  index: number,
): SamplePreparationTDS => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep('Initial wt. of dish', 'gm'),
    createStep('Volume of sample', 'ml'),
    createStep('Final wt. of dish', 'gm'),
  ],
});

export const createCalculationTDS = (
  index: number,
): CalculationTDS => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationTDS = (
  value: unknown,
): CalculationTDS => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationTDS>)
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
