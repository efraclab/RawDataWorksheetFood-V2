export type { CalculationZptoShampoo } from "./CalculationZptoShampoo";

export type {
  SamplePreparationZptoShampoo,
  SamplePreparationZptoShampooStep,
} from "./SamplePreparationZptoShampoo";

export interface ZptoShampooFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal ZPTO SHAMPOO module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.zptoShampoo"]
 */
export interface ZptoShampooModuleData {
  samplePreparations: import("./SamplePreparationZptoShampoo").SamplePreparationZptoShampoo[];
  files: ZptoShampooFile[];
  calculations: import("./CalculationZptoShampoo").CalculationZptoShampoo[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by ZptoShampooPreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface ZptoShampooModuleDraft extends ZptoShampooModuleData {}
