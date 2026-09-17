/** SODIUM LACTATE / SODIUM LACTATE calculation model. */
export interface CalculationSodiumLactate {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;

  sw1: number | string | null;
  sw1Unit: string;
  v1: number | string | null;
  v1Unit: string;

  /** V2 has two independent Excel inputs: factor and volume. */
  v2Factor: number | string | null;
  v2Volume: number | string | null;
  v2VolumeUnit: string;

  /** V3 has two independent Excel inputs: factor and volume. */
  v3Factor: number | string | null;
  v3Volume: number | string | null;
  v3VolumeUnit: string;

  v4Factor: number | string | null;
  v4Volume: number | string | null;
  v4VolumeUnit: string;

  avgWeight: number | string | null;
  avgWeightUnit: string;
  molecularWeight: number | string | null;
  labelClaimBase: number | string | null;
  labelClaimValue: number | string | null;

  instrumentConcentrationSample: number | string;
  instrumentConcentrationSampleUnit: string;
  instrumentConcentrationBlank: number | string;
  instrumentConcentrationBlankUnit: string;

  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;
  calculationResult: number | string | null;
  calculationResultUnit: string;
}
