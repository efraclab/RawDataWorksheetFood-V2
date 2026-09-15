export type { CalculationAasWater } from "./CalculationAasWater";

export type {
  SamplePreparationAasWater,
  SamplePreparationAasWaterStep,
} from "./SamplePreparationAasWater";

export interface AasWaterFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal AAS (Water) module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.aaswater"]
 */
export interface AasWaterModuleData {
  samplePreparations: import("./SamplePreparationAasWater").SamplePreparationAasWater[];
  files: AasWaterFile[];
  calculations: import("./CalculationAasWater").CalculationAasWater[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by AasWaterPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface AasWaterModuleDraft extends AasWaterModuleData {}
