export interface SamplePreparationNO2StackStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationNO2Stack {
  id: number;
  label: string;
  steps: SamplePreparationNO2StackStep[];
}
