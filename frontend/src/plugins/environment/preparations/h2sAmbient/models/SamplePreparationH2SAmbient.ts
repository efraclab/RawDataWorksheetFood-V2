export interface SamplePreparationH2SAmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationH2SAmbient {
  id: number;
  label: string;
  steps: SamplePreparationH2SAmbientStep[];
}
