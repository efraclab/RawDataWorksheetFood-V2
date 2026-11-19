export interface SfgcCalculationInput {
  sample: number | string | null | undefined;
  blank: number | string | null | undefined;
  v1Volume: number | string | null | undefined;
  v2Factor: number | string | null | undefined;
  v2Volume: number | string | null | undefined;
  v3Factor: number | string | null | undefined;
  v3Volume: number | string | null | undefined;
  sampleWeight: number | string | null | undefined;
}
export interface SfgcCalculationResult { success: boolean; result: number | null; error?: string; }
const numeric = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
/** Excel layout: ((Sample - Blank) × V2(volume) × V3(volume) × 1000 × 100) / (SW × V2(factor) × V3(factor) × 10,000). */
export function calculateSfgc(input: SfgcCalculationInput): SfgcCalculationResult {
  const sample = numeric(input.sample), blank = numeric(input.blank), v1Volume = numeric(input.v1Volume);
  const v2Factor = numeric(input.v2Factor), v2Volume = numeric(input.v2Volume);
  const v3Factor = numeric(input.v3Factor), v3Volume = numeric(input.v3Volume);
  const sampleWeight = numeric(input.sampleWeight);
  const values = [sample, blank, v1Volume, v2Factor, v2Volume, v3Factor, v3Volume, sampleWeight];
  if (values.some((value) => value === null)) return { success: false, result: null, error: "All SFGC calculation values are required and must be numeric." };
  if (v1Volume! <= 0 || v2Factor! <= 0 || v2Volume! <= 0 || v3Factor! <= 0 || v3Volume! <= 0 || sampleWeight! <= 0) return { success: false, result: null, error: "Volumes, factors and sample weight must be greater than zero." };
  const result = ((sample! - blank!) * v2Volume! * v3Volume! * 1000 * 100) / (sampleWeight! * v2Factor! * v3Factor! * 10000);
  return Number.isFinite(result) ? { success: true, result: Number(result.toFixed(4)) } : { success: false, result: null, error: "Unable to calculate SFGC result." };
}
