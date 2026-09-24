const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface H2SAmbientCalculationInput {
  hydrogenSulphideMicrogram: unknown;
  litresAirSampled: unknown;
}

export interface H2SAmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel logic: H2S concentration (µg/m³) = (H × 1000) / A */
export function calculateH2SAmbient(input: H2SAmbientCalculationInput): H2SAmbientCalculationResult {
  const h = numberValue(input.hydrogenSulphideMicrogram);
  const a = numberValue(input.litresAirSampled);

  if (h === null || a === null) {
    return { success: false, result: null, error: "Microgram of hydrogen sulphide in the sample and litres of air sampled are required." };
  }
  if (a <= 0) return { success: false, result: null, error: "Litres of air sampled must be greater than zero." };
  if (h < 0) return { success: false, result: null, error: "Microgram of hydrogen sulphide cannot be negative." };

  const result = (h * 1000) / a;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate H2S Ambient concentration." };
}
