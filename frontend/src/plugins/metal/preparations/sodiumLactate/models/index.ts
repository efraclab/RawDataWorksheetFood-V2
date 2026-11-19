export type { CalculationSodiumLactate } from "./CalculationSodiumLactate";

export type {
  SamplePreparationSodiumLactate,
  SamplePreparationSodiumLactateStep,
} from "./SamplePreparationSodiumLactate";

export interface SodiumLactateFile {
  readonly id: string | number;
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
  readonly fileDataBase64?: string | null;
}

/**
 * State owned by the Metal SODIUM LACTATE module.
 *
 * Core stores this as:
 * PreparationDraft.modules["metal.sodiumLactate"]
 */
export interface SodiumLactateModuleData {
  samplePreparations: import("./SamplePreparationSodiumLactate").SamplePreparationSodiumLactate[];
  files: SodiumLactateFile[];
  calculations: import("./CalculationSodiumLactate").CalculationSodiumLactate[];
  completed: boolean;
  completedAt: string | null;
}

/**
 * Payload returned by SodiumLactatePreparationModule.getDraft().
 *
 * Core adds the outer activeGroups/modules envelope.
 */
export interface SodiumLactateModuleDraft extends SodiumLactateModuleData {}
