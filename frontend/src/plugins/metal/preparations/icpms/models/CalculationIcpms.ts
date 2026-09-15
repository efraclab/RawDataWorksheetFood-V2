/**
 * Metal Laboratory — ICP-MS (FOOD) calculation model.
 *
 * The field names follow the worksheet/Excel terminology:
 * SW1 = Sample Weight
 * V1  = Volume Makeup
 * V2  = Dilution Factor 1
 * V3  = Dilution Factor 2
 */
export interface CalculationIcpms {
  id: number;
  label: string;

  selectedSamplePreparationLabel: string | null;

  /** SW1 — Sample Weight. */
  sw1: number | string | null;
  sw1Unit: string;

  /** V1 — Volume Makeup. */
  v1: number | string | null;
  v1Unit: string;

  /** V2 — Dilution Factor 1. */
  v2: number | string | null;
  v2Unit: string;

  /** V3 — Dilution Factor 2. */
  v3: number | string | null;
  v3Unit: string;

  /** Reserved worksheet compatibility fields. */
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

  calculationResult: number | string | null;
  calculationResultUnit: string;
}
