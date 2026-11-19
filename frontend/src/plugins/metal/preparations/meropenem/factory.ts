import type { CalculationMeropenem } from "./models/CalculationMeropenem";
import type { SamplePreparationMeropenem, SamplePreparationMeropenemStep } from "./models/SamplePreparationMeropenem";

const createId = (index: number) => Date.now() + index;

const createStep = (name: string, unit1 = "", unit2 = ""): SamplePreparationMeropenemStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2,
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createCalculationMeropenem(index: number): CalculationMeropenem {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    v1: null,
    v1Unit: "ml",
    v2Factor: null,
    v2Volume: null,
    v2VolumeUnit: "ml",
    v3Factor: null,
    v3Volume: null,
    v3VolumeUnit: "ml",
    v4Factor: null,
    v4Volume: null,
    v4VolumeUnit: "ml",
    avgWeight: null,
    avgWeightUnit: "g",
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
    calculationResultUnit: "%",
  };
}

export function createSamplePreparationMeropenem(index: number): SamplePreparationMeropenem {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep("Instrument Concentration (Sample)", "ppm"),
      createStep("Instrument Concentration (Blank)", "ppm"),
      createStep("Makeup Volume (V1)", "", "ml"),
      createStep("Dilution Factor 2 (V2)", "", "ml"),
      createStep("Label Claim"),
    ],
  };
}

export function restoreCalculationMeropenem(value: unknown, index = 0): CalculationMeropenem {
  const source = value && typeof value === "object" ? (value as Partial<CalculationMeropenem>) : {};
  return {
    ...createCalculationMeropenem(index),
    ...source,
    id: typeof source.id === "number" ? source.id : createId(index),
    label: typeof source.label === "string" ? source.label : `Calculation ${index + 1}`,
  };
}

export function restoreSamplePreparationMeropenem(value: unknown, index = 0): SamplePreparationMeropenem {
  const created = createSamplePreparationMeropenem(index);
  if (!value || typeof value !== "object") return created;
  const source = value as Partial<SamplePreparationMeropenem>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map(
    rawSteps
      .filter((step): step is SamplePreparationMeropenemStep => Boolean(step && typeof step.name === "string"))
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
        value1: raw?.value1 ?? "",
        value2: raw?.value2 ?? "",
        value3: raw?.value3 ?? "",
        unit1: raw?.unit1 ?? defaultStep.unit1,
        unit2: raw?.unit2 ?? defaultStep.unit2,
      };
    }),
  };
}
