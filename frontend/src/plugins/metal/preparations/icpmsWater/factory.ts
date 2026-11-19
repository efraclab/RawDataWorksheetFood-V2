import type { CalculationIcpmsWater } from "./models/CalculationIcpmsWater";
import type {
  SamplePreparationIcpmsWater,
  SamplePreparationIcpmsWaterStep,
} from "./models/SamplePreparationIcpmsWater";

const createId = (index: number) => Date.now() + index;

const createStep = (
  name: string,
  unit1: string,
): SamplePreparationIcpmsWaterStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createCalculationIcpmsWater(index: number): CalculationIcpmsWater {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    v1: null,
    v1Unit: "ml",
    v2: null,
    v2Unit: "ml",
    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppb",
    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppb",
    acceptanceLimitMin: "",
    acceptanceLimitMax: "",
    calculationResult: null,
    calculationResultUnit: "mg/L",
  };
}

export function createSamplePreparationIcpmsWater(index: number): SamplePreparationIcpmsWater {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep("Instrument Concentration (Sample)", "ppb"),
      createStep("Instrument Concentration (Blank)", "ppb"),
      createStep("Dilution Factor 1 (V1)", "ml"),
      createStep("Dilution Factor 2 (V2)", "ml"),
    ],
  };
}

export function restoreCalculationIcpmsWater(value: unknown, index = 0): CalculationIcpmsWater {
  const source = value && typeof value === "object"
    ? (value as Partial<CalculationIcpmsWater>)
    : {};
  const created = createCalculationIcpmsWater(index);
  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    v1Unit: typeof source.v1Unit === "string" && source.v1Unit.trim() ? source.v1Unit : "ml",
    v2Unit: typeof source.v2Unit === "string" && source.v2Unit.trim() ? source.v2Unit : "ml",
    instrumentConcentrationSampleUnit:
      typeof source.instrumentConcentrationSampleUnit === "string" && source.instrumentConcentrationSampleUnit.trim()
        ? source.instrumentConcentrationSampleUnit : "ppb",
    instrumentConcentrationBlankUnit:
      typeof source.instrumentConcentrationBlankUnit === "string" && source.instrumentConcentrationBlankUnit.trim()
        ? source.instrumentConcentrationBlankUnit : "ppb",
    calculationResultUnit:
      typeof source.calculationResultUnit === "string" && source.calculationResultUnit.trim()
        ? source.calculationResultUnit : "mg/L",
  };
}

export function restoreSamplePreparationIcpmsWater(value: unknown, index = 0): SamplePreparationIcpmsWater {
  const created = createSamplePreparationIcpmsWater(index);
  if (!value || typeof value !== "object") return created;
  const source = value as Partial<SamplePreparationIcpmsWater>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const oldByName = new Map(rawSteps.filter((s): s is SamplePreparationIcpmsWaterStep => !!s && typeof s.name === "string").map(s => [s.name.trim().toLowerCase(), s]));

  const find = (names: string[], fallback: number) => {
    for (const name of names) {
      const found = oldByName.get(name.toLowerCase());
      if (found) return found;
    }
    return rawSteps[fallback];
  };

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: [
      { ...created.steps[0], ...(find(["Instrument Concentration (Sample)"], 0) ?? {}) },
      { ...created.steps[1], ...(find(["Instrument Concentration (Blank)"], 1) ?? {}) },
      { ...created.steps[2], ...(find(["Dilution Factor 1 (V1)", "Dilution Factor 1", "1st Dilution"], 2) ?? {}) },
      { ...created.steps[3], ...(find(["Dilution Factor 2 (V2)", "Dilution Factor 2", "2nd Dilution"], 3) ?? {}) },
    ].map((step, i) => ({ ...step, name: created.steps[i].name })),
  };
}
