import type { ResidueConfig, ResidueStepConfig } from "./config";
import type {
  CalculationResidue,
  ResidueAnalyte,
  ResidueStep,
  SamplePreparationResidue,
} from "./models";
import { RESIDUE_FORMULA } from "./calculation";

export const BLANK = "___";
export const RESULT_UNIT = "µg/kg";

export interface ResidueStepView {
  /** Saved name: "<Section>: <Step>". */
  fullName: string;
  /** Label shown in the card. */
  label: string;
  defaultValue: string;
  template?: string;
}

const toView = (sectionTitle: string, step: ResidueStepConfig): ResidueStepView => {
  const s = typeof step === "string" ? { name: step } : step;
  return {
    fullName: `${sectionTitle}: ${s.name}`,
    label: s.name,
    defaultValue: s.value ?? "",
    ...(s.template ? { template: s.template } : {}),
  };
};

export const getSections = (config: ResidueConfig) =>
  config.sections.map((section) => ({
    title: section.title,
    steps: section.steps.map((step) => toView(section.title, step)),
  }));

const allSteps = (config: ResidueConfig) => getSections(config).flatMap((s) => s.steps);

export const blankCount = (template: string) => template.split(BLANK).length - 1;

/** Fills each "___" with its value. Empty blanks stay as "___". */
export const fillTemplate = (template: string, blanks: readonly string[] | undefined) => {
  const parts = template.split(BLANK);
  return parts
    .map((part, i) => {
      if (i === parts.length - 1) return part;
      const value = String(blanks?.[i] ?? "").trim();
      return `${part}${value === "" ? BLANK : value}`;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
};

/** The template text the print report shows in value1. Empty when no blank is filled. */
export const summarizeBlanks = (template: string, blanks: readonly string[] | undefined) =>
  (blanks ?? []).some((b) => String(b ?? "").trim() !== "") ? fillTemplate(template, blanks) : "";

export const getTemplate = (config: ResidueConfig, stepName: string) =>
  allSteps(config).find((s) => s.fullName === stepName)?.template;

const normalizeList = (value: unknown, length: number): string[] => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) =>
    source[i] === null || source[i] === undefined ? "" : String(source[i]),
  );
};

const createId = (index: number) => Date.now() + index;

const createStep = (view: ResidueStepView): ResidueStep => ({
  name: view.fullName,
  value1: view.defaultValue,
  unit1: "",
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
  ...(view.template ? { blanks: normalizeList([], blankCount(view.template)) } : {}),
});

export function createSamplePreparationResidue(
  config: ResidueConfig,
  index: number,
): SamplePreparationResidue {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: allSteps(config).map(createStep),
  };
}

export function restoreSamplePreparationResidue(
  config: ResidueConfig,
  value: unknown,
  index = 0,
): SamplePreparationResidue {
  const created = createSamplePreparationResidue(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationResidue>;
  const raw: ResidueStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, ResidueStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, ResidueStep]),
  );

  return {
    ...created,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((d) => {
      const r = byName.get(d.name.toLowerCase());
      if (d.blanks) {
        // value1 of a template step is only the print summary; the blanks are the data.
        return { ...d, logBookID: r?.logBookID ?? d.logBookID, blanks: normalizeList(r?.blanks, d.blanks.length) };
      }
      return {
        ...d,
        value1: r?.value1 ?? d.value1,
        value2: r?.value2 ?? d.value2,
        value3: r?.value3 ?? d.value3,
        unit1: r?.unit1 ?? d.unit1,
        unit2: r?.unit2 ?? d.unit2,
        unit3: r?.unit3 ?? d.unit3,
        logBookID: r?.logBookID ?? d.logBookID,
      };
    }),
  };
}

/** Dilution factor typed in the sample preparation (the "Dilution Factor" step), or "". */
export const getPreparationDilutionFactor = (preparation: SamplePreparationResidue | null) =>
  String(
    preparation?.steps.find((s) => s.name.toLowerCase().endsWith(": dilution factor"))?.value1 ?? "",
  ).trim();

export const createAnalyte = (name = ""): ResidueAnalyte => ({
  name,
  concentration: "",
  resultUgKg: null,
  resultMgKg: null,
});

export function createCalculationResidue(
  config: ResidueConfig,
  index: number,
): CalculationResidue {
  const names = config.analytes && config.analytes.length > 0 ? config.analytes : [""];
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    formula: RESIDUE_FORMULA,
    dilutionFactor: "",
    analytes: names.map((n) => createAnalyte(n)),
    resultBreakdown: "",
    calculationResult: null,
    calculationResultUnit: RESULT_UNIT,
  };
}

const toNullableNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

export function restoreCalculationResidue(
  config: ResidueConfig,
  value: unknown,
  index = 0,
): CalculationResidue {
  const created = createCalculationResidue(config, index);
  const source =
    value && typeof value === "object" ? (value as Partial<CalculationResidue>) : {};

  const analytes = Array.isArray(source.analytes)
    ? source.analytes.map((a) => {
        const x = (a ?? {}) as Partial<ResidueAnalyte>;
        return {
          name: String(x.name ?? ""),
          concentration: String(x.concentration ?? ""),
          resultUgKg: toNullableNumber(x.resultUgKg),
          resultMgKg: toNullableNumber(x.resultMgKg),
        };
      })
    : created.analytes;

  return {
    ...created,
    ...source,
    analytes: analytes.length > 0 ? analytes : created.analytes,
    formula: RESIDUE_FORMULA,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
  };
}

/** One line per calculation for the print report, e.g. "B1: 2 µg/kg (0.002 mg/kg); B2: ..." */
export const summarizeAnalytes = (analytes: readonly ResidueAnalyte[]) =>
  analytes
    .filter((a) => a.resultUgKg !== null)
    .map(
      (a) =>
        `${a.name.trim() || "Result"}: ${a.resultUgKg} µg/kg (${a.resultMgKg} mg/kg)`,
    )
    .join("; ");