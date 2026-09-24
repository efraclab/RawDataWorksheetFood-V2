const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface PM25CalculationInput {
  averageFlowRate: unknown;
  samplingTime: unknown;
  initialWeight: unknown;
  finalWeight: unknown;
}

export interface PM25CalculationResult {
  success: boolean;
  result: number | null;
  volume: number | null;
  error?: string;
}

/**
 * Excel logic:
 * V (m³) = Q (m³/min) × t (min)
 * PM25 (µg/m³) = ((W2 − W1) × 1,000,000) / V
 * W1 and W2 are entered in grams.
 */
export function calculatePM25(input: PM25CalculationInput): PM25CalculationResult {
  const q = numberValue(input.averageFlowRate);
  const t = numberValue(input.samplingTime);
  const w1 = numberValue(input.initialWeight);
  const w2 = numberValue(input.finalWeight);

  if (q === null || t === null || w1 === null || w2 === null) {
    return { success: false, result: null, volume: null, error: "Average flow rate, sampling time, and both filter weights are required." };
  }
  if (q <= 0 || t <= 0) {
    return { success: false, result: null, volume: null, error: "Average flow rate and sampling time must be greater than zero." };
  }
  if (w1 < 0 || w2 < 0 || w2 < w1) {
    return { success: false, result: null, volume: null, error: "Filter weights must be non-negative and final weight cannot be less than initial weight." };
  }

  const volume = q * t;
  if (volume <= 0) return { success: false, result: null, volume: null, error: "Calculated air volume must be greater than zero." };

  const result = ((w2 - w1) * 1_000_000) / volume;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 100) / 100, volume: Math.round((volume + Number.EPSILON) * 100) / 100 }
    : { success: false, result: null, volume: null, error: "Unable to calculate PM25 result." };
}
