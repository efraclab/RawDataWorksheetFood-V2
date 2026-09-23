export interface SamplePreparationOilGreaseStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationOilGrease {
  id: number;
  label: string;
  steps: SamplePreparationOilGreaseStep[];
}
