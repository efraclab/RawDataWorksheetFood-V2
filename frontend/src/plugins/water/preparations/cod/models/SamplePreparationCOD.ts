export interface SamplePreparationCODStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationCOD {
  id: number;
  label: string;
  steps: SamplePreparationCODStep[];
}
