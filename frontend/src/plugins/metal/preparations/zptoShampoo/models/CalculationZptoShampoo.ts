/** ZPTO Shampoo calculation model. */
export interface CalculationZptoShampoo {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  sw1: number | string | null;
  sw1Unit: string;
  v1: number | string | null;
  v1Unit: string;
  v2Factor: number | string | null;
  v2Volume: number | string | null;
  v2VolumeUnit: string;
  weightEmptyPycnometer: number | string | null;
  weightPycnometerSample: number | string | null;
  weightPycnometerWater: number | string | null;
  specificGravity: number | string | null;
  molecularWeight1: number | string | null;
  molecularWeight2: number | string | null;
  labelClaim: number | string | null;
  instrumentConcentrationSample: number | string;
  instrumentConcentrationSampleUnit: string;
  instrumentConcentrationBlank: number | string;
  instrumentConcentrationBlankUnit: string;
  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}
