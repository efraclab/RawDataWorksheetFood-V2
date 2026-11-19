export interface SamplePreparationSO2AmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationSO2Ambient {
  id: number;
  label: string;
  steps: SamplePreparationSO2AmbientStep[];
}
