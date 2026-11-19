import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { FormulaConfig } from "./config";
import type { SamplePreparationFormula } from "./models";
import { runFormula } from "./factory";

const ok = (context: PreparationContext): PreparationResult => ({
  success: true,
  data: context.data,
  errors: [],
  warnings: [],
});

export function createFormulaHandler(config: FormulaConfig, definition: PreparationDefinition): PreparationHandler {
  return {
    definition,
    capabilities: {
      collectData: async (context) => ok(context),
      calculate: async (context) => {
        const preparations = Array.isArray(context.data.samplePreparations)
          ? (context.data.samplePreparations as SamplePreparationFormula[])
          : [];
        const results = preparations.map((p) => ({ label: p.label, ...runFormula(config, p) }));
        const errors = results
          .filter((r) => r.value === null)
          .map((r) => `${config.title}: ${r.label}: ${r.error ?? "result cannot be calculated"}`);
        return {
          success: errors.length === 0,
          data: { ...context.data, results, unit: config.unit },
          errors,
          warnings: [],
        };
      },
    },
    execute: async (context) => ok(context),
  };
}
