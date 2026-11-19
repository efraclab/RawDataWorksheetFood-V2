import type { Lithosun400DissolutionHour } from './SamplePreparationLithosun400';

export interface Lithosun400TabletResult {
  tablet: number;
  dissolutionSample: number | string;
  result: number | null;
}

export interface Lithosun400CalculationStage {
  hour: Lithosun400DissolutionHour;
  label: string;
  dissolutionSamples: Array<number | string>;
  results: Array<number | null>;
  acceptanceLimitMin: number | string;
  acceptanceLimitMax: number | string;
}

export interface CalculationLithosun400 {
  id: number;
  label: string;
  selectedSamplePreparationId: number | null;
  stages: Lithosun400CalculationStage[];
  // Legacy fields retained so older persisted records can be restored safely.
  dissolutionHours?: Lithosun400DissolutionHour | '';
  dissolutionSamples?: Array<number | string>;
  results?: Array<number | null>;
  acceptanceLimitMin?: number | string;
  acceptanceLimitMax?: number | string;
}
