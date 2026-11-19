export type { CalculationIcpOesWater } from "./CalculationIcpOesWater";
export type {
  SamplePreparationIcpOesWater,
  SamplePreparationIcpOesWaterStep,
} from "./SamplePreparationIcpOesWater";

export interface IcpOesWaterFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

export interface IcpOesWaterModuleData {
  samplePreparations: import("./SamplePreparationIcpOesWater").SamplePreparationIcpOesWater[];
  files: IcpOesWaterFile[];
  calculations: import("./CalculationIcpOesWater").CalculationIcpOesWater[];
  completed: boolean;
  completedAt: string | null;
}

export interface IcpOesWaterModuleDraft extends IcpOesWaterModuleData {}
