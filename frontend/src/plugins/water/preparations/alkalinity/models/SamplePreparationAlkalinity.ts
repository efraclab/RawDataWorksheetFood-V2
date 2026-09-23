export interface SamplePreparationAlkalinityStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationAlkalinity {
  id: number;
  label: string;
  steps: SamplePreparationAlkalinityStep[];
}
