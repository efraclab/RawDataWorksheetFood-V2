export interface SamplePreparationNO2AmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationNO2Ambient {
  id: number;
  label: string;
  steps: SamplePreparationNO2AmbientStep[];
}
