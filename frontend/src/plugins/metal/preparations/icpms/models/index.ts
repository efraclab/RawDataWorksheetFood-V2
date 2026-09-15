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

/** State owned by the Metal ICP-MS module. Core wraps this in
 * PreparationDraft.modules["metal.icpms"]. */
export interface IcpmsModuleData {
  samplePreparations: import("./SamplePreparationIcpms").SamplePreparationIcpms[];
  files: IcpmsFile[];
  calculations: import("./CalculationIcpms").CalculationIcpms[];
  completed: boolean;
  completedAt: string | null;
}

/** Payload returned to Core by IcpmsPreparationModule.getDraft(). */
export interface IcpmsModuleDraft extends IcpmsModuleData {}
