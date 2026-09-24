const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface CarbonDisulphideAmbientCalculationInput {
  mass: unknown;
  volume: unknown;
}

export interface CarbonDisulphideAmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: C = M / V */
export function calculateCarbonDisulphideAmbient(input: CarbonDisulphideAmbientCalculationInput): CarbonDisulphideAmbientCalculationResult {
  const mass = numberValue(input.mass);
  const volume = numberValue(input.volume);
  if (mass === null || volume === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (volume !== null && volume <= 0) return { success: false, result: null, error: "Volume of air sampled must be greater than zero." };

  const result = mass / volume;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate Carbon Disulphide Ambient concentration." };
}
