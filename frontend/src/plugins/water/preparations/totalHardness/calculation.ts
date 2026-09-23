const numberValue = (value: unknown): number | null => { if (value === null || value === undefined || String(value).trim() === "") return null; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null; };

export interface TotalHardnessCalculationInput {
  sampleVolume: unknown;
  df: unknown;
  edtaVolume: unknown;
  strength: unknown;
}
export interface TotalHardnessCalculationResult { success: boolean; result: number | null; error?: string; }
export function calculateTotalHardness(input: TotalHardnessCalculationInput): TotalHardnessCalculationResult {
  const sampleVolume = numberValue(input.sampleVolume);
  const df = numberValue(input.df);
  const edtaVolume = numberValue(input.edtaVolume);
  const strength = numberValue(input.strength);
  if (sampleVolume === null || df === null || edtaVolume === null || strength === null) return { success: false, result: null, error: "All required values must be numeric." };
  const result = (edtaVolume * strength * 100 * 1000 * df) / sampleVolume;
  return Number.isFinite(result) ? { success: true, result: Math.trunc(result * 1000) / 1000 } : { success: false, result: null, error: "Unable to calculate result." };
}
