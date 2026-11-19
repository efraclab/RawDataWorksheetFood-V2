import type { CalculationPMStack } from "./models/CalculationPMStack";
import type { SamplePreparationPMStack, SamplePreparationPMStackStep } from "./models/SamplePreparationPMStack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationPMStack = (index: number): SamplePreparationPMStack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Thimble Number", value1: "", unit1: "", logBookID: "" },
    { name: "Volume of Gas (at 250C & 760 mmHg)", value1: "", unit1: "m\u00b3", logBookID: "" },
    { name: "Initial weight of Thimble", value1: "", unit1: "gm", logBookID: "" },
    { name: "Final weight of Thimble", value1: "", unit1: "gm", logBookID: "" },
  ],
});

export const createCalculationPMStack = (index: number): CalculationPMStack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/Nm\u00b3",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationPMStack = (value: unknown): CalculationPMStack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationPMStack> : {};
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

export const restoreSamplePreparationPMStack = (value: unknown, index: number): SamplePreparationPMStack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationPMStack>;
  const defaults = createSamplePreparationPMStack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationPMStackStep[] : [];
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
