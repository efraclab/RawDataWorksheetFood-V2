import type {
  PreparationContext,
  PreparationDefinition,
  PreparationResult,
} from "../contracts";

export interface PreparationHandler {
  definition: PreparationDefinition;

  execute(
    context: PreparationContext
  ): Promise<PreparationResult>;
}

export class PreparationRuntime {
  async execute(
    handler: PreparationHandler,
    context: PreparationContext
  ): Promise<PreparationResult> {
    return handler.execute(context);
  }
}