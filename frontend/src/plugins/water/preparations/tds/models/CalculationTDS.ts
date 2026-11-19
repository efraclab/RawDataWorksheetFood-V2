export interface CalculationTDS {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  calculationResult: number | null;
  calculationResultUnit: string;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}
