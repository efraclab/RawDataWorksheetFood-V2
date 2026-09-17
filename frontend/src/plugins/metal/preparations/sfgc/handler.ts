import type { PreparationHandler } from "../../../../core/preparation/runtime/PreparationRuntime";
import type { PreparationContext } from "../../../../core/preparation/contracts/PreparationContext";
import type { PreparationResult } from "../../../../core/preparation/contracts/PreparationResult";
import { sfgcPreparationDefinition } from "./definition";
import type { CalculationSfgc } from "./models/CalculationSfgc";
import type { SfgcModuleDraft } from "./models/index";
import { calculateSfgc } from "./calculation";

export const SFGC_BACKEND_PREPARATION_TYPE = "sfgc";
export const SFGC_BACKEND_CALCULATION_TYPE = "sfgc";

export interface SfgcValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSfgcCalculation(calculation: CalculationSfgc): SfgcValidationResult {
  const required: Array<[string, unknown]> = [["Instrument Concentration (Sample)",calculation.instrumentConcentrationSample],["Instrument Concentration (Blank)",calculation.instrumentConcentrationBlank],["Sample Weight",calculation.sw1],["V2 factor",calculation.v2Factor],["V2 volume",calculation.v2Volume],["V3 factor",calculation.v3Factor],["V3 volume",calculation.v3Volume],["V1 volume",calculation.v1]];
  const errors:string[]=[];
  for(const [label,value] of required){if(value===null||value===undefined||String(value).trim()===''||!Number.isFinite(Number(value)))errors.push(`${label} is required and must be numeric`);}
  return {valid:errors.length===0,errors};
}

export function runSfgcCalculation(calculation: CalculationSfgc) {
  return calculateSfgc({sample:calculation.instrumentConcentrationSample,blank:calculation.instrumentConcentrationBlank,v1Volume:calculation.v1,v2Factor:calculation.v2Factor,v2Volume:calculation.v2Volume,v3Factor:calculation.v3Factor,v3Volume:calculation.v3Volume,sampleWeight:calculation.sw1});
}

export function mapSfgcDraftToPreparations(draft: SfgcModuleDraft | undefined) {
  return (draft?.samplePreparations ?? []).map((preparation) => ({
    id: preparation.id,
    label: preparation.label,
    preparationCategory: "sample",
    preparationType: SFGC_BACKEND_PREPARATION_TYPE,
    assignedStandardId: null,
    steps: JSON.stringify(preparation.steps),
    content: null,
    isPreparationCompleted: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  }));
}

export function mapSfgcDraftToCalculations(draft: SfgcModuleDraft | undefined) {
  return (draft?.calculations ?? []).map((calculation) => ({
    id: calculation.id,
    label: calculation.label,
    calculationType: SFGC_BACKEND_CALCULATION_TYPE,
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

export function mapSfgcDraftToFiles(draft: SfgcModuleDraft | undefined) {
  return (draft?.files ?? []).map((file) => ({
    id: file.id,
    preparationType: SFGC_BACKEND_PREPARATION_TYPE,
    label: file.name,
    fileName: file.name,
    fileDataBase64: file.fileDataBase64,
  }));
}

export function mapSfgcDraftToPersistence(draft: SfgcModuleDraft | undefined) {
  return {
    preparationType: SFGC_BACKEND_PREPARATION_TYPE,
    calculationType: SFGC_BACKEND_CALCULATION_TYPE,
    activeGroup: "metal.sfgc",
    preparations: mapSfgcDraftToPreparations(draft),
    calculations: mapSfgcDraftToCalculations(draft),
    files: mapSfgcDraftToFiles(draft),
    completed: Boolean(draft?.completed),
    completedAt: draft?.completedAt ?? null,
  };
}

export const sfgcPreparationHandler: PreparationHandler = {
  definition: sfgcPreparationDefinition,
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
          errors: ["Sfgc calculation data is required."],
          warnings: [],
        };
      }
      const validation = validateSfgcCalculation(calculation as CalculationSfgc);
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
          errors: ["Sfgc calculation data is required."],
          warnings: [],
        };
      }
      const result = runSfgcCalculation(calculation as CalculationSfgc);
      return {
        success: result.success,
        data: {
          ...context.data,
          calculationResult: result.result,
          calculationResultUnit: result.success ? "%" : null,
        },
        errors: result.success ? [] : [result.error ?? "Sfgc calculation failed."],
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
