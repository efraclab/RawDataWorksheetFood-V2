export type { CalculationIcpmsWater } from "./CalculationIcpmsWater";
export type {
  SamplePreparationIcpmsWater,
  SamplePreparationIcpmsWaterStep,
} from "./SamplePreparationIcpmsWater";

export interface IcpmsWaterFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

export interface IcpmsWaterModuleData {
  samplePreparations: import("./SamplePreparationIcpmsWater").SamplePreparationIcpmsWater[];
  files: IcpmsWaterFile[];
  calculations: import("./CalculationIcpmsWater").CalculationIcpmsWater[];
  completed: boolean;
  completedAt: string | null;
}

export interface IcpmsWaterModuleDraft extends IcpmsWaterModuleData {}
