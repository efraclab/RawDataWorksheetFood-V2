import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import { so2StackPreparationDefinition } from "./definition";

const ok = async (context: PreparationContext): Promise<PreparationResult> => ({
  success: true, data: context.data, errors: [], warnings: [],
});

export const so2StackPreparationHandler: PreparationHandler = {
  definition: so2StackPreparationDefinition,
  capabilities: { collectData: ok, validate: ok, calculate: ok },
  execute: ok,
};
