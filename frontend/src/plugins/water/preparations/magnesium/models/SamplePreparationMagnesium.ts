export interface SamplePreparationMagnesiumStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationMagnesium {
  id: number;
  label: string;
  steps: SamplePreparationMagnesiumStep[];
}
