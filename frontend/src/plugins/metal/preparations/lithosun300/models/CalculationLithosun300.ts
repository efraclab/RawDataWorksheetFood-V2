export interface Lithosun300TabletResult {
  tablet: number;
  dissolutionSample: number | string;
  result: number | null;
}

export interface CalculationLithosun300 {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  dissolutionSamples: Array<number | string>;
  results: Array<number | null>;
  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;
}
