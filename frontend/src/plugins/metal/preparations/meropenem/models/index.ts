export type { CalculationMeropenem } from "./CalculationMeropenem";

export type {
  SamplePreparationMeropenem,
  SamplePreparationMeropenemStep,
} from "./SamplePreparationMeropenem";

export interface MeropenemFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal MEROPENEM module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.meropenem"]
 */
export interface MeropenemModuleData {
  samplePreparations: import("./SamplePreparationMeropenem").SamplePreparationMeropenem[];
  files: MeropenemFile[];
  calculations: import("./CalculationMeropenem").CalculationMeropenem[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by MeropenemPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface MeropenemModuleDraft extends MeropenemModuleData {}
