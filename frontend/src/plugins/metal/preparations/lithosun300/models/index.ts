export type { CalculationLithosun300, Lithosun300TabletResult } from './CalculationLithosun300';
export type { SamplePreparationLithosun300, SamplePreparationLithosun300Step } from './SamplePreparationLithosun300';

export interface Lithosun300File {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

export interface Lithosun300ModuleData {
  samplePreparations: import('./SamplePreparationLithosun300').SamplePreparationLithosun300[];
  files: Lithosun300File[];
  calculations: import('./CalculationLithosun300').CalculationLithosun300[];
  completed: boolean;
  completedAt: string | null;
}
export type Lithosun300ModuleDraft = Lithosun300ModuleData;
