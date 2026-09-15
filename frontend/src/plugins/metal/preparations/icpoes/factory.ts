import type { CalculationIcpOes } from "./models/CalculationIcpOes";
import type {
  SamplePreparationIcpOes,
  SamplePreparationIcpOesStep,
} from "./models/SamplePreparationIcpOes";

const createId = (index: number) => Date.now() + index;

const createStep = (
  name: string,
  unit1: string,
): SamplePreparationIcpOesStep => ({
  name,
  value1: "",
  unit1,
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createCalculationIcpOes(index: number): CalculationIcpOes {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,

    sw1: null,
    sw1Unit: "g",
    v1: null,
    v1Unit: "ml",
    v2: null,
    v2Unit: "ml",
    v3: null,
    v3Unit: "ml",

    v4: null,
    v5: null,
    v6: null,
    v7: null,

    instrumentConcentrationSample: "",
    instrumentConcentrationSampleUnit: "ppm",

    instrumentConcentrationBlank: "",
    instrumentConcentrationBlankUnit: "ppm",

    acceptanceLimitMin: "",
    acceptanceLimitMax: "",

    calculationResult: null,
    calculationResultUnit: "mg/Kg",
  };
}

export function createSamplePreparationIcpOes(
  index: number,
): SamplePreparationIcpOes {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: [
      createStep("Instrument Concentration (Sample)", "ppm"),
      createStep("Instrument Concentration (Blank)", "ppm"),
      createStep("Sample Weight (SW1)", "g"),
      createStep("Volume Makeup (V1)", "ml"),
      createStep("Dilution Factor 1 (V2)", "ml"),
      createStep("Dilution Factor 2 (V3)", "ml"),
    ],
  };
}

export function restoreCalculationIcpOes(
  value: unknown,
  index = 0,
): CalculationIcpOes {
  const source =
    value && typeof value === "object"
      ? (value as Partial<CalculationIcpOes> & {
          sw?: number | string | null;
        })
      : {};

  const created = createCalculationIcpOes(index);

  return {
    ...created,
    ...source,

    sw1: source.sw1 ?? source.sw ?? created.sw1,
    sw1Unit:
      typeof source.sw1Unit === "string" && source.sw1Unit.trim()
        ? source.sw1Unit
        : "g",

    v1Unit:
      typeof source.v1Unit === "string" && source.v1Unit.trim()
        ? source.v1Unit
        : "ml",
    v2Unit:
      typeof source.v2Unit === "string" && source.v2Unit.trim()
        ? source.v2Unit
        : "ml",
    v3Unit:
      typeof source.v3Unit === "string" && source.v3Unit.trim()
        ? source.v3Unit
        : "ml",

    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,

    calculationResultUnit:
      typeof source.calculationResultUnit === "string"
        ? source.calculationResultUnit
        : "mg/Kg",

    instrumentConcentrationSampleUnit:
      typeof source.instrumentConcentrationSampleUnit === "string"
        ? source.instrumentConcentrationSampleUnit
        : "ppm",

    instrumentConcentrationBlankUnit:
      typeof source.instrumentConcentrationBlankUnit === "string"
        ? source.instrumentConcentrationBlankUnit
        : "ppm",
  };
}

/**
 * Restores both the current six-step format and the immediately previous
 * V2 format:
 *
 * Old:
 *   Weighing
 *   1st Dilution
 *   2nd Dilution
 *   3rd Dilution
 *   4th Dilution
 *   Filtration
 *
 * New:
 *   Instrument Concentration (Sample)
 *   Instrument Concentration (Blank)
 *   Sample Weight (SW1)
 *   Volume Makeup (V1)
 *   Dilution Factor 1 (V2)
 *   Dilution Factor 2 (V3)
 */
export function restoreSamplePreparationIcpOes(
  value: unknown,
  index = 0,
): SamplePreparationIcpOes {
  const created = createSamplePreparationIcpOes(index);

  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationIcpOes>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];

  const hasNewNames = rawSteps.some(
    (step) =>
      typeof step?.name === "string" &&
      step.name === "Instrument Concentration (Sample)",
  );

  if (hasNewNames) {
    return {
      ...created,
      ...source,
      id: typeof source.id === "number" ? source.id : created.id,
      label: typeof source.label === "string" ? source.label : created.label,
      steps: created.steps.map((defaultStep, stepIndex) => {
        const rawStep = rawSteps[stepIndex];

        return {
          ...defaultStep,
          ...(rawStep ?? {}),
          name: defaultStep.name,
          unit1:
            typeof rawStep?.unit1 === "string" && rawStep.unit1.trim()
              ? rawStep.unit1
              : defaultStep.unit1,
        };
      }),
    };
  }

  const oldByName = new Map(
    rawSteps
      .filter((step): step is SamplePreparationIcpOesStep =>
        Boolean(step && typeof step.name === "string"),
      )
      .map((step) => [step.name.trim().toLowerCase(), step]),
  );

  const oldByIndex = rawSteps;

  const findOld = (name: string, indexFallback: number) =>
    oldByName.get(name.toLowerCase()) ?? oldByIndex[indexFallback];

  const mapOldStep = (
    defaultStep: SamplePreparationIcpOesStep,
    oldStep: SamplePreparationIcpOesStep | undefined,
  ): SamplePreparationIcpOesStep => ({
    ...defaultStep,
    value1: oldStep?.value1 ?? "",
    unit1: oldStep?.unit1 || defaultStep.unit1,
    value2: oldStep?.value2 ?? "",
    unit2: oldStep?.unit2 ?? "",
    value3: oldStep?.value3 ?? "",
    unit3: oldStep?.unit3 ?? "",
    logBookID: oldStep?.logBookID ?? "",
  });

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: [
      // The previous V2 format did not store instrument concentrations
      // inside the preparation. Keep these blank; they are entered in the
      // calculation section.
      { ...created.steps[0] },
      { ...created.steps[1] },

      mapOldStep(
        created.steps[2],
        findOld("Sample Weight (SW1)", 0) ??
          findOld("Weighing", 0),
      ),
      mapOldStep(
        created.steps[3],
        findOld("Volume Makeup (V1)", 1) ??
          findOld("1st Dilution", 1),
      ),
      mapOldStep(
        created.steps[4],
        findOld("Dilution Factor 1 (V2)", 2) ??
          findOld("2nd Dilution", 2),
      ),
      mapOldStep(
        created.steps[5],
        findOld("Dilution Factor 2 (V3)", 3) ??
          findOld("3rd Dilution", 3),
      ),
    ],
  };
}
