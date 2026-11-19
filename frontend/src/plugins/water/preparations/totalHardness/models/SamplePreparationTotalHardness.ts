export interface SamplePreparationTotalHardnessStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationTotalHardness {
  id: number;
  label: string;
  steps: SamplePreparationTotalHardnessStep[];
}
