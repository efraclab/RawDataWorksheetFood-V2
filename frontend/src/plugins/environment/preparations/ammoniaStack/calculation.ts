const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface AmmoniaStackCalculationInput {
  ammoniaEquivalent: unknown;
  v: unknown;
  vb: unknown;
  f: unknown;
  vn: unknown;
}

export interface AmmoniaStackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: C = 0.34 × (V − Vb) × f / Vn */
export function calculateAmmoniaStack(input: AmmoniaStackCalculationInput): AmmoniaStackCalculationResult {
  const ammoniaEquivalent = numberValue(input.ammoniaEquivalent);
  const v = numberValue(input.v);
  const vb = numberValue(input.vb);
  const f = numberValue(input.f);
  const vn = numberValue(input.vn);
  if (ammoniaEquivalent === null || v === null || vb === null || f === null || vn === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (v !== null && v < 0) return { success: false, result: null, error: "0.02 N sulphuric acid used for sample cannot be negative." };
  if (vb !== null && vb < 0) return { success: false, result: null, error: "0.02 N sulphuric acid used for blank cannot be negative." };
  if (ammoniaEquivalent !== null && ammoniaEquivalent <= 0) return { success: false, result: null, error: "Ammonia equivalent must be greater than zero." };
  if (f !== null && f <= 0) return { success: false, result: null, error: "Factor of 0.02 N sulphuric acid must be greater than zero." };
  if (vn !== null && vn <= 0) return { success: false, result: null, error: "Volume of dry gas sample must be greater than zero." };

  const result = ammoniaEquivalent * (v - vb) * f / vn;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate Ammonia Stack concentration." };
}
