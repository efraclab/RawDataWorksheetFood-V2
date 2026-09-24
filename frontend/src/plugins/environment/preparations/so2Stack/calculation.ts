const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface SO2StackCalculationInput {
  v: unknown;
  vb: unknown;
  n: unknown;
  vao: unknown;
  va: unknown;
  vn: unknown;
}

export interface SO2StackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: C = 0.032 × (V − Vb) × N × (Vao / Va) / Vn */
export function calculateSO2Stack(input: SO2StackCalculationInput): SO2StackCalculationResult {
  const v = numberValue(input.v);
  const vb = numberValue(input.vb);
  const n = numberValue(input.n);
  const vao = numberValue(input.vao);
  const va = numberValue(input.va);
  const vn = numberValue(input.vn);
  if (v === null || vb === null || n === null || vao === null || va === null || vn === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (v !== null && v < 0) return { success: false, result: null, error: "Volume of barium perchlorate titrant used for the sample cannot be negative." };
  if (vb !== null && vb < 0) return { success: false, result: null, error: "Volume of barium perchlorate titrant used for the blank cannot be negative." };
  if (n !== null && n < 0) return { success: false, result: null, error: "Normality of barium perchlorate titrate cannot be negative." };
  if (vao !== null && vao < 0) return { success: false, result: null, error: "Total solution, volume of SO₂ cannot be negative." };
  if (va !== null && va <= 0) return { success: false, result: null, error: "Volume of sample aliquot titrated must be greater than zero." };
  if (vn !== null && vn <= 0) return { success: false, result: null, error: "Volume of gas sampled through the dry gas meter must be greater than zero." };

  const result = 0.032 * (v - vb) * n * (vao / va) / vn;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 1000) / 1000 }
    : { success: false, result: null, error: "Unable to calculate SO₂ Stack concentration." };
}
