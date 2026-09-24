export type HFStackSection = "particulate" | "h2so4" | "naoh";

export interface HFStackSectionCalculation {
  result: number | null;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}

export interface CalculationHFStack {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  particulate: HFStackSectionCalculation;
  h2so4: HFStackSectionCalculation;
  naoh: HFStackSectionCalculation;
}
