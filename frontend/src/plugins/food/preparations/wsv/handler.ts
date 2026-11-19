import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { wsvPreparationDefinition } from "./definition";

export const wsvPreparationHandler: PreparationHandler = {
  definition: wsvPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true, data: context.data, errors: [], warnings: [],
    }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const data = context.data as any;
      const hasPreparation =
        Boolean(data?.samplePreparation) ||
        (Array.isArray(data?.samplePreparations) && data.samplePreparations.length > 0);
      const errors = hasPreparation ? [] : ["WSV (Water Soluble Vitamins) Sample Preparation is required."];
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
