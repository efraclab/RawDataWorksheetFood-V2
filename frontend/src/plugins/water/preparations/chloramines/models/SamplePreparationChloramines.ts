export interface SamplePreparationChloraminesStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationChloramines {
  id: number;
  label: string;
  steps: SamplePreparationChloraminesStep[];
}
