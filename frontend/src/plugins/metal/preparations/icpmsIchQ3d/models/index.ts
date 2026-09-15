export type { CalculationIcpmsIchQ3d } from "./CalculationIcpmsIchQ3d";

export type {
  SamplePreparationIcpmsIchQ3d,
  SamplePreparationIcpmsIchQ3dStep,
} from "./SamplePreparationIcpmsIchQ3d";

export interface IcpmsIchQ3dFile {
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
 * PreparationDraft.modules["metal.icpmsIchQ3d"]
 */
export interface IcpmsIchQ3dModuleData {
  samplePreparations: import("./SamplePreparationIcpmsIchQ3d").SamplePreparationIcpmsIchQ3d[];
  files: IcpmsIchQ3dFile[];
  calculations: import("./CalculationIcpmsIchQ3d").CalculationIcpmsIchQ3d[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by IcpmsIchQ3dPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface IcpmsIchQ3dModuleDraft extends IcpmsIchQ3dModuleData {}
