import type { CalculationSO2Stack } from "./models/CalculationSO2Stack";
import type { SamplePreparationSO2Stack, SamplePreparationSO2StackStep } from "./models/SamplePreparationSO2Stack";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSamplePreparationSO2Stack = (index: number): SamplePreparationSO2Stack => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: [
    { name: "Volume of barium perchlorate titrant used for the sample", value1: "", unit1: "ml", logBookID: "" },
    { name: "Volume of barium perchlorate titrant used for the blank", value1: "", unit1: "ml", logBookID: "" },
    { name: "Normality of barium perchlorate titrate", value1: "", unit1: "", logBookID: "" },
    { name: "Total solution, volume of SO\u2082", value1: "", unit1: "ml", logBookID: "" },
    { name: "Volume of sample aliquot titrated", value1: "", unit1: "ml", logBookID: "" },
    { name: "Volume of gas sampled through the dry gas meter", value1: "", unit1: "m\u00b3", logBookID: "" },
  ],
});

export const createCalculationSO2Stack = (index: number): CalculationSO2Stack => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: "mg/Nm\u00b3",
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

export const restoreCalculationSO2Stack = (value: unknown): CalculationSO2Stack => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data : value;
  const data = source && typeof source === "object" ? source as Partial<CalculationSO2Stack> : {};
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

export const restoreSamplePreparationSO2Stack = (value: unknown, index: number): SamplePreparationSO2Stack => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SamplePreparationSO2Stack>;
  const defaults = createSamplePreparationSO2Stack(index);
  const saved = Array.isArray(source.steps) ? source.steps as SamplePreparationSO2StackStep[] : [];
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
