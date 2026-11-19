/**
 * V2 runtime result adapter for the V1 Total Sugar calculation.
 * Arithmetic remains in the migrated V1 CalculationDetail component so the
 * displayed result and automatic fields stay identical to the source module.
 */
export interface SugarCalculationResult {
  readonly success: boolean;
  readonly result: string | number | null;
  readonly unit: string | null;
  readonly error?: string;
}

export function calculateSugar(data: any): SugarCalculationResult {
  const result = data?.calculationResult ?? data?.result ?? null;
  const valid = result !== null && result !== undefined && String(result).trim() !== "";
  return {
    success: valid,
    result: valid ? result : null,
    unit: data?.calculationResultUnit ?? null,
    ...(valid ? {} : { error: "Total Sugar calculation result is not available." }),
  };
}
