const numberValue = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export interface PMStackCalculationInput {
  vstd: unknown;
  w1: unknown;
  w2: unknown;
}

export interface PMStackCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

/** Excel formula: C = ((W₂ − W₁) × 10³) / Vstd */
export function calculatePMStack(input: PMStackCalculationInput): PMStackCalculationResult {
  const vstd = numberValue(input.vstd);
  const w1 = numberValue(input.w1);
  const w2 = numberValue(input.w2);
  if (vstd === null || w1 === null || w2 === null) {
    return { success: false, result: null, error: "All calculation inputs are required and must be numeric." };
  }
  if (w1 !== null && w1 < 0) return { success: false, result: null, error: "Initial weight of thimble cannot be negative." };
  if (w2 !== null && w2 < 0) return { success: false, result: null, error: "Final weight of thimble cannot be negative." };
  if (vstd !== null && vstd <= 0) return { success: false, result: null, error: "Volume of gas (at 250C & 760 mmHg) must be greater than zero." };
  if (w1 !== null && w2 !== null && w2 < w1) return { success: false, result: null, error: "Final weight of thimble cannot be less than initial weight." };

  const result = ((w2 - w1) * 1000) / vstd;
  return Number.isFinite(result)
    ? { success: true, result: Math.round((result + Number.EPSILON) * 100) / 100 }
    : { success: false, result: null, error: "Unable to calculate PM Stack concentration." };
}
