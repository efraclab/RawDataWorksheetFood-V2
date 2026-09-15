/**
 * Metal Laboratory — ICP-MS (FOOD) calculation model.
 *
 * The field names follow the existing worksheet/Excel terminology:
 * SW1 = Sample Weight, V1 = Volume Makeup, V2/V3 = dilution factors.
 */
export interface CalculationIcpms {
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;

  /** SW1 — Sample Weight, in grams. */
  sw1: number | string | null;

  /** V1 — Volume Makeup, in ml. */
  v1: number | string | null;

  /** V2 — Dilution Factor 1. */
  v2: number | string | null;

  /** V3 — Dilution Factor 2. */
  v3: number | string | null;

  /** Reserved fields retained for worksheet compatibility. */
  v4: number | string | null;
  v5: number | string | null;
  v6: number | string | null;
  v7: number | string | null;

  instrumentConcentrationSample: number | string;
  instrumentConcentrationSampleUnit: string;

  instrumentConcentrationBlank: number | string;
  instrumentConcentrationBlankUnit: string;

  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;

  calculationResult: number | null;
  calculationResultUnit: string;
}
