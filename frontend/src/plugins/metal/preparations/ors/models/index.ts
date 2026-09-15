export type { CalculationOrs } from "./CalculationOrs";

export type {
  SamplePreparationOrs,
  SamplePreparationOrsStep,
} from "./SamplePreparationOrs";

export interface OrsFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal ORS module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.ors"]
 */
export interface OrsModuleData {
  samplePreparations: import("./SamplePreparationOrs").SamplePreparationOrs[];
  files: OrsFile[];
  calculations: import("./CalculationOrs").CalculationOrs[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by OrsPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface OrsModuleDraft extends OrsModuleData {}
