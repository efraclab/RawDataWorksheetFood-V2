import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { anoferPreparationDefinition } from "./definition";
import type { CalculationAnofer } from "./models/CalculationAnofer";
import type { AnoferModuleDraft } from "./models/index";
import { calculateAnofer } from "./calculation";

export const ANOFER_BACKEND_PREPARATION_TYPE = "anofer";
export const ANOFER_BACKEND_CALCULATION_TYPE = "anofer";

export interface AnoferValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAnoferCalculation(
  calculation: CalculationAnofer,
): AnoferValidationResult {
  const errors: string[] = [];
  const required: Array<[string, unknown, boolean]> = [
    ["Instrument Concentration (Sample)", calculation.instrumentConcentrationSample, false],
    ["Instrument Concentration (Blank)", calculation.instrumentConcentrationBlank, false],
    ["Sample Weight", calculation.sw1, true],
    ["Volume Makeup", calculation.v1, true],
    ["Dilution Factor 1 (V2 factor)", calculation.v2Factor, true],
    ["Dilution Factor 1 (V2 volume)", calculation.v2Volume, true],
    ["Dilution Factor 2 (V3 factor)", calculation.v3Factor, true],
    ["Dilution Factor 2 (V3 volume)", calculation.v3Volume, true],
    ["Dilution Factor 3 (V4 factor)", calculation.v4Factor, true],
    ["Dilution Factor 3 (V4 volume)", calculation.v4Volume, true],
    ["Avg. Weight", calculation.avgWeight, true],
    ["Label Claim first value", calculation.labelClaimBase, true],
    ["Label Claim second value", calculation.labelClaimValue, true],
  ];

  for (const [label, value, positive] of required) {
    if (value === null || value === undefined || String(value).trim() === "") {
      errors.push(`${label} is required`);
      continue;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) errors.push(`${label} must be numeric`);
    else if (positive && numeric <= 0) errors.push(`${label} must be greater than 0`);
    else if (!positive && numeric < 0) errors.push(`${label} cannot be negative`);
  }

  return { valid: errors.length === 0, errors };
}

export function runAnoferCalculation(calculation: CalculationAnofer) {
  return calculateAnofer({
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    sampleWeight: calculation.sw1,
    sampleWeightUnit: calculation.sw1Unit,
    volumeMakeup: calculation.v1,
    volumeMakeupUnit: calculation.v1Unit,
    dilutionFactor1: calculation.v2Factor,
    dilutionVolume1: calculation.v2Volume,
    dilutionVolume1Unit: calculation.v2VolumeUnit,
    dilutionFactor2: calculation.v3Factor,
    dilutionVolume2: calculation.v3Volume,
    dilutionVolume2Unit: calculation.v3VolumeUnit,
    dilutionFactor3: calculation.v4Factor,
    dilutionVolume3: calculation.v4Volume,
    dilutionVolume3Unit: calculation.v4VolumeUnit,
    avgWeight: calculation.avgWeight,
    avgWeightUnit: calculation.avgWeightUnit,
    labelClaimBase: calculation.labelClaimBase,
    labelClaimValue: calculation.labelClaimValue,
  });
}

export function mapAnoferDraftToPreparations(draft: AnoferModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: ANOFER_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapAnoferDraftToCalculations(draft: AnoferModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: ANOFER_BACKEND_CALCULATION_TYPE,
    selectedSamplePreparationLabel: calculation.selectedSamplePreparationLabel,
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    sw1: calculation.sw1,
    sw1Unit: calculation.sw1Unit,
    v1: calculation.v1,
    v1Unit: calculation.v1Unit,
    v2Factor: calculation.v2Factor,
    v2Volume: calculation.v2Volume,
    v2VolumeUnit: calculation.v2VolumeUnit,
    v3Factor: calculation.v3Factor,
    v3Volume: calculation.v3Volume,
    v3VolumeUnit: calculation.v3VolumeUnit,
    v4Factor: calculation.v4Factor,
    v4Volume: calculation.v4Volume,
    v4VolumeUnit: calculation.v4VolumeUnit,
    avgWeight: calculation.avgWeight,
    avgWeightUnit: calculation.avgWeightUnit,
    labelClaimBase: calculation.labelClaimBase,
    labelClaimValue: calculation.labelClaimValue,
    acceptanceLimitMin: calculation.acceptanceLimitMin,
    acceptanceLimitMax: calculation.acceptanceLimitMax,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapAnoferDraftToFiles(draft: AnoferModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: ANOFER_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapAnoferDraftToPersistence(draft: AnoferModuleDraft | undefined) {
  return {
    preparationType: ANOFER_BACKEND_PREPARATION_TYPE,
    calculationType: ANOFER_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.anofer",
    preparations: mapAnoferDraftToPreparations(draft),
    calculations: mapAnoferDraftToCalculations(draft),
    files: mapAnoferDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const anoferPreparationHandler: PreparationHandler = {
  definition: anoferPreparationDefinition,
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
          errors: ["Anofer calculation data is required."],
          warnings: [],
        };
      }
      const validation = validateAnoferCalculation(calculation as CalculationAnofer);
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
          errors: ["Anofer calculation data is required."],
          warnings: [],
        };
      }
      const result = runAnoferCalculation(calculation as CalculationAnofer);
      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "% of L.C." : null,
        },
        errors: result.success ? [] : [result.error ?? "Anofer calculation failed."],
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
