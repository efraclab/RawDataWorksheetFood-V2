const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface NH3AmbientCalculationInput {
  absorbanceSample: unknown;
  absorbanceBlank: unknown;
  calibrationFactor: unknown;
  volumeAirSampled: unknown;
}

export interface NH3AmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel logic: NH3 concentration (µg/m³) = ((As - Ab) × CF) / Va */
export function calculateNH3Ambient(input: NH3AmbientCalculationInput): NH3AmbientCalculationResult {
  const as = numberValue(input.absorbanceSample);
  const ab = numberValue(input.absorbanceBlank);
  const cf = numberValue(input.calibrationFactor);
  const va = numberValue(input.volumeAirSampled);

  if (as === null || ab === null || cf === null || va === null) {
    return { success: false, result: null, error: "Absorbance of sample, absorbance of reagent blank, calibration factor, and volume of air sampled are required." };
  }
  if (va <= 0) return { success: false, result: null, error: "Volume of air sampled must be greater than zero." };
  if (as < 0 || ab < 0 || cf < 0) return { success: false, result: null, error: "Absorbance and calibration factor cannot be negative." };

  const result = ((as - ab) * cf) / va;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate NH3 Ambient concentration." };
}
