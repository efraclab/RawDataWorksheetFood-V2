export interface SamplePreparationAmmoniaStackStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationAmmoniaStack {
  id: number;
  label: string;
  steps: SamplePreparationAmmoniaStackStep[];
}
