import type { CalculationZptoShampoo } from "./models/CalculationZptoShampoo";
import type { SamplePreparationZptoShampoo, SamplePreparationZptoShampooStep } from "./models/SamplePreparationZptoShampoo";
const createId = (index: number) => Date.now() + index;
const createStep = (name: string, unit1 = "", unit2 = ""): SamplePreparationZptoShampooStep => ({ name, value1: "", unit1, value2: "", unit2, value3: "", unit3: "", logBookID: "" });
export function createCalculationZptoShampoo(index: number): CalculationZptoShampoo {
  return { id: createId(index), label: `Calculation ${index + 1}`, selectedSamplePreparationLabel: null,
    sw1: null, sw1Unit: "g", v1: null, v1Unit: "ml", v2Factor: null, v2Volume: null, v2VolumeUnit: "ml",
    weightEmptyPycnometer: null, weightPycnometerSample: null, weightPycnometerWater: null, specificGravity: null,
    molecularWeight1: null, molecularWeight2: null, labelClaim: null,
    instrumentConcentrationSample: "", instrumentConcentrationSampleUnit: "ppm", instrumentConcentrationBlank: "", instrumentConcentrationBlankUnit: "ppm",
    acceptanceLimitMin: "", acceptanceLimitMax: "", calculationResult: null, calculationResultUnit: "% of L.C.", };
}
export function createSamplePreparationZptoShampoo(index: number): SamplePreparationZptoShampoo {
  return { id: createId(index), label: `Sample Preparation ${index + 1}`, steps: [
    createStep("Instrument Concentration (Sample)", "ppm"), createStep("Instrument Concentration (Blank)", "ppm"),
    createStep("Sample Weight (SW1)", "g"), createStep("Volume Makeup (V1)", "ml"), createStep("Dilution Factor 1 (V2)", "", "ml"),
    createStep("Weight of Empty Pycnometer (W1)", "g"), createStep("Weight of Pycnometer with Sample (W2)", "g"), createStep("Weight of Pycnometer with Water (W3)", "g"),
    createStep("Specific Gravity", ""), createStep("Label Claim", ""), createStep("Molecular Weight", "g/mol"),
  ]};
}
export function restoreCalculationZptoShampoo(value: unknown, index = 0): CalculationZptoShampoo {
  const source = value && typeof value === "object" ? (value as Partial<CalculationZptoShampoo> & Record<string, unknown>) : {};
  const created = createCalculationZptoShampoo(index);
  return { ...created, ...source, id: typeof source.id === "number" ? source.id : created.id, label: typeof source.label === "string" ? source.label : created.label };
}
export function restoreSamplePreparationZptoShampoo(value: unknown, index = 0): SamplePreparationZptoShampoo {
  const created = createSamplePreparationZptoShampoo(index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationZptoShampoo>;
  const rawSteps = Array.isArray(source.steps) ? source.steps : [];
  const typedSteps = rawSteps.filter(
    (step): step is SamplePreparationZptoShampooStep =>
      Boolean(step && typeof step === "object" && typeof step.name === "string"),
  );
  const byName = new Map(
    typedSteps.map((step) => [step.name.trim().toLowerCase(), step] as const),
  );

  // Migrate the previous two-step representation into the single Excel-style
  // step: Molecular Weight -> Value 1 and Value 2.
  if (!byName.has("molecular weight")) {
    const oldMw1 = byName.get("molecular weight 1 (mw1)");
    const oldMw2 = byName.get("molecular weight 2 (mw2)");
    if (oldMw1 || oldMw2) {
      byName.set("molecular weight", {
        name: "Molecular Weight",
        value1: oldMw1?.value1 ?? "",
        value2: oldMw2?.value1 ?? oldMw2?.value2 ?? "",
        unit1: oldMw1?.unit1 ?? "g/mol",
        unit2: oldMw2?.unit2 ?? "g/mol",
      });
    }
  }

  return {
    ...created,
    ...source,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((defaultStep, stepIndex) => {
      const raw = byName.get(defaultStep.name.toLowerCase()) ?? typedSteps[stepIndex];
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
