import type {
  PreparationCapabilities,
} from "../contracts/PreparationCapabilities";

import type {
  PreparationContext,
} from "../contracts/PreparationContext";

import type {
  PreparationDefinition,
} from "../contracts/PreparationDefinition";

import type {
  PreparationResult,
} from "../contracts/PreparationResult";

export interface PreparationHandler {
  definition: PreparationDefinition;

  capabilities: PreparationCapabilities;

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