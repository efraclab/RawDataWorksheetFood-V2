const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface O3AmbientCalculationInput {
  absorbanceSample: unknown;
  absorbanceBlank: unknown;
  calibrationFactor: unknown;
  volumeAirSampled: unknown;
  conversionFactor: unknown;
}

export interface O3AmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/**
 * Excel logic:
 * O3 concentration (µg/m³) = ((As - Ab) × CF × 1.962) / Va
 *
 * As = Absorbance of sample
 * Ab = Absorbance of reagent blank
 * CF = Calibration factor
 * Va = Volume of air sampled (m³)
 * 1.962 = fixed conversion factor, µl to µg
 */
export function calculateO3Ambient(input: O3AmbientCalculationInput): O3AmbientCalculationResult {
  const as = numberValue(input.absorbanceSample);
  const ab = numberValue(input.absorbanceBlank);
  const cf = numberValue(input.calibrationFactor);
  const va = numberValue(input.volumeAirSampled);
  const conversionFactor = numberValue(input.conversionFactor);

  if (as === null || ab === null || cf === null || va === null || conversionFactor === null) {
    return {
      success: false,
      result: null,
      error: "Absorbance of sample, absorbance of reagent blank, calibration factor, volume of air sampled, and conversion factor are required.",
    };
  }

  if (va <= 0) {
    return {
      success: false,
      result: null,
      error: "Volume of air sampled must be greater than zero.",
    };
  }

  if (conversionFactor !== 1.962) {
    return {
      success: false,
      result: null,
      error: "Conversion factor must be 1.962.",
    };
  }

  const result = ((as - ab) * cf * conversionFactor) / va;

  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate O3Ambient concentration." };
}
