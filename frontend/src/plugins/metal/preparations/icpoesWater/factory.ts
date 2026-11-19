import type { CalculationIcpOesWater } from "./models/CalculationIcpOesWater";
import type {
  SamplePreparationIcpOesWater,
  SamplePreparationIcpOesWaterStep,
} from "./models/SamplePreparationIcpOesWater";

const createId = (index: number) => Date.now() + index;

const createStep = (
  name: string,
  unit1: string,
): SamplePreparationIcpOesWaterStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createSamplePreparationIcpOesWater(index: number): SamplePreparationIcpOesWater {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep("Instrument Concentration (Sample)", "ppm"),
      createStep("Instrument Concentration (Blank)", "ppm"),
      createStep("Dilution Factor 1 (V1)", "ml"),
      createStep("Dilution Factor 2 (V2)", "ml"),
    ],
  };
}

export function createCalculationIcpOesWater(index: number): CalculationIcpOesWater {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppm",
    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppm",
    v1: null,
    v1Unit: "ml",
    v2: null,
    v2Unit: "ml",
    acceptanceLimitMin: "",
    acceptanceLimitMax: "",
    calculationResult: null,
    calculationResultUnit: "mg/L",
  };
}

export function restoreSamplePreparationIcpOesWater(value: unknown, index = 0): SamplePreparationIcpOesWater {
  const created = createSamplePreparationIcpOesWater(index);
  if (!value || typeof value !== "object") return created;
  const source = value as Partial<SamplePreparationIcpOesWater>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((defaultStep, stepIndex) => {
      const raw = rawSteps[stepIndex] as SamplePreparationIcpOesWaterStep | undefined;
      return {
        ...defaultStep,
        ...(raw ?? {}),
        name: defaultStep.name,
        unit1: typeof raw?.unit1 === "string" && raw.unit1.trim() ? raw.unit1 : defaultStep.unit1,
      };
    }),
  };
}

export function restoreCalculationIcpOesWater(value: unknown, index = 0): CalculationIcpOesWater {
  const created = createCalculationIcpOesWater(index);
  if (!value || typeof value !== "object") return created;
  const source = value as Partial<CalculationIcpOesWater>;
  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    instrumentConcentrationSampleUnit: source.instrumentConcentrationSampleUnit || "ppm",
    instrumentConcentrationBlankUnit: source.instrumentConcentrationBlankUnit || "ppm",
    v1Unit: source.v1Unit || "ml",
    v2Unit: source.v2Unit || "ml",
    calculationResultUnit: source.calculationResultUnit || "mg/L",
  };
}
