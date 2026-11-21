import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { GasTestConfig } from "./config";
import type { GasModuleDraft } from "./models";
import { calculateGas } from "./factory";

export function createGasHandler(
  config: GasTestConfig,
  definition: PreparationDefinition,
): PreparationHandler {
  const ok = (context: PreparationContext): PreparationResult => ({
    success: true,
    data: context.data,
    errors: [],
    warnings: [],
  });

  return {
    definition,
    capabilities: {
      collectData: async (context: PreparationContext) => ok(context),
      validate: async (context: PreparationContext): Promise<PreparationResult> => {
        const values = context.data.values;
        if (!values || typeof values !== "object")
          return {
            success: false,
            data: context.data,
            errors: [`${config.title} raw values are required.`],
            warnings: [],
          };
        const r = calculateGas(config, values as Record<string, string>);
        return {
          success: r.success,
          data: context.data,
          errors: r.success ? [] : [r.error ?? "Invalid values"],
          warnings: [],
        };
      },
      calculate: async (context: PreparationContext): Promise<PreparationResult> => {
        const values = (context.data.values ?? {}) as Record<string, string>;
        const r = calculateGas(config, values);
        return {
          success: r.success,
          data: {
            ...context.data,
            calculationResult: r.result,
            calculationResultUnit: r.success ? config.unit : null,
          },
          errors: r.success ? [] : [r.error ?? `${config.title} calculation failed.`],
          warnings: [],
        };
      },
    },
    execute: async (context: PreparationContext) => ok(context),
  };
}

export function mapGasDraftToPersistence(
  config: GasTestConfig,
  draft: GasModuleDraft | undefined,
) {
  return {
    preparationType: config.key,
    calculationType: config.key,
    activeGroup: `gas.${config.key}`,
    preparations: (draft?.samplePreparations ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      preparationCategory: "sample",
      preparationType: config.key,
      assignedStandardId: null,
      steps: JSON.stringify(p.steps),
      content: null,
      isPreparationCompleted: Boolean(draft?.completed),
      completedAt: draft?.completedAt ?? null,
    })),
    calculations: (draft?.calculations ?? []).map((c) => ({
      id: c.id,
      label: c.label,
      calculationType: config.key,
      selectedSamplePreparationLabel: c.selectedSamplePreparationLabel,
      formula: c.formula,
      resultBreakdown: c.resultBreakdown,
      calculationResult: c.calculationResult,
      calculationResultUnit: c.calculationResultUnit,
      data: JSON.stringify(c),
    })),
    files: (draft?.files ?? []).map((f) => ({
      id: f.id,
      preparationType: config.key,
      label: f.name,
      fileName: f.name,
      fileDataBase64: f.fileDataBase64,
    })),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}