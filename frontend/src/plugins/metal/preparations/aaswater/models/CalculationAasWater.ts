/**
 * Metal Laboratory — AAS (Water) calculation model.
 *
 * Worksheet terminology:
 *   V1 = Dilution Factor 1
 *   V2 = Dilution Factor 2
 *
 * AAS (Water) does not use sample weight.
 */
export interface CalculationAasWater {
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;

  /** V1 — Dilution Factor 1. */
  v1: number | string | null;
  v1Unit: string;

  /** V2 — Dilution Factor 2. */
  v2: number | string | null;
  v2Unit: string;

  instrumentConcentrationSample: number | string;
  instrumentConcentrationSampleUnit: string;

  instrumentConcentrationBlank: number | string;
  instrumentConcentrationBlankUnit: string;

  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;

  calculationResult: number | string | null;
  calculationResultUnit: string;
}
