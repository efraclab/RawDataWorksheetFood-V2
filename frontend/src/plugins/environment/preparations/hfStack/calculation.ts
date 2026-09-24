const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface HFStackCalculationInput {
  v: unknown;
  ir: unknown;
  factor: unknown;
  df: unknown;
  vstd: unknown;
}

export interface HFStackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula used by each HF Stack section: C = (V × IR × Factor × DF) / (Vstd × 1000). */
export function calculateHFStack(input: HFStackCalculationInput): HFStackCalculationResult {
  const v = numberValue(input.v);
  const ir = numberValue(input.ir);
  const factor = numberValue(input.factor);
  const df = numberValue(input.df);
  const vstd = numberValue(input.vstd);

  if (v === null || ir === null || factor === null || df === null || vstd === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }

  if (ir < 0) return { success: false, result: null, error: "Instrument Reading cannot be negative." };
  if (v <= 0) return { success: false, result: null, error: "Volume of Absorbence must be greater than zero." };
  if (factor <= 0) return { success: false, result: null, error: "Factor must be greater than zero." };
  if (df <= 0) return { success: false, result: null, error: "Dilution Factor must be greater than zero." };
  if (vstd <= 0) return { success: false, result: null, error: "Volume of Gas Drawn must be greater than zero." };

  const result = (v * ir * factor * df) / (vstd * 1000);

  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate HF Stack concentration." };
}
