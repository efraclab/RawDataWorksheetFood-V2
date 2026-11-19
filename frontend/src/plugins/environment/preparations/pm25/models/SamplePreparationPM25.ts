export interface SamplePreparationPM25Step {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationPM25 {
  id: number;
  label: string;
  steps: SamplePreparationPM25Step[];
}
