import type { CalculationOrs } from "./models/CalculationOrs";
import type { SamplePreparationOrs, SamplePreparationOrsStep } from "./models/SamplePreparationOrs";

const createId = (index: number) => Date.now() + index;

const createStep = (name: string, unit1: string, unit2 = ""): SamplePreparationOrsStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2,
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createCalculationOrs(index: number): CalculationOrs {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    sw1: null,
    sw1Unit: "g",
    v1: null,
    v1Unit: "ml",
    v2Factor: null,
    v2Volume: null,
    v2VolumeUnit: "ml",
    v3Factor: null,
    v3Volume: null,
    v3VolumeUnit: "ml",
    sachetWeight: null,
    sachetWeightUnit: "g",
    molecularWeight: null,
    labelClaimBase: null,
    labelClaimValue: null,
    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppm",
    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppm",
    acceptanceLimitMin: "",
    acceptanceLimitMax: "",
    calculationResult: null,
    calculationResultUnit: "% of L.C.",
  };
}

export function createSamplePreparationOrs(index: number): SamplePreparationOrs {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep("Instrument Concentration (Sample)", "ppm"),
      createStep("Instrument Concentration (Blank)", "ppm"),
      createStep("Sample Weight (SW1)", "g"),
      createStep("Volume Makeup (V1)", "ml"),
      createStep("Dilution Factor 1 (V2)", "", "ml"),
      createStep("Dilution Factor 2 (V3)", "", "ml"),
      createStep("Sachet Weight (Avg)", "g"),
      createStep("Molecular Weight", "-"),
      createStep("Label Claim", "", ""),
    ],
  };
}

export function restoreCalculationOrs(value: unknown, index = 0): CalculationOrs {
  const source = value && typeof value === "object" ? (value as Partial<CalculationOrs> & Record<string, unknown>) : {};
  const created = createCalculationOrs(index);

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    sw1Unit: typeof source.sw1Unit === "string" && source.sw1Unit.trim() ? source.sw1Unit : "g",
    v1Unit: typeof source.v1Unit === "string" && source.v1Unit.trim() ? source.v1Unit : "ml",
    v2VolumeUnit: typeof source.v2VolumeUnit === "string" && source.v2VolumeUnit.trim() ? source.v2VolumeUnit : "ml",
    v3VolumeUnit: typeof source.v3VolumeUnit === "string" && source.v3VolumeUnit.trim() ? source.v3VolumeUnit : "ml",
    sachetWeightUnit: typeof source.sachetWeightUnit === "string" && source.sachetWeightUnit.trim() ? source.sachetWeightUnit : "g",
    instrumentConcentrationSampleUnit: typeof source.instrumentConcentrationSampleUnit === "string" ? source.instrumentConcentrationSampleUnit : "ppm",
    instrumentConcentrationBlankUnit: typeof source.instrumentConcentrationBlankUnit === "string" ? source.instrumentConcentrationBlankUnit : "ppm",
    calculationResultUnit: typeof source.calculationResultUnit === "string" ? source.calculationResultUnit : "% of L.C.",
  };
}

export function restoreSamplePreparationOrs(value: unknown, index = 0): SamplePreparationOrs {
  const created = createSamplePreparationOrs(index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationOrs>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map(
    rawSteps
      .filter((step): step is SamplePreparationOrsStep => Boolean(step && typeof step.name === "string"))
      .map((step) => [step.name.trim().toLowerCase(), step]),
  );

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((defaultStep, stepIndex) => {
      const raw = byName.get(defaultStep.name.toLowerCase()) ?? rawSteps[stepIndex];
      return {
        ...defaultStep,
        ...(raw ?? {}),
        name: defaultStep.name,
        unit1: raw?.unit1 ?? defaultStep.unit1,
        unit2: raw?.unit2 ?? defaultStep.unit2,
        value1: raw?.value1 ?? "",
        value2: raw?.value2 ?? "",
        value3: raw?.value3 ?? "",
      };
    }),
  };
}
