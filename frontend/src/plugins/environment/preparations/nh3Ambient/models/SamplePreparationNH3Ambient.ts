export interface SamplePreparationNH3AmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationNH3Ambient {
  id: number;
  label: string;
  steps: SamplePreparationNH3AmbientStep[];
}
