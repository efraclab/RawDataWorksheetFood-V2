export type { CalculationTalc } from "./CalculationTalc";

export type {
  SamplePreparationTalc,
  SamplePreparationTalcStep,
} from "./SamplePreparationTalc";

export interface TalcFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal TALC module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.talc"]
 */
export interface TalcModuleData {
  samplePreparations: import("./SamplePreparationTalc").SamplePreparationTalc[];
  files: TalcFile[];
  calculations: import("./CalculationTalc").CalculationTalc[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by TalcPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface TalcModuleDraft extends TalcModuleData {}
