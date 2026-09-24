export type HCLStackSection = "particulate" | "h2so4" | "naoh";

export interface SamplePreparationHCLStackStep {
  name: string;
  section: HCLStackSection;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationHCLStack {
  id: number;
  label: string;
  steps: SamplePreparationHCLStackStep[];
}
