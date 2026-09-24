export interface HCLStackSectionCalculation {
  result: number | null;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}

export interface CalculationHCLStack {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  particulate: HCLStackSectionCalculation;
  h2so4: HCLStackSectionCalculation;
  naoh: HCLStackSectionCalculation;
}
