export interface SoilCa2PlusCalculationInput {
  n: unknown;
  v: unknown;
  a: unknown;
  e: unknown;
  w: unknown;
}

export interface SoilCa2PlusCalculationResult {
  success: boolean;
  result: number | null;
  calciumByVersanate: number | null;
  error?: string;
}

const toNumber = (value: unknown): number | null => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

/**
 * Excel source formulas:
 *
 * Calcium by versanate method
 *   Ca = (N × V × 1000) / A
 *
 * Calcium when expressed on soil wt. basis
 *   Result = (100 × E × Ca) / (W × 1000)
 */
export function calculateSoilCa2Plus(
  input: SoilCa2PlusCalculationInput,
): SoilCa2PlusCalculationResult {
  const n = toNumber(input.n);
  const v = toNumber(input.v);
  const a = toNumber(input.a);
  const e = toNumber(input.e);
  const w = toNumber(input.w);

  if ([n, v, a, e, w].some((value) => value === null)) {
    return {
      success: false,
      result: null,
      calciumByVersanate: null,
      error: "All calculation inputs are required and must be numeric.",
    };
  }

  if (n! < 0 || v! < 0 || a! <= 0 || e! < 0 || w! <= 0) {
    return {
      success: false,
      result: null,
      calciumByVersanate: null,
      error: "N, V and E cannot be negative, while A and W must be greater than zero.",
    };
  }

  const calciumByVersanate = (n! * v! * 1000) / a!;
  const result = (100 * e! * calciumByVersanate) / (w! * 1000);

  if (![calciumByVersanate, result].every(Number.isFinite)) {
    return {
      success: false,
      result: null,
      calciumByVersanate: null,
      error: "Unable to calculate calcium.",
    };
  }

  return {
    success: true,
    result: Number(result.toFixed(6)),
    calciumByVersanate: Number(calciumByVersanate.toFixed(6)),
  };
}
