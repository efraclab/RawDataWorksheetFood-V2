export interface SamplePreparationSulphideStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationSulphide {
  id: number;
  label: string;
  steps: SamplePreparationSulphideStep[];
}
