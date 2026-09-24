import type { CalculationNO2Stack } from "./models/CalculationNO2Stack";
import type { SamplePreparationNO2Stack, SamplePreparationNO2StackStep } from "./models/SamplePreparationNO2Stack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationNO2Stack = (index: number): SamplePreparationNO2Stack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Absorbance of sample", value1: "", unit1: "", logBookID: "" },
    { name: "Absorbance of blank", value1: "", unit1: "", logBookID: "" },
    { name: "Dilution factor", value1: "", unit1: "", logBookID: "" },
    { name: "Spectrophotometer calibration factor", value1: "", unit1: "", logBookID: "" },
    { name: "50/25 the aliquot factor", value1: "2", unit1: "", logBookID: "" },
    { name: "Sample volume at standard condition", value1: "", unit1: "", logBookID: "" },
  ],
});

export const createCalculationNO2Stack = (index: number): CalculationNO2Stack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/Nm\u00b3",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationNO2Stack = (value: unknown): CalculationNO2Stack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationNO2Stack> : {};
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

export const restoreSamplePreparationNO2Stack = (value: unknown, index: number): SamplePreparationNO2Stack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationNO2Stack>;
  const defaults = createSamplePreparationNO2Stack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationNO2StackStep[] : [];
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
