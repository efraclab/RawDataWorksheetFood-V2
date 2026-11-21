import type { GasTestConfig, GasTestKind } from "./config";
import type { CalculationGas, GasStep, SamplePreparationGas } from "./models";

/** Decimal places kept for calculated results. Change here if the lab wants fewer. */
export const RESULT_DECIMALS = 4;

export interface GasField {
  /** Symbol used in the formula, e.g. "W1". Empty for fields not used in the formula. */
  symbol: string;
  label: string;
  /** Pre-filled value. */
  value?: string;
  /** Number expected (shown with decimal keyboard). */
  numeric?: boolean;
}

export interface GasSection {
  title: string;
  fields: GasField[];
}

/** Raw-data fields per kind. Labels from the "Raw data for steps" and calculation sheets. */
const RAW_FIELDS: Record<GasTestKind, GasField[]> = {
  detectorTube: [
    { symbol: "", label: "No. of Strokes", numeric: true },
    { symbol: "DT", label: "Reading of Detector Tube (DT)", numeric: true },
  ],
  instrument: [{ symbol: "IR", label: "Instrument Reading (IR)", numeric: true }],
  observation: [{ symbol: "OV", label: "Observation Value (OV)", numeric: true }],
  nvr: [
    { symbol: "W1", label: "Pan Weight (W1)", numeric: true },
    { symbol: "W2", label: "Pan + Ice Weight (W2)", numeric: true },
    { symbol: "W3", label: "Weight of Pan after Heating (W3)", numeric: true },
  ],
  nvor: [
    { symbol: "W1", label: "Pan Weight (W1)", numeric: true },
    { symbol: "W2", label: "Pan + Ice Weight (W2)", numeric: true },
    { symbol: "I1", label: "Weight of Inorganic Residue (I1)", numeric: true },
    { symbol: "I2", label: "Weight of Organic Residue (I2)", numeric: true },
  ],
  text: [{ symbol: "OBS", label: "Observation" }],
};

export const FORMULAS: Record<GasTestKind, string> = {
  detectorTube: "Result = DT (reading of detector tube)",
  instrument: "Result = IR (instrument reading)",
  observation: "Result = OV (observation value)",
  nvr: "Result = (W3 − W1) / (W2 − W1)",
  nvor: "Result = (I2 − I1) / (W2 − W1)",
  text: "Result = Observation",
};

export const RAW_SECTION = "Raw Data";

export const getSections = (config: GasTestConfig): GasSection[] => [
  {
    title: "Test Details",
    fields: [
      { symbol: "", label: "Instrument", value: config.instrument },
      { symbol: "", label: "Method No (ISBT)", value: config.method },
    ],
  },
  {
    title: "Instrumental Run",
    fields: [
      { symbol: "", label: "Instrument Name" },
      { symbol: "", label: "Instrument ID" },
      { symbol: "", label: "Log Book ID" },
    ],
  },
  { title: RAW_SECTION, fields: RAW_FIELDS[config.kind] },
];

export const stepName = (section: string, label: string) => `${section}: ${label}`;

const createId = (index: number) => Date.now() + index;

const createStep = (name: string, value = ""): GasStep => ({
  name,
  value1: value,
  unit1: "",
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
});

export function createSamplePreparationGas(
  config: GasTestConfig,
  index: number,
): SamplePreparationGas {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: getSections(config).flatMap((s) =>
      s.fields.map((f) => createStep(stepName(s.title, f.label), f.value ?? "")),
    ),
  };
}

export function restoreSamplePreparationGas(
  config: GasTestConfig,
  value: unknown,
  index = 0,
): SamplePreparationGas {
  const created = createSamplePreparationGas(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationGas>;
  const raw: GasStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, GasStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, GasStep]),
  );

  return {
    ...created,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((d) => {
      const r = byName.get(d.name.toLowerCase());
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

/** Raw values of a preparation by symbol (W1, IR, DT, OBS...). */
export function getRawValues(
  config: GasTestConfig,
  preparation: SamplePreparationGas | null,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of RAW_FIELDS[config.kind]) {
    if (!f.symbol) continue;
    const name = stepName(RAW_SECTION, f.label);
    out[f.symbol] = String(preparation?.steps.find((s) => s.name === name)?.value1 ?? "").trim();
  }
  return out;
}

export const getRawFields = (config: GasTestConfig) =>
  RAW_FIELDS[config.kind].filter((f) => f.symbol);

export function createCalculationGas(config: GasTestConfig, index: number): CalculationGas {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    formula: FORMULAS[config.kind],
    resultBreakdown: "",
    calculationResult: null,
    calculationResultUnit: config.unit,
  };
}

export function restoreCalculationGas(
  config: GasTestConfig,
  value: unknown,
  index = 0,
): CalculationGas {
  const created = createCalculationGas(config, index);
  const source =
    value && typeof value === "object" ? (value as Partial<CalculationGas>) : {};
  return {
    ...created,
    ...source,
    formula: FORMULAS[config.kind],
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
  };
}

const toNumber = (v: string | undefined): number | null => {
  const t = String(v ?? "").trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

const round = (n: number) => Number(n.toFixed(RESULT_DECIMALS));

export interface GasCalculationResult {
  success: boolean;
  result: number | string | null;
  error?: string;
}

/** Applies the sheet formula for the test kind. */
export function calculateGas(
  config: GasTestConfig,
  values: Record<string, string>,
): GasCalculationResult {
  const fail = (error: string): GasCalculationResult => ({ success: false, result: null, error });

  if (config.kind === "text") {
    const obs = String(values.OBS ?? "").trim();
    return obs ? { success: true, result: obs } : fail("Observation is required");
  }

  const symbols = getRawFields(config).map((f) => f.symbol);
  const nums: Record<string, number> = {};
  for (const s of symbols) {
    const n = toNumber(values[s]);
    if (n === null) return fail(`${s} is required and must be a number`);
    nums[s] = n;
  }

  switch (config.kind) {
    case "detectorTube":
      return { success: true, result: round(nums.DT ?? 0) };
    case "instrument":
      return { success: true, result: round(nums.IR ?? 0) };
    case "observation":
      return { success: true, result: round(nums.OV ?? 0) };
    case "nvr":
    case "nvor": {
      const denominator = (nums.W2 ?? 0) - (nums.W1 ?? 0);
      if (denominator === 0) return fail("W2 − W1 must not be 0");
      const numerator =
        config.kind === "nvr"
          ? (nums.W3 ?? 0) - (nums.W1 ?? 0)
          : (nums.I2 ?? 0) - (nums.I1 ?? 0);
      return { success: true, result: round(numerator / denominator) };
    }
  }
  return fail("Unknown test type");
}

/** "W1 = 10; W2 = 20; W3 = 10.5" for the report. */
export const summarizeValues = (config: GasTestConfig, values: Record<string, string>) =>
  config.kind === "text"
    ? ""
    : getRawFields(config)
        .map((f) => `${f.symbol} = ${values[f.symbol] ?? ""}`)
        .join("; ");