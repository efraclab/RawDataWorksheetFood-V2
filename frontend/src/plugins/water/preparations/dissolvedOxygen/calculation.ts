const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
export interface DissolvedOxygenCalculationInput { volume: unknown; strength: unknown; }
export interface DissolvedOxygenCalculationResult { success: boolean; result: number | null; error?: string; }
export function calculateDissolvedOxygen(input: DissolvedOxygenCalculationInput): DissolvedOxygenCalculationResult {
  const volume = numberValue(input.volume);
  const strength = numberValue(input.strength);
  if (volume === null || strength === null) return { success: false, result: null, error: "Volume and Strength are required." };
  if (strength < 0 || volume < 0) return { success: false, result: null, error: "Volume and Strength cannot be negative." };
  const result = (volume * strength) / 0.025;
  return Number.isFinite(result) ? { success: true, result: Math.trunc(result * 1000) / 1000 } : { success: false, result: null, error: "Unable to calculate Dissolved Oxygen." };
}
