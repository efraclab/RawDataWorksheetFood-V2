const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface TSSCalculationInput {
  initialWeight: unknown;
  volume: unknown;
  finalWeight: unknown;
}

export interface TSSCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/**
 * Excel formula: TSS (mg/L) = ((Final wt. of dish+FP − Initial wt. of dish+FP) × 1000000) / Volume of sample
 */
export function calculateTSS(
  input: TSSCalculationInput,
): TSSCalculationResult {
  const initialWeight = numberValue(input.initialWeight);
  const volume = numberValue(input.volume);
  const finalWeight = numberValue(input.finalWeight);

  if (initialWeight === null || volume === null || finalWeight === null) {
    return { success: false, result: null, error: "All TSS values are required." };
  }
  if (volume <= 0 || finalWeight < initialWeight) {
    return { success: false, result: null, error: "Volume must be greater than zero and final weight cannot be less than initial weight." };
  }
  const result = ((finalWeight - initialWeight) * 1000000) / volume;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate TSS result." };
}
