/**
 * Plate-count formula, taken from the lab Excel sheets:
 *   Result (cfu/g) = SUM(all colony counts) x Dilution factor / Replication factor
 *
 * Excel's SUM ignores text, so TNTC, NA, <1 and Nil count as 0.
 * Only plain numbers are summed.
 */

/** Decimal places kept in the result. Excel shows full precision; change here if the lab wants whole numbers. */
export const RESULT_DECIMALS = 2;

const COUNT_PATTERN = /^\d+(\.\d+)?$/;

export const parseCount = (value: unknown): number => {
  const text = String(value ?? "").trim();
  return COUNT_PATTERN.test(text) ? Number(text) : 0;
};

export function sumCounts(
  rows: ReadonlyArray<ReadonlyArray<string | undefined>>,
): number {
  let total = 0;
  for (const row of rows) {
    for (const cell of row) total += parseCount(cell);
  }
  return total;
}

export interface PlateCountCalculationInput {
  rows: ReadonlyArray<ReadonlyArray<string | undefined>>;
  replicationFactor: number | string | null | undefined;
  dilutionFactor: number | string | null | undefined;
}

export interface PlateCountCalculationResult {
  success: boolean;
  result: number | null;
  total: number;
  error?: string;
}

const toNumber = (value: unknown): number | null =>
  value === null || value === undefined || String(value).trim() === ""
    ? null
    : Number(value);

export function calculatePlateCount(
  input: PlateCountCalculationInput,
): PlateCountCalculationResult {
  const total = sumCounts(input.rows);
  const replication = toNumber(input.replicationFactor);
  const dilution = toNumber(input.dilutionFactor);

  if (
    replication === null ||
    dilution === null ||
    !Number.isFinite(replication) ||
    !Number.isFinite(dilution)
  ) {
    return {
      success: false,
      result: null,
      total,
      error: "Replication factor and dilution factor are required and must be numeric",
    };
  }

  if (replication <= 0 || dilution <= 0) {
    return {
      success: false,
      result: null,
      total,
      error: "Replication factor and dilution factor must be greater than 0",
    };
  }

  const result = (total * dilution) / replication;

  return Number.isFinite(result)
    ? { success: true, result: Number(result.toFixed(RESULT_DECIMALS)), total }
    : { success: false, result: null, total, error: "Unable to calculate result" };
}

export interface PlateCountGroupInput {
  key: string;
  label: string;
  rows: ReadonlyArray<ReadonlyArray<string | undefined>>;
}

export interface PlateCountGroupsResult {
  success: boolean;
  /** Sum of the group results. */
  result: number | null;
  /** Colonies counted across all groups. */
  total: number;
  groups: Array<{ key: string; label: string; colonies: number; result: number | null }>;
  error?: string;
}

/**
 * Each group is calculated as SUM(counts) x Dilution factor / Replication factor
 * and the results are added (Excel: Yeast + Mould = Total).
 */
export function calculatePlateCountGroups(input: {
  groups: readonly PlateCountGroupInput[];
  replicationFactor: number | string | null | undefined;
  dilutionFactor: number | string | null | undefined;
}): PlateCountGroupsResult {
  const calculated = input.groups.map((g) => ({
    key: g.key,
    label: g.label,
    ...calculatePlateCount({
      rows: g.rows,
      replicationFactor: input.replicationFactor,
      dilutionFactor: input.dilutionFactor,
    }),
  }));

  const groups = calculated.map((g) => ({
    key: g.key,
    label: g.label,
    colonies: g.total,
    result: g.result,
  }));
  const total = groups.reduce((sum, g) => sum + g.colonies, 0);
  const failed = calculated.find((g) => !g.success);

  if (failed) {
    return { success: false, result: null, total, groups, error: failed.error };
  }

  const sum = groups.reduce((acc, g) => acc + (g.result ?? 0), 0);
  return { success: true, result: Number(sum.toFixed(RESULT_DECIMALS)), total, groups };
}