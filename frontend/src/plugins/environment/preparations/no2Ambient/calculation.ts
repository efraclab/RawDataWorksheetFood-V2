const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface NO2AmbientCalculationInput {
  graphFactor: unknown;
  sampleAbs: unknown;
  blankAbs: unknown;
  dilutionFactor: unknown;
  samplingEfficiency?: unknown;
  volumeOfAirSampled: unknown;
  volumeOfSample: unknown;
  volumeOfAliquot: unknown;
}

export interface NO2AmbientCalculationResult {
  success: boolean;
  analyzedSample: number | null;
  result: number | null;
  error?: string;
}

/**
 * Excel formulas:
 *
 * NO2 in analyzed sample (µg) = G × (S − B)
 * NO2 concentration (µg/m³) = (NO2 × D × VS) / (VA × VT × 0.82)
 *
 * Sampling efficiency is fixed at 0.82 in the worksheet.
 */
export function calculateNO2Ambient(input: NO2AmbientCalculationInput): NO2AmbientCalculationResult {
  const g = numberValue(input.graphFactor);
  const s = numberValue(input.sampleAbs);
  const b = numberValue(input.blankAbs);
  const d = numberValue(input.dilutionFactor);
  const efficiency = numberValue(input.samplingEfficiency ?? 0.82);
  const va = numberValue(input.volumeOfAirSampled);
  const vs = numberValue(input.volumeOfSample);
  const vt = numberValue(input.volumeOfAliquot);

  if ([g, s, b, d, efficiency, va, vs, vt].some((value) => value === null)) {
    return { success: false, analyzedSample: null, result: null, error: "All NO2 inputs are required and must be numeric." };
  }

  if (g! < 0 || s! < 0 || b! < 0 || d! <= 0 || va! <= 0 || vs! <= 0 || vt! <= 0) {
    return { success: false, analyzedSample: null, result: null, error: "Inputs must be valid positive values; absorbances and graph factor cannot be negative." };
  }

  if (efficiency! <= 0) {
    return { success: false, analyzedSample: null, result: null, error: "Sampling efficiency must be greater than zero." };
  }

  const analyzedSample = g! * (s! - b!);
  const denominator = va! * vt! * efficiency!;
  if (denominator === 0) {
    return { success: false, analyzedSample: null, result: null, error: "The calculation denominator cannot be zero." };
  }

  const result = (analyzedSample * d! * vs!) / denominator;
  if (!Number.isFinite(analyzedSample) || !Number.isFinite(result)) {
    return { success: false, analyzedSample: null, result: null, error: "Unable to calculate NO2 concentration." };
  }

  return {
    success: true,
    analyzedSample: Math.round((analyzedSample + Number.EPSILON) * 1000) / 1000,
    result: Math.round((result + Number.EPSILON) * 1000) / 1000,
  };
}
