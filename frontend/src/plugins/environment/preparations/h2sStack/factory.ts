import type { CalculationH2SStack } from "./models/CalculationH2SStack";
import type { SamplePreparationH2SStack, SamplePreparationH2SStackStep } from "./models/SamplePreparationH2SStack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationH2SStack = (index: number): SamplePreparationH2SStack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Volume of iodine solution consumed", value1: "", unit1: "ml", logBookID: "" },
    { name: "Normality of iodine solution", value1: "", unit1: "", logBookID: "" },
    { name: "Volume of air sample passed", value1: "", unit1: "l", logBookID: "" },
    { name: "Dryness factor calculated from barometric pressure and temperature", value1: "", unit1: "", logBookID: "" },
    { name: "Barometric pressure", value1: "", unit1: "", logBookID: "" },
    { name: "Aqueous tension", value1: "", unit1: "", logBookID: "" },
  ],
});

export const createCalculationH2SStack = (index: number): CalculationH2SStack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "ppm v/v",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationH2SStack = (value: unknown): CalculationH2SStack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationH2SStack> : {};
  return {
    id: typeof data.id === "number" ? data.id : Date.now(),
    label: typeof data.label === "string" ? data.label : "Calculation 1",
    selectedSamplePreparationLabel: typeof data.selectedSamplePreparationLabel === "string"
      ? data.selectedSamplePreparationLabel : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit: typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : "ppm v/v",
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};

export const restoreSamplePreparationH2SStack = (value: unknown, index: number): SamplePreparationH2SStack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationH2SStack>;
  const defaults = createSamplePreparationH2SStack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationH2SStackStep[] : [];
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
