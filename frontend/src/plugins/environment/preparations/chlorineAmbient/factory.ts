import type { CalculationChlorineAmbient } from "./models/CalculationChlorineAmbient";
import type { SamplePreparationChlorineAmbient, SamplePreparationChlorineAmbientStep } from "./models/SamplePreparationChlorineAmbient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);
const createStep = (name: string, unit1 = ""): SamplePreparationChlorineAmbientStep => ({
  name, value1: "", unit1, logBookID: "",
});

export const createSamplePreparationChlorineAmbient = (index: number): SamplePreparationChlorineAmbient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    createStep("Amount of chlorine found", "µg"),
    createStep("Volume of air sampled", "m³"),
  ],
});

export const createCalculationChlorineAmbient = (index: number): CalculationChlorineAmbient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "µg/m³",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationChlorineAmbient = (value: unknown): CalculationChlorineAmbient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationChlorineAmbient> : {};
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
