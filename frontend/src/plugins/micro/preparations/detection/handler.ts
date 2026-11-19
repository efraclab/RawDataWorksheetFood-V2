import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { DetectionConfig } from "./config";
import type { SamplePreparationDetection } from "./models";
import { getResultStatus } from "./factory";

const ok = (context: PreparationContext): PreparationResult => ({
  success: true,
  data: context.data,
  errors: [],
  warnings: [],
});

/** Detection tests have no formula. Validation only checks that each preparation has a result. */
export function createDetectionHandler(
  config: DetectionConfig,
  definition: PreparationDefinition,
): PreparationHandler {
  return {
    definition,
    capabilities: {
      collectData: async (context) => ok(context),
      validate: async (context) => {
        const preparations = Array.isArray(context.data.samplePreparations)
          ? (context.data.samplePreparations as SamplePreparationDetection[])
          : [];
        const missing = preparations
          .filter((p) => getResultStatus(p) === "")
          .map((p) => `${config.title}: ${p.label} has no result (Present / Absent).`);
        return {
          success: missing.length === 0,
          data: context.data,
          errors: missing,
          warnings: [],
        };
      },
    },
    execute: async (context) => ok(context),
  };
}
