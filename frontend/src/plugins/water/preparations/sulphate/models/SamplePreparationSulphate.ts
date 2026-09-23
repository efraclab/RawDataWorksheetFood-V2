export interface SamplePreparationSulphateStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationSulphate {
  id: number;
  label: string;
  steps: SamplePreparationSulphateStep[];
}
