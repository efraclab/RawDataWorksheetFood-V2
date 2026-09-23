export interface SamplePreparationMBASStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationMBAS {
  id: number;
  label: string;
  steps: SamplePreparationMBASStep[];
}
