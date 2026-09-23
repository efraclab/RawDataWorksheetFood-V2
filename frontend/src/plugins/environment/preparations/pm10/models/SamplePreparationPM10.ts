export interface SamplePreparationPM10Step {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationPM10 {
  id: number;
  label: string;
  steps: SamplePreparationPM10Step[];
}
