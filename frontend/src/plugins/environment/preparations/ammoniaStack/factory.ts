import type { CalculationAmmoniaStack } from "./models/CalculationAmmoniaStack";
import type { SamplePreparationAmmoniaStack, SamplePreparationAmmoniaStackStep } from "./models/SamplePreparationAmmoniaStack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationAmmoniaStack = (index: number): SamplePreparationAmmoniaStack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "mg of ammonia equivalent to 1 ml of 0.02 N sulphuric acid", value1: "0.34", unit1: "", logBookID: "" },
    { name: "0.02 N sulphuric acid used for sample", value1: "", unit1: "ml", logBookID: "" },
    { name: "0.02 N sulphuric acid used for blank", value1: "", unit1: "ml", logBookID: "" },
    { name: "Factor of 0.02 N sulphuric Acid", value1: "", unit1: "", logBookID: "" },
    { name: "Volume of dry gas sample", value1: "", unit1: "m\u00b3", logBookID: "" },
  ],
});

export const createCalculationAmmoniaStack = (index: number): CalculationAmmoniaStack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/Nm\u00b3",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationAmmoniaStack = (value: unknown): CalculationAmmoniaStack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationAmmoniaStack> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "mg/Nm\u00b3",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};

export const restoreSamplePreparationAmmoniaStack = (value: unknown, index: number): SamplePreparationAmmoniaStack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationAmmoniaStack>;
  const defaults = createSamplePreparationAmmoniaStack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationAmmoniaStackStep[] : [];
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
