import type { CalculationHexavalentChromium } from "./models/CalculationHexavalentChromium";
import type {
  SamplePreparationHexavalentChromium,
  SamplePreparationHexavalentChromiumStep,
} from "./models/SamplePreparationHexavalentChromium";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

const createStep = (
  name: string,
  unit1 = "",
): SamplePreparationHexavalentChromiumStep => ({
  name,
  value1: "",
  unit1,
  logBookID: "",
});

export const createSamplePreparationHexavalentChromium = (
  index: number,
): SamplePreparationHexavalentChromium => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Abs", ""),
    createStep("DF", ""),
    createStep("M", ""),
    createStep("C", ""),
  ],
});

export const createCalculationHexavalentChromium = (
  index: number,
): CalculationHexavalentChromium => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/L",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationHexavalentChromium = (
  value: unknown,
): CalculationHexavalentChromium => {
  const source =
    value && typeof value === "object" && "data" in value
      ? (value as { data?: unknown }).data
      : value;
  const data =
    source && typeof source === "object"
      ? (source as Partial<CalculationHexavalentChromium>)
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
