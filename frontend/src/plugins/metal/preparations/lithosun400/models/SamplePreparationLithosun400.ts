export type Lithosun400DissolutionHour = '1' | '3' | '7';

export interface SamplePreparationLithosun400Step {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  logBookID?: string;
}

export interface Lithosun400DissolutionStage {
  hour: Lithosun400DissolutionHour;
  label: string;
  steps: SamplePreparationLithosun400Step[];
}

export interface SamplePreparationLithosun400 {
  id: number;
  label: string;
  stages: Lithosun400DissolutionStage[];
  // Kept optional for compatibility with older saved drafts.
  dissolutionHours?: Lithosun400DissolutionHour | '';
  steps?: SamplePreparationLithosun400Step[];
}
