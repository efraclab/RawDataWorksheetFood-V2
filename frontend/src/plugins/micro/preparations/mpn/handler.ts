import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { MpnConfig } from "./config";
import type { SamplePreparationMpn } from "./models";
import { getMissingResult } from "./factory";

const ok = (context: PreparationContext): PreparationResult => ({
  success: true,
  data: context.data,
  errors: [],
  warnings: [],
});

export function createMpnHandler(config: MpnConfig, definition: PreparationDefinition): PreparationHandler {
  return {
    definition,
    capabilities: {
      collectData: async (context) => ok(context),
      validate: async (context) => {
        const preparations = Array.isArray(context.data.samplePreparations)
          ? (context.data.samplePreparations as SamplePreparationMpn[])
          : [];
        const errors = preparations
          .map((p) => ({ p, missing: getMissingResult(config, p) }))
          .filter((x) => x.missing !== "")
          .map((x) => `${config.title}: ${x.p.label} has no ${x.missing}.`);
        return { success: errors.length === 0, data: context.data, errors, warnings: [] };
      },
    },
    execute: async (context) => ok(context),
  };
}
