export interface SamplePreparationZptoShampooStep {
  name: string;
  value1?: string;
  unit1?: string;
  value2?: string;
  unit2?: string;
  value3?: string;
  unit3?: string;
  logBookID?: string;
}
export interface SamplePreparationZptoShampoo {
  id: number;
  label: string;
  steps: SamplePreparationZptoShampooStep[];
}
