import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { PlateCountConfig } from "./config";
import type { CalculationPlateCount, PlateCountModuleDraft } from "./models";
import { calculatePlateCount } from "./calculation";
import { summarizeConfirm, summarizeCounts, summarizePlates } from "./factory";

export interface PlateCountValidationResult {
  valid: boolean;
  errors: string[];
}

const isPositiveNumber = (value: unknown) =>
  value !== null &&
  value !== undefined &&
  String(value).trim() !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) > 0;

export function validatePlateCountCalculation(
  calculation: CalculationPlateCount,
): PlateCountValidationResult {
  const errors: string[] = [];
  if (!isPositiveNumber(calculation.replicationFactor))
    errors.push("Replication factor is required and must be a number greater than 0");
  if (!isPositiveNumber(calculation.dilutionFactor))
    errors.push("Dilution factor is required and must be a number greater than 0");
  return { valid: errors.length === 0, errors };
}

export function createPlateCountHandler(
  config: PlateCountConfig,
  definition: PreparationDefinition,
): PreparationHandler {
  const runCalculation = (
    calculation: CalculationPlateCount,
    rows: ReadonlyArray<ReadonlyArray<string | undefined>>,
  ) =>
    calculatePlateCount({
      rows,
      replicationFactor: calculation.replicationFactor,
      dilutionFactor: calculation.dilutionFactor,
    });

  return {
    definition,
    capabilities: {
      collectData: async (context: PreparationContext): Promise<PreparationResult> => ({
        success: true,
        data: context.data,
        errors: [],
        warnings: [],
      }),
      validate: async (context: PreparationContext): Promise<PreparationResult> => {
        const calculation = context.data.calculation;
        if (!calculation || typeof calculation !== "object") {
          return {
            success: false,
            data: context.data,
            errors: [`${config.title} calculation data is required.`],
            warnings: [],
          };
        }
        const validation = validatePlateCountCalculation(
          calculation as CalculationPlateCount,
        );
        return {
          success: validation.valid,
          data: context.data,
          errors: validation.errors,
          warnings: [],
        };
      },
      calculate: async (context: PreparationContext): Promise<PreparationResult> => {
        const calculation = context.data.calculation;
        if (!calculation || typeof calculation !== "object") {
          return {
            success: false,
            data: context.data,
            errors: [`${config.title} calculation data is required.`],
            warnings: [],
          };
        }
        const rows = Array.isArray(context.data.rows)
          ? (context.data.rows as string[][])
          : [];
        const result = runCalculation(calculation as CalculationPlateCount, rows);
        return {
          success: result.success,
          data: {
            ...context.data,
            calculationResult: result.result,
            calculationResultUnit: result.success ? config.resultUnit : null,
          },
          errors: result.success ? [] : [result.error ?? `${config.title} calculation failed.`],
          warnings: [],
        };
      },
    },
    execute: async (context: PreparationContext): Promise<PreparationResult> => ({
      success: true,
      data: context.data,
      errors: [],
      warnings: [],
    }),
  };
}

export function mapPlateCountDraftToPreparations(
  config: PlateCountConfig,
  draft: PlateCountModuleDraft | undefined,
) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: config.persistenceType,
    assignedStandardId: null,
    // The print report shows only value1 of each step and ignores `counts`,
    // so each replicate and confirmation row also carries a readable summary in value1.
    // The module restores the grid from `counts`, not from this text.
    steps: JSON.stringify(
      preparation.steps.map((step) =>
        step.counts
          ? { ...step, value1: summarizeCounts(step.counts) }
          : step.confirm
            ? { ...step, value1: summarizeConfirm(step.confirm) }
            : step.plates
              ? { ...step, value1: summarizePlates(step.plates, config) }
              : step,
      ),
    ),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapPlateCountDraftToCalculations(
  config: PlateCountConfig,
  draft: PlateCountModuleDraft | undefined,
) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: config.persistenceType,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    replicationFactor: calculation.replicationFactor,
    dilutionFactor: calculation.dilutionFactor,
    totalColonies: calculation.totalColonies,
    resultBreakdown: calculation.resultBreakdown,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
    // Full copy so the module can restore every field on reload.
    data: JSON.stringify(calculation),
  }));
}

export function mapPlateCountDraftToFiles(
  config: PlateCountConfig,
  draft: PlateCountModuleDraft | undefined,
) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: config.persistenceType,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapPlateCountDraftToPersistence(
  config: PlateCountConfig,
  draft: PlateCountModuleDraft | undefined,
) {
  return {
    preparationType: config.persistenceType,
    calculationType: config.persistenceType,
    activeGroup: config.moduleId,
    preparations: mapPlateCountDraftToPreparations(config, draft),
    calculations: mapPlateCountDraftToCalculations(config, draft),
    files: mapPlateCountDraftToFiles(config, draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}