const numberValue = (value: unknown): number | null => { if (value === null || value === undefined || String(value).trim() === "") return null; const parsed = Number(value); return Number.isFinite(parsed) ? parsed : null; };

export interface CODCalculationInput {
  sampleVolume: unknown;
  df: unknown;
  blankWater: unknown;
  k2cr2o7Volume: unknown;
  k2cr2o7Strength: unknown;
  fasBlank: unknown;
  fasSample: unknown;
  fasStrength: unknown;
}
export interface CODCalculationResult { success: boolean; result: number | null; error?: string; }
export function calculateCOD(input: CODCalculationInput): CODCalculationResult {
  const sampleVolume = numberValue(input.sampleVolume);
  const df = numberValue(input.df);
  const blankWater = numberValue(input.blankWater);
  const k2cr2o7Volume = numberValue(input.k2cr2o7Volume);
  const k2cr2o7Strength = numberValue(input.k2cr2o7Strength);
  const fasBlank = numberValue(input.fasBlank);
  const fasSample = numberValue(input.fasSample);
  const fasStrength = numberValue(input.fasStrength);
  if (sampleVolume === null || df === null || blankWater === null || k2cr2o7Volume === null || k2cr2o7Strength === null || fasBlank === null || fasSample === null || fasStrength === null) return { success: false, result: null, error: "All required values must be numeric." };
  const result = ((fasBlank - fasSample) * fasStrength * 8000 * df) / sampleVolume;
  return Number.isFinite(result) ? { success: true, result: Math.trunc(result * 1000) / 1000 } : { success: false, result: null, error: "Unable to calculate result." };
}
