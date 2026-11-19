const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface SO2AmbientCalculationInput {
  absorbanceSample: unknown;
  absorbanceBlank: unknown;
  calibrationFactor: unknown;
  volumeOfAirSampled: unknown;
  volumeOfSample: unknown;
  volumeOfAliquot: unknown;
}

export interface SO2AmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: ((AS - AB) × CF × VS) / (VA × VT). */
export function calculateSO2Ambient(input: SO2AmbientCalculationInput): SO2AmbientCalculationResult {
  const as = numberValue(input.absorbanceSample);
  const ab = numberValue(input.absorbanceBlank);
  const cf = numberValue(input.calibrationFactor);
  const va = numberValue(input.volumeOfAirSampled);
  const vs = numberValue(input.volumeOfSample);
  const vt = numberValue(input.volumeOfAliquot);

  if ([as, ab, cf, va, vs, vt].some((value) => value === null)) {
    return { success: false, result: null, error: "All six SO2 input fields are required and must be numeric." };
  }
  if (va! <= 0 || vs! <= 0 || vt! <= 0) {
    return { success: false, result: null, error: "Volume of air sampled, volume of sample, and aliquot volume must be greater than zero." };
  }
  if (cf! < 0 || as! < 0 || ab! < 0) {
    return { success: false, result: null, error: "Absorbance and calibration factor values cannot be negative." };
  }

  const result = ((as! - ab!) * cf! * vs!) / (va! * vt!);
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate SO2 concentration." };
}
