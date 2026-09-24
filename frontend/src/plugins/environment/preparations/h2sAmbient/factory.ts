import type { CalculationH2SAmbient } from "./models/CalculationH2SAmbient";
import type { SamplePreparationH2SAmbient, SamplePreparationH2SAmbientStep } from "./models/SamplePreparationH2SAmbient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const createStep = (name: string, unit1 = ""): SamplePreparationH2SAmbientStep => ({
  name, value1: "", unit1, logBookID: "",
});

export const createSamplePreparationH2SAmbient = (index: number): SamplePreparationH2SAmbient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Microgram of hydrogen sulphide in the sample"),
    createStep("Litres of air sampled"),
  ],
});

export const createCalculationH2SAmbient = (index: number): CalculationH2SAmbient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationH2SAmbient = (value: unknown): CalculationH2SAmbient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationH2SAmbient> : {};
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
