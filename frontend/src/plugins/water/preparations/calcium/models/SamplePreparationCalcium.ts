export interface SamplePreparationCalciumStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationCalcium {
  id: number;
  label: string;
  steps: SamplePreparationCalciumStep[];
}
