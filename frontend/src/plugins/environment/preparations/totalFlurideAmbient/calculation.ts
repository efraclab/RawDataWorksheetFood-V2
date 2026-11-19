const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface TotalFlurideAmbientCalculationInput {
  totalMicrogramFluoride: unknown;
  volumeAirSampled: unknown;
}

export interface TotalFlurideAmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel logic: Total fluoride concentration = Total µgF / Vs */
export function calculateTotalFlurideAmbient(input: TotalFlurideAmbientCalculationInput): TotalFlurideAmbientCalculationResult {
  const totalMicrogramFluoride = numberValue(input.totalMicrogramFluoride);
  const volumeAirSampled = numberValue(input.volumeAirSampled);

  if (totalMicrogramFluoride === null || volumeAirSampled === null) {
    return { success: false, result: null, error: "Total µgF and volume of air sampled are required." };
  }
  if (volumeAirSampled <= 0) return { success: false, result: null, error: "Volume of air sampled must be greater than zero." };
  if (totalMicrogramFluoride < 0) return { success: false, result: null, error: "Total µgF cannot be negative." };

  const result = totalMicrogramFluoride / volumeAirSampled;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate Total Fluride Ambient concentration." };
}
