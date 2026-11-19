export interface CalculationH2SAmbient {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  calculationResult: number | null;
  calculationResultUnit: string;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}
