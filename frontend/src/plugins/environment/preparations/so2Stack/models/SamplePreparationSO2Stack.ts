export interface SamplePreparationSO2StackStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationSO2Stack {
  id: number;
  label: string;
  steps: SamplePreparationSO2StackStep[];
}
