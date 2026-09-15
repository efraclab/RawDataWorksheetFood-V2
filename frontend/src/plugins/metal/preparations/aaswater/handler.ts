import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { aaswaterPreparationDefinition } from "./definition";
import type { CalculationAasWater } from "./models/CalculationAasWater";
import type { AasWaterModuleDraft } from "./models/index";
import { calculateAasWater } from "./calculation";

export const AASWATER_BACKEND_PREPARATION_TYPE = "aaswater";
export const AASWATER_BACKEND_CALCULATION_TYPE = "aaswater";

export interface AasWaterValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAasWaterCalculation(
  calculation: CalculationAasWater,
): AasWaterValidationResult {
  const errors: string[] = [];

  const required = [
    [
      "Instrument Concentration (Sample)",
      calculation.instrumentConcentrationSample,
      false,
    ],
    [
      "Instrument Concentration (Blank)",
      calculation.instrumentConcentrationBlank,
      false,
    ],
    ["Dilution Factor 1 (V1)", calculation.v1, true],
    ["Dilution Factor 2 (V2)", calculation.v2, true],
  ] as const;

  for (const [label, value, positive] of required) {
    if (value === null || value === undefined || String(value).trim() === "") {
      errors.push(`${label} is required`);
      continue;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      errors.push(`${label} must be numeric`);
      continue;
    }

    if (positive && numeric <= 0) {
      errors.push(`${label} must be greater than 0`);
      continue;
    }

    if (!positive && numeric < 0) {
      errors.push(`${label} cannot be negative`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function runAasWaterCalculation(calculation: CalculationAasWater) {
  return calculateAasWater({
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    dilutionFactor1: calculation.v1,
    dilutionFactor1Unit: calculation.v1Unit,
    dilutionFactor2: calculation.v2,
    dilutionFactor2Unit: calculation.v2Unit,
  });
}

export function mapAasWaterDraftToPreparations(
  draft: AasWaterModuleDraft | undefined,
) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: AASWATER_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapAasWaterDraftToCalculations(
  draft: AasWaterModuleDraft | undefined,
) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: AASWATER_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit:
      calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    v1: calculation.v1,
    v1Unit: calculation.v1Unit,
    v2: calculation.v2,
    v2Unit: calculation.v2Unit,
    acceptanceLimitMin: calculation.acceptanceLimitMin,
    acceptanceLimitMax: calculation.acceptanceLimitMax,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapAasWaterDraftToFiles(draft: AasWaterModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: AASWATER_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapAasWaterDraftToPersistence(
  draft: AasWaterModuleDraft | undefined,
) {
  return {
    preparationType: AASWATER_BACKEND_PREPARATION_TYPE,
    calculationType: AASWATER_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.aaswater",
    preparations: mapAasWaterDraftToPreparations(draft),
    calculations: mapAasWaterDraftToCalculations(draft),
    files: mapAasWaterDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const aaswaterPreparationHandler: PreparationHandler = {
  definition: aaswaterPreparationDefinition,
  capabilities: {
    collectData: async (
      context: PreparationContext,
    ): Promise<PreparationResult> => ({
      success: true,
      data: context.data,
      errors: [],
      warnings: [],
    }),

    validate: async (
      context: PreparationContext,
    ): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") {
        return {
          success: false,
          data: context.data,
          errors: ["AAS (Water) calculation data is required."],
          warnings: [],
        };
      }

      const validation = validateAasWaterCalculation(
        calculation as CalculationAasWater,
      );

      return {
        success: validation.valid,
        data: context.data,
        errors: validation.errors,
        warnings: [],
      };
    },

    calculate: async (
      context: PreparationContext,
    ): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") {
        return {
          success: false,
          data: context.data,
          errors: ["AAS (Water) calculation data is required."],
          warnings: [],
        };
      }

      const result = runAasWaterCalculation(calculation as CalculationAasWater);

      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "mg/L" : null,
        },
        errors: result.success
          ? []
          : [result.error ?? "AAS (Water) calculation failed."],
        warnings: [],
      };
    },
  },

  execute: async (
    context: PreparationContext,
  ): Promise<PreparationResult> => ({
    success: true,
    data: context.data,
    errors: [],
    warnings: [],
  }),
};
