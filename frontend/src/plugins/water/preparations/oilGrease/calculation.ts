const numberValue = (value: unknown): number | null => { if (value === null || value === undefined || String(value).trim() === "") return null; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null; };

export interface OilGreaseCalculationInput {
  initial: unknown;
  volume: unknown;
  final: unknown;
}
export interface OilGreaseCalculationResult { success: boolean; result: number | null; error?: string; }
export function calculateOilGrease(input: OilGreaseCalculationInput): OilGreaseCalculationResult {
  const initial = numberValue(input.initial);
  const volume = numberValue(input.volume);
  const final = numberValue(input.final);
  if (initial === null || volume === null || final === null) return { success: false, result: null, error: "All required values must be numeric." };
  const result = ((final - initial) * 1000000) / volume;
  return Number.isFinite(result) ? { success: true, result: Math.trunc(result * 1000) / 1000 } : { success: false, result: null, error: "Unable to calculate result." };
}
