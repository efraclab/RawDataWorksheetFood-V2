import type { ConfirmationTestConfig, CountGroupConfig, PlateCountConfig } from "./config";
import type {
  CalculationPlateCount,
  PlateCountStep,
  SamplePreparationPlateCount,
} from "./models";

export const DILUTION_LABELS = [
  "10⁰",
  "10⁻¹",
  "10⁻²",
  "10⁻³",
  "10⁻⁴",
  "10⁻⁵",
  "10⁻⁶",
  "10⁻⁷",
  "10⁻⁸",
  "10⁻⁹",
  "10⁻¹⁰",
] as const;

export const DILUTION_COUNT = DILUTION_LABELS.length;

export const STEP_NAMES = {
  nature: "Nature of the Sample",
  media: "Media Required",
  quantity: "Sample Quantity",
  method: "Test Method Followed",
  instrument: "Instrument Used",
  inoculation: "Inoculation Volume for Pour Plate (ml)",
  started: "Analysis Started",
  completed: "Analysis Completed",
  incubationTemp: "Incubation Temperature (°C)",
  incubationTime: "Incubation Time (Hours)",
  blank: "Blank",
} as const;

export const getColumnCount = (config: PlateCountConfig): number =>
  Math.min(DILUTION_COUNT, Math.max(1, config.columnCount ?? DILUTION_COUNT));

export const getCountGroups = (config: PlateCountConfig): readonly CountGroupConfig[] =>
  config.countGroups ?? [];

const rowNames = (
  config: PlateCountConfig,
  onlyCounted: boolean,
  group?: CountGroupConfig,
): string[] => {
  const count = Math.max(1, config.replicateCount ?? 2);
  const prefix = group ? `${group.label}: ` : "";
  const build = (suffix: string) =>
    Array.from({ length: count }, (_, i) => `${prefix}Replicate ${i + 1}${suffix}`);
  const points = config.timePoints;
  if (!points || points.length === 0) return build("");
  return points
    .filter((p) => !onlyCounted || p.counted)
    .flatMap((p) => build(` (${p.label})`));
};

/** Every dilution-grid row, in display order (or one group's rows). */
export const getReplicateNames = (
  config: PlateCountConfig,
  group?: CountGroupConfig,
): string[] => {
  if (group) return rowNames(config, false, group);
  const groups = getCountGroups(config);
  return groups.length > 0
    ? groups.flatMap((g) => rowNames(config, false, g))
    : rowNames(config, false);
};

/** Only the rows that enter the formula (or one group's rows). */
export const getCountedReplicateNames = (
  config: PlateCountConfig,
  group?: CountGroupConfig,
): string[] => {
  if (group) return rowNames(config, true, group);
  const groups = getCountGroups(config);
  return groups.length > 0
    ? groups.flatMap((g) => rowNames(config, true, g))
    : rowNames(config, true);
};

export const PLATE_PREFIX = "Plate Count: ";

export const getPlateTimes = (config: PlateCountConfig): string[] =>
  config.timePoints && config.timePoints.length > 0
    ? config.timePoints.map((p) => p.label)
    : [""];

export const getPlateRecordNames = (config: PlateCountConfig): string[] => {
  const pr = config.plateRecords;
  if (!pr) return [];
  const names: string[] = [];
  for (let r = 1; r <= pr.replicates; r += 1) {
    for (let p = 1; p <= pr.plates; p += 1) {
      names.push(`${PLATE_PREFIX}Replicate ${r} / Plate ${p}`);
    }
  }
  return names;
};

const plateCellCount = (config: PlateCountConfig): number =>
  (config.plateRecords?.columnLabels.length ?? 0) * getPlateTimes(config).length;

/** One-line text of a plate row for the print report. Empty cells are left out. */
export const summarizePlates = (
  plates: readonly string[] | undefined,
  config: PlateCountConfig,
): string => {
  const columns = config.plateRecords?.columnLabels ?? [];
  const times = getPlateTimes(config);
  const parts: string[] = [];
  (plates ?? []).forEach((cell, i) => {
    const value = String(cell ?? "").trim();
    if (value === "") return;
    const column = columns[Math.floor(i / times.length)] ?? "";
    const time = times[i % times.length] ?? "";
    parts.push(`${column}${time ? ` ${time}` : ""}: ${value}`);
  });
  return parts.join("; ");
};

const normalizeList = (value: unknown, length: number): string[] => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) =>
    source[i] === null || source[i] === undefined ? "" : String(source[i]),
  );
};

export const getStepNames = (config: PlateCountConfig) => ({
  ...STEP_NAMES,
  incubationTemp: config.incubationTempLabel ?? STEP_NAMES.incubationTemp,
  incubationTime: config.incubationTimeLabel ?? STEP_NAMES.incubationTime,
  inoculation: config.inoculationLabel ?? STEP_NAMES.inoculation,
});

export const CONFIRM_PREFIX = "Confirmation: ";

export const CONFIRM_FIELDS: ReadonlyArray<readonly [string, string]> = [
  ["started", "Analysis Started"],
  ["completed", "Analysis Completed"],
  ["media", "Media/Reagent"],
  ["colony", "Colony Characteristics"],
  ["temp", "Incubation Temperature (°C)"],
  ["time", "Time (Hours)"],
  ["sample", "Observation (Sample)"],
  ["positive", "Observation (+ve control)"],
  ["blank", "Observation (Blank)"],
];

