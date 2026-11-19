export interface SimpleEnvironmentStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SimpleEnvironmentSamplePreparation {
  id: number;
  label: string;
  steps: SimpleEnvironmentStep[];
}

export interface SimpleEnvironmentCalculation {
  id: number;
  label: string;
  selectedSamplePreparationLabel: string | null;
  calculationResult: number | null;
  calculationResultUnit: string;
  acceptanceLimitMin: string;
  acceptanceLimitMax: string;
}

export interface SimpleEnvironmentField {
  key: string;
  name: string;
  symbol: string;
  unit: string;
  defaultValue?: string;
  readOnly?: boolean;
  compute?: (values: Record<string, number>) => string;
}

export interface SimpleEnvironmentConfig {
  shortName: string;
  title: string;
  subtitle: string;
  preparationType: string;
  calculationType: string;
  formula: string;
  resultUnit: string;
  fields: readonly SimpleEnvironmentField[];
  calculate: (values: Record<string, unknown>) => { success: boolean; result: number | null; error?: string };
}
