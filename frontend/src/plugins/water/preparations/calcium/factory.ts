import type { CalculationCalcium } from "./models/CalculationCalcium";
import type {
  SamplePreparationCalcium,
  SamplePreparationCalciumStep,
} from "./models/SamplePreparationCalcium";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationCalciumStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationCalcium = (
  index: number,
): SamplePreparationCalcium => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep('Volume of sample', 'ml'),
    createStep('Dilution factor'),
    createStep('Volume of EDTA', 'ml'),
    createStep('Strength of EDTA', 'M'),
  ],
});

export const createCalculationCalcium = (
  index: number,
): CalculationCalcium => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationCalcium = (
  value: unknown,
): CalculationCalcium => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationCalcium>)
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
