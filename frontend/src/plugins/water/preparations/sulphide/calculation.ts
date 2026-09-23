const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface SulphideCalculationInput {
  abs: unknown;
  df: unknown;
  m: unknown;
  c: unknown;
}

export interface SulphideCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/**
 * Excel formula:
 * Concentration (mg/L) = ((Abs + C) * DF) / M
 */
export function calculateSulphide(
  input: SulphideCalculationInput,
): SulphideCalculationResult {
  const abs = numberValue(input.abs);
  const df = numberValue(input.df);
  const m = numberValue(input.m);
  const c = numberValue(input.c);

  if ([abs, df, m, c].some((value) => value === null)) {
    return { success: false, result: null, error: "All Sulphide values are required." };
  }

  if (df! <= 0 || m === 0) {
    return { success: false, result: null, error: "DF must be greater than zero and M cannot be zero." };
  }

  const result = ((abs! + c!) * df!) / m!;
  return Number.isFinite(result)
    ? { success: true, result: Math.trunc(result * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate Sulphide concentration." };
}
