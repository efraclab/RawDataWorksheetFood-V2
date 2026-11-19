import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import { soilCa2PlusPreparationDefinition } from "./definition";

const ok = async (context: PreparationContext): Promise<PreparationResult> => ({
  success: true,
  data: context.data,
  errors: [],
  warnings: [],
});

export const soilCa2PlusPreparationHandler: PreparationHandler = {
  definition: soilCa2PlusPreparationDefinition,
  capabilities: {
    collectData: ok,
    validate: ok,
    calculate: ok,
  },
  execute: ok,
};
