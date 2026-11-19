export type { CalculationAnofer } from "./CalculationAnofer";

export type {
  SamplePreparationAnofer,
  SamplePreparationAnoferStep,
} from "./SamplePreparationAnofer";

export interface AnoferFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal ANOFER module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.anofer"]
 */
export interface AnoferModuleData {
  samplePreparations: import("./SamplePreparationAnofer").SamplePreparationAnofer[];
  files: AnoferFile[];
  calculations: import("./CalculationAnofer").CalculationAnofer[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by AnoferPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface AnoferModuleDraft extends AnoferModuleData {}
