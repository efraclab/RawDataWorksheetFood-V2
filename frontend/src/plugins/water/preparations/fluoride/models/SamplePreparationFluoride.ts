export interface SamplePreparationFluorideStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationFluoride {
  id: number;
  label: string;
  steps: SamplePreparationFluorideStep[];
}
