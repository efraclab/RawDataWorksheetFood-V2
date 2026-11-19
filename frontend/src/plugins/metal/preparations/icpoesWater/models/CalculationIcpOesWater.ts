export interface CalculationIcpOesWater {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  instrumentConcentrationSample: number | string;
  instrumentConcentrationSampleUnit: string;
  instrumentConcentrationBlank: number | string;
  instrumentConcentrationBlankUnit: string;
  v1: number | string | null;
  v1Unit: string;
  v2: number | string | null;
  v2Unit: string;
  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}
