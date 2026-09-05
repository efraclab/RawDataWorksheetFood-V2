import type {
  PreparationCapabilities,
} from "../contracts/PreparationCapabilities";

import type {
  PreparationContext,
} from "../contracts/PreparationContext";

import type {
  PreparationResult,
} from "../contracts/PreparationResult";

export type PreparationCapability =
  | "collectData"
  | "validate"
  | "calculate"
  | "workflow"
  | "result";

export class PreparationCapabilityExecutor {
  async execute(
    capability: PreparationCapability,
    capabilities: PreparationCapabilities,
    context: PreparationContext
  ): Promise<PreparationResult> {
    const operation = capabilities[capability];

    if (!operation) {
      return {
        success: true,
        data: context.data,
      };
    }

    return operation(context);
  }
}