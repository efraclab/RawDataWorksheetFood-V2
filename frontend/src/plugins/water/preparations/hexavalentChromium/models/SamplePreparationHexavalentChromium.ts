export interface SamplePreparationHexavalentChromiumStep {
  name: string;
  value1: string;
  unit1: string;
  logBookID?: string;
}

export interface SamplePreparationHexavalentChromium {
  id: number;
  label: string;
  steps: SamplePreparationHexavalentChromiumStep[];
}
