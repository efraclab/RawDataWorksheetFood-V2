export interface SamplePreparationTSSStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationTSS {
  id: number;
  label: string;
  steps: SamplePreparationTSSStep[];
}
