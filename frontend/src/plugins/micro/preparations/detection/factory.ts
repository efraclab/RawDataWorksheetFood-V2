import type { DetectionConfig, DetectionRowConfig } from "./config";
import type {
  DetectionResultValue,
  DetectionRowValues,
  DetectionStep,
  SamplePreparationDetection,
} from "./models";

export const DETECTION_STEP_NAMES = {
  nature: "Nature of the Sample",
  media: "Media Required",
  quantity: "Sample Quantity",
  method: "Test Method Followed",
  instrument: "Instrument Used",
  started: "Analysis Started",
  completed: "Analysis Completed",
  observations: "Observations",
  result: "Result",
} as const;

/** Columns of every stage table, in display order. */
export const DETECTION_ROW_FIELDS: ReadonlyArray<readonly [string, string]> = [
  ["characteristics", "Colony/Growth Characteristics"],
  ["media", "Media/Reagent"],
  ["started", "Analysis Started"],
  ["completed", "Analysis Completed"],
  ["temp", "Incubation Temp (°C)"],
  ["time", "Time"],
  ["sample", "Observation (Sample)"],
  ["reference", "Reference Culture / +ve Control"],
  ["blank", "Blank"],
];

export const DATE_FIELDS: ReadonlySet<string> = new Set(["started", "completed"]);

/** Suggestions offered in the observation cells. The analyst can still type anything. */
export const OBSERVATION_OPTIONS = [
  "Turbidity",
  "No turbidity",
  "No growth",
  "Typical colony",
  "Atypical colony",
  "No colony",
  "Positive",
  "Negative",
] as const;

export const RESULT_OPTIONS = ["Absent", "Present"] as const;

/** Header text fields as { name, value } (value = default). */
export const getHeaderSteps = (config: DetectionConfig): Array<{ name: string; value: string }> =>
  (config.headerTextSteps ?? []).map((h) =>
    typeof h === "string" ? { name: h, value: "" } : { name: h.name, value: h.value ?? "" },
  );

export const getResultOptions = (config: DetectionConfig): readonly string[] =>
  config.resultOptions && config.resultOptions.length > 0 ? config.resultOptions : RESULT_OPTIONS;

/**
 * Unique step name for every row: "<section title> › <row name>".
 * A repeated name in the same section gets " (2)", " (3)"...
 */
export function getRowStepNames(config: DetectionConfig): Array<{
  sectionIndex: number;
  row: DetectionRowConfig;
  stepName: string;
}> {
  const used = new Map<string, number>();
  const out: Array<{ sectionIndex: number; row: DetectionRowConfig; stepName: string }> = [];
  config.sections.forEach((section, sectionIndex) => {
    for (const row of section.rows) {
      const base = `${section.title} › ${row.name}`;
      const seen = (used.get(base) ?? 0) + 1;
      used.set(base, seen);
      out.push({ sectionIndex, row, stepName: seen === 1 ? base : `${base} (${seen})` });
    }
  });
  return out;
}

/** One-line text of a stage row for the print report. Empty cells are left out. */
export const summarizeRow = (row: DetectionRowValues | undefined): string =>
  DETECTION_ROW_FIELDS.map(([key, label]) => ({ label, value: String(row?.[key] ?? "").trim() }))
    .filter((x) => x.value !== "")
    .map((x) => `${x.label}: ${x.value}`)
    .join("; ");

/** e.g. "Absent in 25 g". */
export const summarizeResult = (result: DetectionResultValue | undefined): string => {
  const status = String(result?.status ?? "").trim();
  const per = String(result?.per ?? "").trim();
  if (!status) return "";
  return per ? `${status} in ${per}` : status;
};

const createRow = (row: DetectionRowConfig): DetectionRowValues => ({
  characteristics: row.characteristics ?? "",
  media: row.media ?? "",
  started: "",
  completed: "",
  temp: row.temp ?? "",
  time: row.time ?? "",
  sample: "",
  reference: "",
  blank: "",
});

const createStep = (name: string, extra: Partial<DetectionStep> = {}): DetectionStep => ({
  name,
  value1: "",
  unit1: "",
  value2: "",
  unit2: "",
  value3: "",
  unit3: "",
  logBookID: "",
  ...extra,
});

export function createDetectionSteps(config: DetectionConfig): DetectionStep[] {
  const names = DETECTION_STEP_NAMES;
  const result: DetectionResultValue = { status: "", per: config.resultPer ?? "" };
  return [
    createStep(names.nature),
    createStep(names.media, { value1: config.media }),
    createStep(names.quantity),
    createStep(names.method, { value1: config.method }),
    createStep(names.instrument),
    createStep(names.started),
    createStep(names.completed),
    ...getHeaderSteps(config).map((h) => createStep(h.name, { value1: h.value })),
    ...getRowStepNames(config).map(({ row, stepName }) => {
      const values = createRow(row);
      return createStep(stepName, { row: values, value1: summarizeRow(values) });
    }),
    createStep(names.observations),
    ...(config.resultTextSteps ?? []).map((name) => createStep(name)),
    createStep(names.result, { result, value1: summarizeResult(result) }),
  ];
}

const createId = (index: number) => Date.now() + index;

export function createSamplePreparationDetection(
  config: DetectionConfig,
  index: number,
): SamplePreparationDetection {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: createDetectionSteps(config),
  };
}

const normalizeRecord = (
  defaults: Record<string, string>,
  saved: unknown,
): Record<string, string> => {
  const source = saved && typeof saved === "object" ? (saved as Record<string, unknown>) : {};
  const out: Record<string, string> = {};
  for (const key of Object.keys(defaults)) {
    const value = source[key];
    out[key] = value === null || value === undefined ? (defaults[key] ?? "") : String(value);
  }
  return out;
};

export function restoreSamplePreparationDetection(
  config: DetectionConfig,
  value: unknown,
  index = 0,
): SamplePreparationDetection {
  const created = createSamplePreparationDetection(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationDetection>;
  const raw: DetectionStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, DetectionStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, DetectionStep]),
  );

  return {
    ...created,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((d) => {
      const r = byName.get(d.name.toLowerCase());
      if (d.row) {
        const row = normalizeRecord(d.row, r?.row);
        return { ...d, logBookID: r?.logBookID ?? d.logBookID, row, value1: summarizeRow(row) };
      }
      if (d.result) {
        const result = normalizeRecord(
          { status: d.result.status, per: d.result.per },
          r?.result,
        ) as unknown as DetectionResultValue;
        return { ...d, result, value1: summarizeResult(result) };
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

/** The Result step's status, or "" when not entered. */
export const getResultStatus = (preparation: SamplePreparationDetection): string =>
  String(
    preparation.steps.find((s) => s.name === DETECTION_STEP_NAMES.result)?.result?.status ?? "",
  ).trim();
