import type { FormulaConfig, FormulaInputs, FormulaOutput, FormulaTableConfig } from "./config";
import type { FormulaStep, SamplePreparationFormula } from "./models";

export const FORMULA_STEP_NAMES = {
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

/** Decimal places kept in the result. */
export const FORMULA_DECIMALS = 2;

export const getRowStepName = (table: FormulaTableConfig, row: string): string =>
  `${table.title} › ${row}`;

const NUMBER = /^-?\d+(\.\d+)?$/;
const toNumber = (value: unknown): number | null => {
  const text = String(value ?? "").trim();
  return NUMBER.test(text) ? Number(text) : null;
};

export const summarizeCells = (table: FormulaTableConfig, cells: readonly string[] | undefined): string =>
  table.columns
    .map((column, i) => ({ column, value: String(cells?.[i] ?? "").trim() }))
    .filter((x) => x.value !== "")
    .map((x) => `${x.column}: ${x.value}`)
    .join("; ");

export function buildInputs(config: FormulaConfig, preparation: SamplePreparationFormula): FormulaInputs {
  const stepOf = (name: string) => preparation.steps.find((s) => s.name === name);
  const tableOf = (key: string) => config.tables.find((t) => t.key === key);
  const fieldOf = (key: string) => config.fields?.find((f) => f.key === key);
  return {
    cell: (table, row, column) => {
      const t = tableOf(table);
      const r = t?.rows[row];
      if (!t || r === undefined) return null;
      return toNumber(stepOf(getRowStepName(t, r))?.cells?.[column]);
    },
    sum: (table, columns) => {
      const t = tableOf(table);
      if (!t) return 0;
      let total = 0;
      for (const r of t.rows) {
        const cells = stepOf(getRowStepName(t, r))?.cells ?? [];
        cells.forEach((v, i) => {
          if (columns && !columns.includes(i)) return;
          total += toNumber(v) ?? 0;
        });
      }
      return total;
    },
    field: (key) => {
      const f = fieldOf(key);
      return f ? toNumber(stepOf(f.label)?.value1) : null;
    },
  };
}

export function runFormula(config: FormulaConfig, preparation: SamplePreparationFormula): FormulaOutput {
  try {
    const out = config.compute(buildInputs(config, preparation));
    if (out.value === null || !Number.isFinite(out.value)) return { ...out, value: null };
    return { ...out, value: Number(out.value.toFixed(FORMULA_DECIMALS)) };
  } catch {
    return { value: null, error: "Unable to calculate result" };
  }
}

export const summarizeOutput = (config: FormulaConfig, out: FormulaOutput): string =>
  [
    out.value !== null ? `${config.resultLabel}: ${out.value}${config.unit ? ` ${config.unit}` : ""}` : "",
    ...(out.details ?? []),
  ]
    .filter((x) => x !== "")
    .join("; ");

const createStep = (name: string, extra: Partial<FormulaStep> = {}): FormulaStep => ({
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

export function createFormulaSteps(config: FormulaConfig): FormulaStep[] {
  const n = FORMULA_STEP_NAMES;
  return [
    createStep(n.nature),
    createStep(n.media, { value1: config.media }),
    createStep(n.quantity),
    createStep(n.method, { value1: config.method }),
    createStep(n.instrument),
    createStep(n.started),
    createStep(n.completed),
    ...(config.headerTextSteps ?? []).map((h) => createStep(h.name, { value1: h.value ?? "" })),
    ...config.tables.flatMap((t) =>
      t.rows.map((r) => createStep(getRowStepName(t, r), { cells: t.columns.map(() => "") })),
    ),
    ...(config.fields ?? []).map((f) => createStep(f.label, { value1: f.defaultValue ?? "" })),
    createStep(n.observations),
    createStep(n.result),
  ];
}

const createId = (index: number) => Date.now() + index;

export const createSamplePreparationFormula = (
  config: FormulaConfig,
  index: number,
): SamplePreparationFormula => ({
  id: createId(index),
  label: `Sample Preparation ${index + 1}`,
  steps: createFormulaSteps(config),
});

/** Recomputes the Result step's value1 from the current inputs. */
export function withResult(config: FormulaConfig, preparation: SamplePreparationFormula): SamplePreparationFormula {
  const text = summarizeOutput(config, runFormula(config, preparation));
  return {
    ...preparation,
    steps: preparation.steps.map((s) =>
      s.name === FORMULA_STEP_NAMES.result ? { ...s, value1: text } : s,
    ),
  };
}

export function restoreSamplePreparationFormula(
  config: FormulaConfig,
  value: unknown,
  index = 0,
): SamplePreparationFormula {
  const created = createSamplePreparationFormula(config, index);
  if (!value || typeof value !== "object") return created;

  const source = value as Partial<SamplePreparationFormula>;
  const raw: FormulaStep[] = Array.isArray(source.steps) ? source.steps : [];
  const byName = new Map<string, FormulaStep>(
    raw
      .filter((s) => s && typeof s.name === "string")
      .map((s) => [s.name.trim().toLowerCase(), s] as [string, FormulaStep]),
  );
  const tableOfStep = new Map<string, FormulaTableConfig>();
  for (const t of config.tables) for (const r of t.rows) tableOfStep.set(getRowStepName(t, r), t);

  const restored: SamplePreparationFormula = {
    ...created,
    id: typeof source.id === "number" ? source.id : created.id,
    label: typeof source.label === "string" ? source.label : created.label,
    steps: created.steps.map((d) => {
      const r = byName.get(d.name.toLowerCase());
      const table = tableOfStep.get(d.name);
      if (table && d.cells) {
        const src = Array.isArray(r?.cells) ? r.cells : [];
        const cells = d.cells.map((_, i) => (src[i] == null ? "" : String(src[i])));
        return { ...d, cells, value1: summarizeCells(table, cells) };
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
  return withResult(config, restored);
}
