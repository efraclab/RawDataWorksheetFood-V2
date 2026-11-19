export interface SamplePreparationLithosun300Step {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  logBookID?: string;
}

export interface SamplePreparationLithosun300 {
  id: number;
  label: string;
  steps: SamplePreparationLithosun300Step[];
}
