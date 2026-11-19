const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface H2SStackCalculationInput {
  a1: unknown;
  b1: unknown;
  v: unknown;
  pb: unknown;
  fAq: unknown;
}

export interface H2SStackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: F = (Pb − f) / Pb ; H₂S = (12400 × A1 × B1) / (V × F) */
export function calculateH2SStack(input: H2SStackCalculationInput): H2SStackCalculationResult {
  const a1 = numberValue(input.a1);
  const b1 = numberValue(input.b1);
  const v = numberValue(input.v);
  const pb = numberValue(input.pb);
  const fAq = numberValue(input.fAq);
  if (a1 === null || b1 === null || v === null || pb === null || fAq === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (a1 !== null && a1 < 0) return { success: false, result: null, error: "Volume of iodine solution consumed cannot be negative." };
  if (fAq !== null && fAq < 0) return { success: false, result: null, error: "Aqueous tension cannot be negative." };
  if (b1 !== null && b1 <= 0) return { success: false, result: null, error: "Normality of iodine solution must be greater than zero." };
  if (v !== null && v <= 0) return { success: false, result: null, error: "Volume of air sample passed must be greater than zero." };
  if (pb !== null && pb <= 0) return { success: false, result: null, error: "Barometric pressure must be greater than zero." };
  if (pb !== null && fAq !== null && pb <= fAq) return { success: false, result: null, error: "Barometric pressure must be greater than aqueous tension." };

  const result = (12400 * a1 * b1) / (v * ((pb - fAq) / pb));
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate H₂S in Stack concentration." };
}