export const getExtraSteps = (
  config: PlateCountConfig,
): Array<{ name: string; value: string }> =>
  (config.extraTextSteps ?? []).map((e) =>
    typeof e === "string" ? { name: e, value: "" } : { name: e.name, value: e.value ?? "" },
  );

export const getConfirmationName = (test: ConfirmationTestConfig): string =>
  `${CONFIRM_PREFIX}${test.name}`;

/** One-line text of a confirmation row for the print report. Empty fields are left out. */
export const summarizeConfirm = (confirm: Record<string, string> | undefined): string =>
  CONFIRM_FIELDS.map(([key, label]) => ({ label, value: String(confirm?.[key] ?? "").trim() }))
    .filter((x) => x.value !== "")
    .map((x) => `${x.label}: ${x.value}`)
    .join("; ");

const createConfirm = (test: ConfirmationTestConfig): Record<string, string> => ({
  started: "",
  completed: "",
  media: test.media ?? "",
  colony: test.colony ?? "",
  temp: test.temp ?? "",
  time: test.time ?? "",
  sample: "",
  positive: test.positive ?? "",
  blank: "",
});

const normalizeConfirm = (
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

export const PLATE_COUNT_FORMULA =
  "(Total no. of colonies × Dilution factor) / Replication factor";

/**
 * One-line text of a replicate row for the print report, e.g.
 * "10⁻¹: TNTC; 10⁻³: 10; 10⁻⁴: 2". Empty cells are left out.
 */
export const summarizeCounts = (counts: readonly string[] | undefined): string =>
  (counts ?? [])
    .map((cell, i) => ({ cell: String(cell ?? "").trim(), label: DILUTION_LABELS[i] }))
    .filter((x) => x.cell !== "" && x.label !== undefined)
    .map((x) => `${x.label}: ${x.cell}`)
    .join("; ");

const createId = (index: number) => Date.now() + index;

const emptyCounts = (length: number): string[] =>
  Array.from({ length }, () => "");

const normalizeCounts = (value: unknown, length: number): string[] => {
  const source = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) =>
    source[i] === null || source[i] === undefined ? "" : String(source[i]),
  );
};

const createStep = (
  name: string,
  extra: Partial<PlateCountStep> = {},
): PlateCountStep => ({
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

export function createSampleSteps(config: PlateCountConfig): PlateCountStep[] {
  const names = getStepNames(config);
  return [
    createStep(names.nature),
    createStep(names.media, { value1: config.media }),
    createStep(names.quantity),
    createStep(names.method, { value1: config.method }),
    createStep(names.instrument),
    createStep(names.inoculation, { unit1: "ml" }),
    createStep(names.started),
    createStep(names.completed),
    createStep(names.incubationTemp, {
      value1: config.incubationTemp,
      unit1: config.incubationTempLabel ? "" : "°C",
    }),
    createStep(names.incubationTime, {
      value1: config.incubationTime,
      unit1: config.incubationTimeLabel ? "" : "h",
    }),
    createStep(names.blank, { value1: "Nil" }),
    ...getExtraSteps(config).map((e) => createStep(e.name, { value1: e.value })),
    ...getReplicateNames(config).map((name) =>
      createStep(name, { counts: emptyCounts(getColumnCount(config)) }),
    ),
    ...getPlateRecordNames(config).map((name) =>
      createStep(name, { plates: normalizeList([], plateCellCount(config)) }),
    ),
    ...(config.confirmationTests ?? []).map((test) =>
      createStep(getConfirmationName(test), { confirm: createConfirm(test) }),
    ),
  ];
}

export function createSamplePreparationPlateCount(
  config: PlateCountConfig,
  index: number,
): SamplePreparationPlateCount {
  return {
    id: createId(index),
    label: `Sample Preparation ${index + 1}`,
    steps: createSampleSteps(config),
  };
}

export function createCalculationPlateCount(
  config: PlateCountConfig,
  index: number,
): CalculationPlateCount {
  return {
    id: createId(index),
    label: `Calculation ${index + 1}`,
    selectedSamplePreparationLabel: null,
    formula: PLATE_COUNT_FORMULA,
    replicationFactor: config.replicationFactor,
    dilutionFactor: config.dilutionFactor,
    totalColonies: null,
    resultBreakdown: "",
    calculationResult: null,
    calculationResultUnit: config.resultUnit,
  };
}

export function restoreCalculationPlateCount(
  config: PlateCountConfig,
  value: unknown,
  index = 0,
): CalculationPlateCount {
  const source =
    value && typeof value === "object"
      ? (value as Partial<CalculationPlateCount>)
      : {};

  return {
    ...createCalculationPlateCount(config, index),
    ...source,
    id: typeof source.id === "number" ? source.id : createId(index),
    label:
      typeof source.label === "string" ? source.label : `Calculation ${index + 1}`,
  };
}

export function restoreSamplePreparationPlateCount(
  config: PlateCountConfig,
  value: unknown,
  index = 0,
): SamplePreparationPlateCount {
  const created = createSamplePreparationPlateCount(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationPlateCount>;
  const raw: PlateCountStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, PlateCountStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, PlateCountStep]),
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
        ...(d.counts ? { counts: normalizeCounts(r?.counts, d.counts.length) } : {}),
        ...(d.confirm ? { confirm: normalizeConfirm(d.confirm, r?.confirm) } : {}),
        ...(d.plates ? { plates: normalizeList(r?.plates, d.plates.length) } : {}),
      };
    }),
  };
}