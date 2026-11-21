import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import type { PreparationDefinition } from "../../../../core/preparation/contracts/PreparationDefinition";
import type { ResidueConfig } from "./config";
import type { CalculationResidue, ResidueModuleDraft } from "./models";
import { calculateResidue, isPositiveNumber } from "./calculation";
import { RESULT_UNIT, getTemplate, summarizeBlanks } from "./factory";

export function validateResidueCalculation(calculation: CalculationResidue) {
  const errors: string[] = [];
  if (!isPositiveNumber(calculation.dilutionFactor))
    errors.push("Dilution factor is required and must be a number greater than 0");
  if (!Array.isArray(calculation.analytes) || calculation.analytes.length === 0)
    errors.push("At least one analyte row is required");
  return { valid: errors.length === 0, errors };
}

export function createResidueHandler(
  config: ResidueConfig,
  definition: PreparationDefinition,
): PreparationHandler {
  const missing = (context: PreparationContext): PreparationResult => ({
    success: false,
    data: context.data,
    errors: [`${config.title} calculation data is required.`],
    warnings: [],
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
        if (!calculation || typeof calculation !== "object") return missing(context);
        const v = validateResidueCalculation(calculation as CalculationResidue);
        return { success: v.valid, data: context.data, errors: v.errors, warnings: [] };
      },
      calculate: async (context: PreparationContext): Promise<PreparationResult> => {
        const calculation = context.data.calculation;
        if (!calculation || typeof calculation !== "object") return missing(context);
        const calc = calculation as CalculationResidue;
        const first = calc.analytes?.[0];
        const r = calculateResidue({
          concentration: first?.concentration,
          dilutionFactor: calc.dilutionFactor,
        });
        return {
          success: r.success,
          data: {
            ...context.data,
            calculationResult: r.ugKg,
            calculationResultUnit: r.success ? RESULT_UNIT : null,
          },
          errors: r.success ? [] : [r.error ?? `${config.title} calculation failed.`],
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

export function mapResidueDraftToPreparations(
  config: ResidueConfig,
  draft: ResidueModuleDraft | undefined,
) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: config.persistenceType,
    assignedStandardId: null,
    // The print report shows only value1, so template steps also carry the filled sentence there.
    // The module restores the blanks from `blanks`, not from this text.
    steps: JSON.stringify(
      preparation.steps.map((step) => {
        const template = step.blanks ? getTemplate(config, step.name) : undefined;
        return template ? { ...step, value1: summarizeBlanks(template, step.blanks) } : step;
      }),
    ),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapResidueDraftToCalculations(
  config: ResidueConfig,
  draft: ResidueModuleDraft | undefined,
) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: config.persistenceType,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    formula: calculation.formula,
    dilutionFactor: calculation.dilutionFactor,
    resultBreakdown: calculation.resultBreakdown,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
    // Full copy so the module can restore every field (all analyte rows) on reload.
    data: JSON.stringify(calculation),
  }));
}

export function mapResidueDraftToFiles(
  config: ResidueConfig,
  draft: ResidueModuleDraft | undefined,
) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: config.persistenceType,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapResidueDraftToPersistence(
  config: ResidueConfig,
  draft: ResidueModuleDraft | undefined,
) {
  return {
    preparationType: config.persistenceType,
    calculationType: config.persistenceType,
    activeGroup: config.moduleId,
    preparations: mapResidueDraftToPreparations(config, draft),
    calculations: mapResidueDraftToCalculations(config, draft),
    files: mapResidueDraftToFiles(config, draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}