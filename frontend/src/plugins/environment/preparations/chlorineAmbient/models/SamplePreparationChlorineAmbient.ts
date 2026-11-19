export interface SamplePreparationChlorineAmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationChlorineAmbient {
  id: number;
  label: string;
  steps: SamplePreparationChlorineAmbientStep[];
}
