import type { CalculationCarbonDisulphideAmbient } from "./models/CalculationCarbonDisulphideAmbient";
import type { SamplePreparationCarbonDisulphideAmbient, SamplePreparationCarbonDisulphideAmbientStep } from "./models/SamplePreparationCarbonDisulphideAmbient";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationCarbonDisulphideAmbient = (index: number): SamplePreparationCarbonDisulphideAmbient => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Mass of carbon disulphide", value1: "", unit1: "\u00b5g", logBookID: "" },
    { name: "Volume of air sampled", value1: "", unit1: "l", logBookID: "" },
  ],
});

export const createCalculationCarbonDisulphideAmbient = (index: number): CalculationCarbonDisulphideAmbient => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "\u00b5g/l",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationCarbonDisulphideAmbient = (value: unknown): CalculationCarbonDisulphideAmbient => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationCarbonDisulphideAmbient> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "\u00b5g/l",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};

export const restoreSamplePreparationCarbonDisulphideAmbient = (value: unknown, index: number): SamplePreparationCarbonDisulphideAmbient => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationCarbonDisulphideAmbient>;
  const defaults = createSamplePreparationCarbonDisulphideAmbient(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationCarbonDisulphideAmbientStep[] : [];
  const steps = defaults.steps.map((defaultStep) => {
    const restored = saved.find((item) =>
      String(item.name ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "") ===
      defaultStep.name.trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
    );
    return restored ? { ...defaultStep, ...restored } : defaultStep;
  });
  return {
    ...defaults,
    ...source,
    id: typeof source.id === "number" ? source.id : defaults.id,
    label: typeof source.label === "string" ? source.label : defaults.label,
    steps,
  };
};
