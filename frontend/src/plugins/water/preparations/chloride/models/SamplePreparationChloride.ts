export interface SamplePreparationChlorideStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationChloride {
  id: number;
  label: string;
  steps: SamplePreparationChlorideStep[];
}
