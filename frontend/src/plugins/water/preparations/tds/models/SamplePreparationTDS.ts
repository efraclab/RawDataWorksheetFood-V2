export interface SamplePreparationTDSStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationTDS {
  id: number;
  label: string;
  steps: SamplePreparationTDSStep[];
}
