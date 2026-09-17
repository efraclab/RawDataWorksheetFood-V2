export type { CalculationSfgc } from "./CalculationSfgc";

export type {
  SamplePreparationSfgc,
  SamplePreparationSfgcStep,
} from "./SamplePreparationSfgc";

export interface SfgcFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal SFGC module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.sfgc"]
 */
export interface SfgcModuleData {
  samplePreparations: import("./SamplePreparationSfgc").SamplePreparationSfgc[];
  files: SfgcFile[];
  calculations: import("./CalculationSfgc").CalculationSfgc[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by SfgcPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface SfgcModuleDraft extends SfgcModuleData {}
