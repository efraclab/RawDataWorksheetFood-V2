import type { CalculationAasWater } from "./models/CalculationAasWater";
import type {
  SamplePreparationAasWater,
  SamplePreparationAasWaterStep,
} from "./models/SamplePreparationAasWater";

const createId = (index: number) => Date.now() + index;

const createStep = (
  name: string,
  unit1: string,
): SamplePreparationAasWaterStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createCalculationAasWater(index: number): CalculationAasWater {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,

    v1: null,
    v1Unit: "ml",
    v2: null,
    v2Unit: "ml",

    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppm",

    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppm",

    acceptanceLimitMin: "",
    acceptanceLimitMax: "",

    calculationResult: null,
    calculationResultUnit: "mg/L",
  };
}

export function createSamplePreparationAasWater(
  index: number,
): SamplePreparationAasWater {
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

export function restoreCalculationAasWater(
  value: unknown,
  index = 0,
): CalculationAasWater {
  const source =
    value && typeof value === "object"
      ? (value as Partial<CalculationAasWater>)
      : {};

  const created = createCalculationAasWater(index);

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    v1Unit:
      typeof source.v1Unit === "string" && source.v1Unit.trim()
        ? source.v1Unit
        : "ml",
    v2Unit:
      typeof source.v2Unit === "string" && source.v2Unit.trim()
        ? source.v2Unit
        : "ml",
    instrumentConcentrationSampleUnit:
      typeof source.instrumentConcentrationSampleUnit === "string" &&
      source.instrumentConcentrationSampleUnit.trim()
        ? source.instrumentConcentrationSampleUnit
        : "ppm",
    instrumentConcentrationBlankUnit:
      typeof source.instrumentConcentrationBlankUnit === "string" &&
      source.instrumentConcentrationBlankUnit.trim()
        ? source.instrumentConcentrationBlankUnit
        : "ppm",
    calculationResultUnit:
      typeof source.calculationResultUnit === "string" &&
      source.calculationResultUnit.trim()
        ? source.calculationResultUnit
        : "mg/L",
  };
}

/**
 * Restores the current four-step AAS (Water) format.
 *
 * The two concentration values and the two dilution values are stored in
 * Sample Preparation, matching the worksheet shown for AAS (Water).
 */
export function restoreSamplePreparationAasWater(
  value: unknown,
  index = 0,
): SamplePreparationAasWater {
  const created = createSamplePreparationAasWater(index);

  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationAasWater>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];

  const byName = new Map(
    rawSteps
      .filter((step): step is SamplePreparationAasWaterStep =>
        Boolean(step && typeof step.name === "string"),
      )
      .map((step) => [step.name.trim().toLowerCase(), step]),
  );

  const byIndex = rawSteps;

  const mapStep = (
    defaultStep: SamplePreparationAasWaterStep,
    sourceStep: SamplePreparationAasWaterStep | undefined,
  ): SamplePreparationAasWaterStep => ({
    ...defaultStep,
    ...(sourceStep ?? {}),
    name: defaultStep.name,
    unit1:
      typeof sourceStep?.unit1 === "string" && sourceStep.unit1.trim()
        ? sourceStep.unit1
        : defaultStep.unit1,
    value1: sourceStep?.value1 ?? "",
    value2: sourceStep?.value2 ?? "",
    unit2: sourceStep?.unit2 ?? "",
    value3: sourceStep?.value3 ?? "",
    unit3: sourceStep?.unit3 ?? "",
    logBookID: sourceStep?.logBookID ?? "",
  });

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((defaultStep, stepIndex) => {
      const aliases: Record<string, string[]> = {
        "instrument concentration (sample)": [
          "instrument concentration (sample)",
        ],
        "instrument concentration (blank)": [
          "instrument concentration (blank)",
        ],
        "dilution factor 1 (v1)": [
          "dilution factor 1 (v1)",
          "dilution factor 1",
          "volume makeup (v1)",
          "v1",
        ],
        "dilution factor 2 (v2)": [
          "dilution factor 2 (v2)",
          "dilution factor 2",
          "v2",
        ],
      };

      const names = aliases[defaultStep.name.toLowerCase()] ?? [];

      const sourceStep =
        names.map((name) => byName.get(name)).find(Boolean) ??
        byIndex[stepIndex];

      return mapStep(defaultStep, sourceStep);
    }),
  };
}