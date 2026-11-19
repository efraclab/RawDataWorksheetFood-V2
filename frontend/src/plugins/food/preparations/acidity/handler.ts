import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { acidityPreparationDefinition } from "./definition";

export const acidityPreparationHandler: PreparationHandler = {
  definition: acidityPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const data = context.data as any;
      const hasPreparation =
        Boolean(data?.samplePreparation) ||
        (Array.isArray(data?.samplePreparations) && data.samplePreparations.length > 0);
      const errors = hasPreparation ? [] : ["Acidity Sample Preparation is required."];
      return { success: errors.length === 0, data: context.data, errors, warnings: [] };
    },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({
    success: true, data: context.data, errors: [], warnings: [],
  }),
};
