export interface SamplePreparationNitrateStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationNitrate {
  id: number;
  label: string;
  steps: SamplePreparationNitrateStep[];
}
