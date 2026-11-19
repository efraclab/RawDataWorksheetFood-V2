export interface SamplePreparationRFCStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationRFC {
  id: number;
  label: string;
  steps: SamplePreparationRFCStep[];
}
