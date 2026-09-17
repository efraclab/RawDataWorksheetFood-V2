export interface TalcCalculationInput {
  sample: number | string | null | undefined;
  blank: number | string | null | undefined;
  v1Factor: number | string | null | undefined;
  v1Volume: number | string | null | undefined;
  v2Factor: number | string | null | undefined;
  v2Volume: number | string | null | undefined;
  sampleWeight: number | string | null | undefined;
  x1?: number | string | null | undefined;
}

export interface TalcCalculationResult {
  success: boolean;
  result: number | null;
  error?: string;
}

const numeric = (value: unknown): number | null => {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function calculateTalc(input: TalcCalculationInput): TalcCalculationResult {
  const sample = numeric(input.sample);
  const blank = numeric(input.blank);
  const v1Factor = numeric(input.v1Factor);
  const v1Volume = numeric(input.v1Volume);
  const v2Factor = numeric(input.v2Factor);
  const v2Volume = numeric(input.v2Volume);
  const sampleWeight = numeric(input.sampleWeight);
  const x1 = numeric(input.x1 ?? 1);

  const values = [sample, blank, v1Factor, v1Volume, v2Factor, v2Volume, sampleWeight, x1];
  if (values.some((value) => value === null)) {
    return { success: false, result: null, error: "All calculation values are required and must be numeric." };
  }

  if (
    v1Factor! <= 0 ||
    v1Volume! <= 0 ||
    v2Factor! <= 0 ||
    v2Volume! <= 0 ||
    sampleWeight! <= 0
  ) {
    return { success: false, result: null, error: "Factors, volumes and sample weight must be greater than zero." };
  }

  // Excel: (Sample × V1(volume) × V2(volume) × X1) /
  //        (Weight of Sample × V1(factor) × V2(factor) × 10000)
  const result =
    ((sample! - blank!) * v1Volume! * v2Volume! * x1!) /
    (sampleWeight! * v1Factor! * v2Factor! * 10000);

  return Number.isFinite(result)
    ? { success: true, result: Number(result.toFixed(4)) }
    : { success: false, result: null, error: "Unable to calculate Talc result." };
}
