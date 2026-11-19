/**
 * V2 runtime result adapter for the V1 Free Fatty Acid calculation.
 * Arithmetic remains in the migrated V1 CalculationDetail component so the
 * displayed result and automatic fields stay identical to the source module.
 */
export interface FreeFattyAcidCalculationResult {
  readonly success: boolean;
  readonly result: string | number | null;
  readonly unit: string | null;
  readonly error?: string;
}

export function calculateFreeFattyAcid(data: any): FreeFattyAcidCalculationResult {
  const result = data?.calculationResult ?? data?.result ?? null;
  const valid = result !== null && result !== undefined && String(result).trim() !== "";
  return {
    success: valid,
    result: valid ? result : null,
    unit: data?.calculationResultUnit ?? null,
    ...(valid ? {} : { error: "Free Fatty Acid calculation result is not available." }),
  };
}
