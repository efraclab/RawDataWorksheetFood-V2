import type { CalculationIcpms } from "./models/CalculationIcpms";
import type {
  SamplePreparationIcpms,
  SamplePreparationIcpmsStep,
} from "./models/SamplePreparationIcpms";

const createId = (index: number) => Date.now() + index;

export function createCalculationIcpms(index: number): CalculationIcpms {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    sw1: null,
    v1: null,
    v2: null,
    v3: null,
    v4: null,
    v5: null,
    v6: null,
    v7: null,
    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppb",
    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppb",
    acceptanceLimitMin: "",
    acceptanceLimitMax: "",
    calculationResult: null,
    calculationResultUnit: "mg/Kg",
  };
}

export function createSamplePreparationIcpms(
  index: number,
): SamplePreparationIcpms {
  const step = (
    name: string,
    unit1?: string,
  ): SamplePreparationIcpmsStep => ({
    name,
    value1: "",
    unit1,
    value2: "",
    unit2: "",
    value3: "",
    unit3: "",
    logBookID: "",
  });

  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      step("Weighing", "g"),
      step("1st Dilution", "ml"),
      step("2nd Dilution", "ml"),
      step("3rd Dilution", "ml"),
      step("4th Dilution", "ml"),
      step("Filtration", "micron"),
    ],
  };
}

export function restoreCalculationIcpms(
  value: unknown,
  index = 0,
): CalculationIcpms {
  const source =
    value && typeof value === "object"
      ? (value as Partial<CalculationIcpms>)
      : {};

  const created = createCalculationIcpms(index);

  return {
    ...created,
    ...source,
    // Older payloads used `sw`; V2 keeps the Excel/V1 worksheet name `sw1`.
    sw1:
      source.sw1 ??
      (source as Partial<CalculationIcpms> & { sw?: number | string | null }).sw ??
      created.sw1,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    calculationResultUnit:
      typeof source.calculationResultUnit === "string"
        ? source.calculationResultUnit
        : "mg/Kg",
    instrumentConcentrationSampleUnit:
      typeof source.instrumentConcentrationSampleUnit === "string"
        ? source.instrumentConcentrationSampleUnit
        : "ppb",
    instrumentConcentrationBlankUnit:
      typeof source.instrumentConcentrationBlankUnit === "string"
        ? source.instrumentConcentrationBlankUnit
        : "ppb",
  };
}

export function restoreSamplePreparationIcpms(
  value: unknown,
  index = 0,
): SamplePreparationIcpms {
  const created = createSamplePreparationIcpms(index);

  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationIcpms>;

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: Array.isArray(source.steps)
      ? source.steps.map((rawStep) => ({
          name: typeof rawStep?.name === "string" ? rawStep.name : "",
          value1: rawStep?.value1 ?? "",
          unit1: rawStep?.unit1 ?? "",
          value2: rawStep?.value2 ?? "",
          unit2: rawStep?.unit2 ?? "",
          value3: rawStep?.value3 ?? "",
          unit3: rawStep?.unit3 ?? "",
          logBookID: rawStep?.logBookID ?? "",
        }))
      : created.steps,
  };
}
