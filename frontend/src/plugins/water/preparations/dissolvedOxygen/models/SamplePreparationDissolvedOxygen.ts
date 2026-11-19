export interface SamplePreparationDissolvedOxygenStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}
export interface SamplePreparationDissolvedOxygen {
  id: number;
  label: string;
  steps: SamplePreparationDissolvedOxygenStep[];
}
