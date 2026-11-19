export interface SamplePreparationCyanideStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationCyanide {
  id: number;
  label: string;
  steps: SamplePreparationCyanideStep[];
}
