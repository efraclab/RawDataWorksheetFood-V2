import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { orsPreparationDefinition } from "./definition";
import type { CalculationOrs } from "./models/CalculationOrs";
import type { OrsModuleDraft } from "./models/index";
import { calculateOrs } from "./calculation";

export const ORS_BACKEND_PREPARATION_TYPE = "ors";
export const ORS_BACKEND_CALCULATION_TYPE = "ors";

export interface OrsValidationResult { valid: boolean; errors: string[]; }

export function validateOrsCalculation(calculation: CalculationOrs): OrsValidationResult {
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
    ["Sachet Weight (Avg)", calculation.sachetWeight, true],
    ["Molecular Weight", calculation.molecularWeight, true],
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

export function runOrsCalculation(calculation: CalculationOrs) {
  return calculateOrs({
    instrumentConcentrationSample: calculation.instrumentConcentrationSample,
    instrumentConcentrationSampleUnit: calculation.instrumentConcentrationSampleUnit,
    instrumentConcentrationBlank: calculation.instrumentConcentrationBlank,
    instrumentConcentrationBlankUnit: calculation.instrumentConcentrationBlankUnit,
    sampleWeight: calculation.sw1,
    volumeMakeup: calculation.v1,
    dilutionFactor1: calculation.v2Factor,
    dilutionVolume1: calculation.v2Volume,
    dilutionFactor2: calculation.v3Factor,
    dilutionVolume2: calculation.v3Volume,
    sachetWeight: calculation.sachetWeight,
    molecularWeight: calculation.molecularWeight,
    labelClaimBase: calculation.labelClaimBase,
    labelClaimValue: calculation.labelClaimValue,
  });
}

export function mapOrsDraftToPreparations(draft: OrsModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: ORS_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapOrsDraftToCalculations(draft: OrsModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: ORS_BACKEND_CALCULATION_TYPE,
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
    sachetWeight: calculation.sachetWeight,
    sachetWeightUnit: calculation.sachetWeightUnit,
    molecularWeight: calculation.molecularWeight,
    labelClaimBase: calculation.labelClaimBase,
    labelClaimValue: calculation.labelClaimValue,
    acceptanceLimitMin: calculation.acceptanceLimitMin,
    acceptanceLimitMax: calculation.acceptanceLimitMax,
    calculationResult: calculation.calculationResult,
    calculationResultUnit: calculation.calculationResultUnit,
  }));
}

export function mapOrsDraftToFiles(draft: OrsModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: ORS_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapOrsDraftToPersistence(draft: OrsModuleDraft | undefined) {
  return {
    preparationType: ORS_BACKEND_PREPARATION_TYPE,
    calculationType: ORS_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.ors",
    preparations: mapOrsDraftToPreparations(draft),
    calculations: mapOrsDraftToCalculations(draft),
    files: mapOrsDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const orsPreparationHandler: PreparationHandler = {
  definition: orsPreparationDefinition,
  capabilities: {
    collectData: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
    validate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ORS calculation data is required."], warnings: [] };
      const validation = validateOrsCalculation(calculation as CalculationOrs);
      return { success: validation.valid, data: context.data, errors: validation.errors, warnings: [] };
    },
    calculate: async (context: PreparationContext): Promise<PreparationResult> => {
      const calculation = context.data.calculation;
      if (!calculation || typeof calculation !== "object") return { success: false, data: context.data, errors: ["ORS calculation data is required."], warnings: [] };
      const result = runOrsCalculation(calculation as CalculationOrs);
      return {
        success: result.success,
        data: { ...context.data, calculationResult: result.result, calculationResultUnit: result.success ? "% of L.C." : null },
        errors: result.success ? [] : [result.error ?? "ORS calculation failed."],
        warnings: [],
      };
    },
  },
  execute: async (context: PreparationContext): Promise<PreparationResult> => ({ success: true, data: context.data, errors: [], warnings: [] }),
};
