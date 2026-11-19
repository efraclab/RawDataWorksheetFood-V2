import type {
  SimpleEnvironmentCalculation,
  SimpleEnvironmentConfig,
  SimpleEnvironmentSamplePreparation,
} from "./types";

const createId = (index: number) => Date.now() + index + Math.floor(Math.random() * 1000);

export const createSimpleSamplePreparation = (
  config: SimpleEnvironmentConfig,
  index: number,
): SimpleEnvironmentSamplePreparation => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: config.fields.map((field) => ({
    name: field.name,
    value1: field.defaultValue ?? "",
    unit1: field.unit,
    logBookID: "",
  })),
});

export const createSimpleCalculation = (
  config: SimpleEnvironmentConfig,
  index: number,
): SimpleEnvironmentCalculation => ({
  id: createId(index),
  label: `Calculation ${index + 1}`,
  selectedSamplePreparationLabel: null,
  calculationResult: null,
  calculationResultUnit: config.resultUnit,
  acceptanceLimitMin: "",
  acceptanceLimitMax: "",
});

const normalize = (value: unknown) =>
  String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");

export const restoreSimpleSamplePreparation = (
  config: SimpleEnvironmentConfig,
  value: unknown,
  index: number,
): SimpleEnvironmentSamplePreparation => {
  const source = (value && typeof value === "object" ? value : {}) as Partial<SimpleEnvironmentSamplePreparation>;
  const defaults = createSimpleSamplePreparation(config, index);
  const saved = Array.isArray(source.steps) ? source.steps : [];

  const steps = defaults.steps.map((defaultStep) => {
    const restored = saved.find((item) => normalize(item?.name) === normalize(defaultStep.name));
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

export const restoreSimpleCalculation = (
  config: SimpleEnvironmentConfig,
  value: unknown,
  index = 0,
): SimpleEnvironmentCalculation => {
  const source = value && typeof value === "object" && "data" in value
    ? (value as { data?: unknown }).data
    : value;
  const data = (source && typeof source === "object" ? source : {}) as Partial<SimpleEnvironmentCalculation>;

  return {
    ...createSimpleCalculation(config, index),
    ...data,
    id: typeof data.id === "number" ? data.id : createSimpleCalculation(config, index).id,
    label: typeof data.label === "string" ? data.label : `Calculation ${index + 1}`,
    selectedSamplePreparationLabel:
      typeof data.selectedSamplePreparationLabel === "string"
        ? data.selectedSamplePreparationLabel
        : null,
    calculationResult: typeof data.calculationResult === "number" ? data.calculationResult : null,
    calculationResultUnit:
      typeof data.calculationResultUnit === "string" ? data.calculationResultUnit : config.resultUnit,
    acceptanceLimitMin: typeof data.acceptanceLimitMin === "string" ? data.acceptanceLimitMin : "",
    acceptanceLimitMax: typeof data.acceptanceLimitMax === "string" ? data.acceptanceLimitMax : "",
  };
};

export const parseUnknown = (value: unknown): unknown => {
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return value; }
};

export const normalizeType = (value: unknown) => {
  const normalized = String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  // ENV legacy persistence contains the misspelling "fluride" in a few
  // preparation/calculation types, while newer records may use the
  // correctly spelled "fluoride". Treat both spellings as the same type
  // during restore so Save Draft/Refresh cannot make a preparation vanish.
  return normalized.replace(/fluride/g, "fluoride");
};

export const normalizeDate = (value: unknown): string | null =>
  typeof value === "string" && value.trim() ? value : null;
