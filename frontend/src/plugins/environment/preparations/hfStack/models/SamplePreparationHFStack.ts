export type HFStackSection = "particulate" | "h2so4" | "naoh";

export interface SamplePreparationHFStackStep {
  name: string;
  section: HFStackSection;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationHFStack {
  id: number;
  label: string;
  steps: SamplePreparationHFStackStep[];
}
