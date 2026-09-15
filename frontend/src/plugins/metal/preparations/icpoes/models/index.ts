export type { CalculationIcpOes } from "./CalculationIcpOes";

export type {
  SamplePreparationIcpOes,
  SamplePreparationIcpOesStep,
} from "./SamplePreparationIcpOes";

export interface IcpOesFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal ICP-OES module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.icpoes"]
 */
export interface IcpOesModuleData {
  samplePreparations: import("./SamplePreparationIcpOes").SamplePreparationIcpOes[];
  files: IcpOesFile[];
  calculations: import("./CalculationIcpOes").CalculationIcpOes[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by IcpOesPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface IcpOesModuleDraft extends IcpOesModuleData {}
