export interface CalculationCalcium {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  calculationResult: number | null;
  calculationResultUnit: string;
  calculationResultSecondary?: number | null;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}
