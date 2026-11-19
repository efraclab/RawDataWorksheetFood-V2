export type { CalculationLithosun400, Lithosun400CalculationStage, Lithosun400TabletResult } from './CalculationLithosun400';
export type { Lithosun400DissolutionHour, Lithosun400DissolutionStage, SamplePreparationLithosun400, SamplePreparationLithosun400Step } from './SamplePreparationLithosun400';

export interface Lithosun400File {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

export interface Lithosun400ModuleData {
  samplePreparations: import('./SamplePreparationLithosun400').SamplePreparationLithosun400[];
  files: Lithosun400File[];
  calculations: import('./CalculationLithosun400').CalculationLithosun400[];
  completed: boolean;
  completedAt: string | null;
}
export type Lithosun400ModuleDraft = Lithosun400ModuleData;
