export interface SamplePreparationNitriteStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationNitrite {
  id: number;
  label: string;
  steps: SamplePreparationNitriteStep[];
}
