export interface SamplePreparationCarbonDisulphideAmbientStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationCarbonDisulphideAmbient {
  id: number;
  label: string;
  steps: SamplePreparationCarbonDisulphideAmbientStep[];
}
