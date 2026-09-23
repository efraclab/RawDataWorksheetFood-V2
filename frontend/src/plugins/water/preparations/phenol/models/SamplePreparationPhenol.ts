export interface SamplePreparationPhenolStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationPhenol {
  id: number;
  label: string;
  steps: SamplePreparationPhenolStep[];
}
