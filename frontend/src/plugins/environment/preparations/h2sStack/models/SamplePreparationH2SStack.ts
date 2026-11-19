export interface SamplePreparationH2SStackStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationH2SStack {
  id: number;
  label: string;
  steps: SamplePreparationH2SStackStep[];
}
