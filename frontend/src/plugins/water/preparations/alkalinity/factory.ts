import type { CalculationAlkalinity } from "./models/CalculationAlkalinity";
import type {
  SamplePreparationAlkalinity,
  SamplePreparationAlkalinityStep,
} from "./models/SamplePreparationAlkalinity";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationAlkalinityStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationAlkalinity = (
  index: number,
): SamplePreparationAlkalinity => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep('Volume of sample', 'ml'),
    createStep('Dilution factor'),
    createStep('Volume of H2SO4', 'ml'),
    createStep('Strength of H2SO4', 'N'),
  ],
});

export const createCalculationAlkalinity = (
  index: number,
): CalculationAlkalinity => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationAlkalinity = (
  value: unknown,
): CalculationAlkalinity => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationAlkalinity>)
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
    calculationResultSecondary:
      typeof data.calculationResultSecondary === "number" ? data.calculationResultSecondary : null,
    acceptanceLimitMin:
      typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax:
      typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};
