export interface SamplePreparationPMStackStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationPMStack {
  id: number;
  label: string;
  steps: SamplePreparationPMStackStep[];
}
