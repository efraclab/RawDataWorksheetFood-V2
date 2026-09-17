export interface MeropenemCalculationInput {
  sample: number | string | null | undefined;
  blank: number | string | null | undefined;
  v1Factor: number | string | null | undefined;
  v1Volume: number | string | null | undefined;
  v2Factor: number | string | null | undefined;
  v2Volume: number | string | null | undefined;
  labelClaim: number | string | null | undefined;
}

export interface MeropenemCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const numeric = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function calculateMeropenem(input: MeropenemCalculationInput): MeropenemCalculationResult {
  const sample = numeric(input.sample);
  const blank = numeric(input.blank);
  const v1Factor = numeric(input.v1Factor);
  const v1Volume = numeric(input.v1Volume);
  const v2Factor = numeric(input.v2Factor);
  const v2Volume = numeric(input.v2Volume);
  const labelClaim = numeric(input.labelClaim);

  const values = [sample, blank, v1Factor, v1Volume, v2Factor, v2Volume, labelClaim];
  if (values.some((value) => value === null)) {
    return { success: false, result: null, error: "All calculation values are required and must be numeric." };
  }

  if (v1Factor! <= 0 || v1Volume! <= 0 || v2Factor! <= 0 || v2Volume! <= 0 ||
      labelClaim! <= 0) {
    return { success: false, result: null, error: "Factors, volumes and label claim must be greater than zero." };
  }

  // Excel formula for MEROPENEM (no sample-weight input):
  // ((Sample - Blank) × V1(volume) × V2(volume) × 1000 × 1000)
  // / (V1(factor) × V2(factor) × 10000 × Label Claim)
  const result =
    ((sample! - blank!) * v1Volume! * v2Volume! * 1000 * 1000) /
    (v1Factor! * v2Factor! * 10000 * labelClaim!);

  return Number.isFinite(result)
    ? { success: true, result: Number(result.toFixed(4)) }
    : { success: false, result: null, error: "Unable to calculate Meropenem result." };
}
