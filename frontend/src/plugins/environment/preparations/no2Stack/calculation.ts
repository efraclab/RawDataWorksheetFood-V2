const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface NO2StackCalculationInput {
  as: unknown;
  ab: unknown;
  f: unknown;
  kc: unknown;
  aliquotFactor: unknown;
  vbc: unknown;
}

export interface NO2StackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: C = ((As − Ab) × Kc × 1000 × 2 × F) / Vbc */
export function calculateNO2Stack(input: NO2StackCalculationInput): NO2StackCalculationResult {
  const as = numberValue(input.as);
  const ab = numberValue(input.ab);
  const f = numberValue(input.f);
  const kc = numberValue(input.kc);
  const aliquotFactor = numberValue(input.aliquotFactor);
  const vbc = numberValue(input.vbc);
  if (as === null || ab === null || f === null || kc === null || aliquotFactor === null || vbc === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (as !== null && as < 0) return { success: false, result: null, error: "Absorbance of sample cannot be negative." };
  if (ab !== null && ab < 0) return { success: false, result: null, error: "Absorbance of blank cannot be negative." };
  if (f !== null && f <= 0) return { success: false, result: null, error: "Dilution factor must be greater than zero." };
  if (kc !== null && kc <= 0) return { success: false, result: null, error: "Spectrophotometer calibration factor must be greater than zero." };
  if (aliquotFactor !== null && aliquotFactor <= 0) return { success: false, result: null, error: "50/25 the aliquot factor must be greater than zero." };
  if (vbc !== null && vbc <= 0) return { success: false, result: null, error: "Sample volume at standard condition must be greater than zero." };

  const result = ((as - ab) * kc * 1000 * aliquotFactor * f) / vbc;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate NO₂ Stack concentration." };
}
