const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface ChlorineAmbientCalculationInput {
  amountChlorineFound: unknown;
  volumeAirSampled: unknown;
}

export interface ChlorineAmbientCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel logic: Chlorine concentration (µg/m³) = M / V */
export function calculateChlorineAmbient(input: ChlorineAmbientCalculationInput): ChlorineAmbientCalculationResult {
  const m = numberValue(input.amountChlorineFound);
  const v = numberValue(input.volumeAirSampled);

  if (m === null || v === null) {
    return { success: false, result: null, error: "Amount of chlorine found and volume of air sampled are required." };
  }
  if (v <= 0) return { success: false, result: null, error: "Volume of air sampled must be greater than zero." };
  if (m < 0) return { success: false, result: null, error: "Amount of chlorine found cannot be negative." };

  const result = m / v;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate Chlorine Ambient concentration." };
}
