import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import { cyanidePreparationDefinition } from "./definition";

export const cyanidePreparationHandler: PreparationHandler = {
  definition: cyanidePreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
    calculate: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({
    success: true, data: context.data, errors: [], warnings: [],
  }),
};
