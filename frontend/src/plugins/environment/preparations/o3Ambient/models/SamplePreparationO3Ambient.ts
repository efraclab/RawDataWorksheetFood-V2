export interface SamplePreparationO3AmbientStep {
  name: string;
  value1: string;
  unit1: string;
  fixed?: boolean;
  logBookID?: string;
}

export interface SamplePreparationO3Ambient {
  id: number;
  label: string;
  steps: SamplePreparationO3AmbientStep[];
}
