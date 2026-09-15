export type { CalculationIcpms } from "./CalculationIcpms";

export type {
  SamplePreparationIcpms,
  SamplePreparationIcpmsStep,
} from "./SamplePreparationIcpms";

export interface IcpmsFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal ICP-MS module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.icpms"]
 */
export interface IcpmsModuleData {
  samplePreparations: import("./SamplePreparationIcpms").SamplePreparationIcpms[];
  files: IcpmsFile[];
  calculations: import("./CalculationIcpms").CalculationIcpms[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by IcpmsPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface IcpmsModuleDraft extends IcpmsModuleData {}
