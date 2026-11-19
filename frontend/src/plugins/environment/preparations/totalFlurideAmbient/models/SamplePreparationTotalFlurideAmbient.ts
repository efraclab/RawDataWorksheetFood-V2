export interface SamplePreparationTotalFlurideAmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationTotalFlurideAmbient {
  id: number;
  label: string;
  steps: SamplePreparationTotalFlurideAmbientStep[];
}
