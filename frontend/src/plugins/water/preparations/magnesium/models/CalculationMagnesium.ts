export interface CalculationMagnesium {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  calculationResult: number | null;
  calculationResultUnit: string;
  calculationResultSecondary?: number | null;
  calculationResultTertiary?: number | null;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}
