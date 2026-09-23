export interface SamplePreparationTotalPhosphorusStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationTotalPhosphorus {
  id: number;
  label: string;
  steps: SamplePreparationTotalPhosphorusStep[];
}
