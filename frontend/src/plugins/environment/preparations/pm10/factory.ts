import type { CalculationPM10 } from "./models/CalculationPM10";
import type { SamplePreparationPM10, SamplePreparationPM10Step } from "./models/SamplePreparationPM10";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const createStep = (name: string, unit1 = ""): SamplePreparationPM10Step => ({
  name, value1: "", unit1, logBookID: "",
});

export const createSamplePreparationPM10 = (index: number): SamplePreparationPM10 => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Filter Paper Number"),
    createStep("Average Flow Rate", "m³/min"),
    createStep("Total Sampling Time", "min"),
    createStep("Initial weight of Filter", "gm"),
    createStep("Final weight of Filter", "gm"),
  ],
});

export const createCalculationPM10 = (index: number): CalculationPM10 => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationPM10 = (value: unknown): CalculationPM10 => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationPM10> : {};
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
